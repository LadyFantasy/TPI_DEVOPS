import os
import json
from flask import Flask, request, jsonify, render_template
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flaskext.mysql import MySQL
from flask_mail import Mail
from itsdangerous import URLSafeTimedSerializer 
from controllerDB import ControllerDB
from dotenv import load_dotenv
from datetime import datetime as dt, timedelta
from clases.admin import Admin
from clases.unit import Unit
from clases import reports
from clases.guest import Guest
from clases.reservation import Reservation
from clases.sendMail import sendMail
from config import DB_CONFIG, APP_CONFIG


load_dotenv()

app = Flask(__name__)
app.secret_key = APP_CONFIG['secret_key']

app.config['MYSQL_DATABASE_HOST'] = DB_CONFIG['host']
app.config['MYSQL_DATABASE_USER'] = DB_CONFIG['user']
app.config['MYSQL_DATABASE_PASSWORD'] = DB_CONFIG['password']
app.config['MYSQL_DATABASE_PORT'] = DB_CONFIG['port']
app.config['MYSQL_DATABASE_DB'] = DB_CONFIG['database']
app.config['JWT_SECRET_KEY'] = APP_CONFIG['jwt_secret_key']

app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = 465  
app.config['MAIL_USE_TLS'] = False 
app.config['MAIL_USE_SSL'] = True 
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

mail = Mail(app)

db = MySQL()
db.init_app(app) # Inicialización de SQL
DB = ControllerDB(db)
jtw =  JWTManager(app)

# Configuración de CORS para desarrollo y producción
if os.getenv('IS_PRODUCTION') == 'true':
    # En producción, permitir solo el dominio de Vercel
    CORS(app, origins=[
        "https://tpi-devops-git-main-ladyfantasys-projects.vercel.app/*",
        "https://proyecto-ppiv-front.vercel.app/*",
        "https://*.vercel.app/*"  # Para cualquier subdominio de Vercel
    ])
else:
    # En desarrollo, permitir localhost
    CORS(app, origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ])

CORS(app, resources={r"/api/terceros/*": {"origins": ["*"]}})

@app.route("/")
def index():
    with open('resources/info_routes.json', 'r') as f:
        data = json.load(f)  # Cargar el JSON del archivo
    return jsonify(data), 200



@app.route("/login", methods = ['POST'])
def login():
    data = request.get_json()  # Obtiene el JSON de la solicitud

    # Verificación que se haya enviado el JSON
    if not data:
        return jsonify({"error": "No se proporcionó JSON"}), 400

    
    username = data.get("username", None)
    password = data.get("password", None)

    # Verificación que se hayan proporcionado ambos campos
    if not username or not password:
        return jsonify({"error": "Faltan username o password"}), 400
    
    admin = Admin(DB, username, password)
    admin.authenticate()
    if admin.authenticated:
        userIdentity = f'{{"superUser": {json.dumps(admin.superUser)}, "username": {json.dumps(admin.username)}}}'
        accessToken = create_access_token(identity=userIdentity,expires_delta=timedelta(1))  # Crea el token
        return jsonify({"access_token":accessToken, "superUser":admin.superUser}), 200  # Devuelve el token en la respuesta
    else:
        return jsonify({"error": "Credenciales inválidas"}), 401  # Devuelve error si la autenticación falla
       


@app.route("/crearAdmin", methods =['POST'])
@jwt_required()
def crearAdmin():
    userIdentity = json.loads(get_jwt_identity())
    if userIdentity.get("superUser",False):
        data = request.get_json()
        if not data:
            return jsonify({"error": "No se proporcionó JSON"}), 400
        username = data.get("username", None)
        password = data.get("password", None)
        superUser = data.get("superUser", False)
        if not username or not password:
            return jsonify({"error": "Faltan username o password"}), 400
        newAdmin = Admin(DB, username, password, superUser)
        mensaje = newAdmin.save()
        return jsonify({"mensaje": mensaje}), 201
    return jsonify({"error":"Administrador sin permisos necesarios."}), 403


@app.route("/verAdmins")
@jwt_required()
def verAdmins():
    userIdentity = json.loads(get_jwt_identity())
    if userIdentity.get("superUser",False):
        admins = DB.auxVerAdmins()
        admins_dict = {}
        for admin in admins:
            admins_dict[admin[1]] = {"id":admin[0], "username": admin[1],"superUser": admin[3]}
        return jsonify(admins_dict), 200
    return jsonify({"error":"Administrador sin permisos necesarios."}), 403
    
    
@app.route("/deleteAdmin/<int:id>", methods = ['DELETE'])
@jwt_required()
def deleteAdmin(id:int):
    userIdentity = json.loads(get_jwt_identity())
    if userIdentity.get("superUser",False):
        if DB.deleteAdmin(id):
            return jsonify({"message":"Administrador borrado con éxito"}), 200
        return jsonify({"message":"Administrador no encontrado"}), 404
    return jsonify({"error":"Administrador sin permisos necesarios."}), 403
    
@app.route("/editPass", methods = ['POST'])
@jwt_required()
def editPass():
    userIdentity = json.loads(get_jwt_identity())
    email = userIdentity.get("username",False)
    password = request.get_json().get("password")
    if DB.modifyPassAdmin(email, password):
        return jsonify({"message":"Contraseña modificada con éxito"}), 200
    return jsonify({"message":"Administrador no encontrado"}), 404

@app.route("/editAdmin", methods= ["POST"])
def editSuperUser():
    return jsonify(DB.updateSuperAdmin(request))

@app.route("/recoveryPass", methods = ['GET','POST'])
def recoveryPass():
    serializer = URLSafeTimedSerializer(os.getenv('SECRET_KEY'))
    salt = 'password-reset-salt'
    if request.method == 'GET':
        username = request.args.get("username")
        admin = Admin(DB, username,"","")
        if DB.searchAdmin(admin):
            token = serializer.dumps(username, salt)
            urlFront = os.getenv("URL_FRONT")
            resetLink = f"{urlFront}/recoveryPass?token={token}"
            response, code = sendMail(app,username,"Siga el siguiente link para reestablecer su contraseña",[],render_template("/mails/recoveryPass.html", link=resetLink))
            return jsonify(response), code
        return jsonify({"message":"Si el usuario existe, se enviará un correo electrónico con el link de recuperación."}), 200
    elif request.method == 'POST':
        data = request.get_json()
        token = data.get('token')
        password = data.get('password')
        try:
            email = serializer.loads(token,salt=salt,max_age=900)
            if password and email and DB.modifyPassAdmin(email, password):
                return jsonify({"message":"Contraseña modificada con éxito"}), 200
        except:
            return jsonify({"message":"Administrador no encontrado"}), 404


@app.route("/creaUnidad", methods = ['POST'])
@jwt_required()
def createUnit():
    data = request.get_json()
    unit = Unit(data.get("rooms", False), data.get("beds", False), data.get("description", False), data.get("price", False), data.get("amenities", False), data.get("urls_fotos", False), DB, data.get("title", ""),data.get("bathrooms", 0),data.get("address", ""))
    result, code = unit.save()
    return jsonify(result), code

@app.route("/editarUnidad", methods = ['POST'])
@jwt_required()
def editUnit():
    data = request.get_json()
    unit = Unit(data.get("rooms", False), data.get("beds", False), data.get("description", False), data.get("price", False), data.get("amenities", False), data.get("urls_fotos", False), DB, data.get("title", ""),data.get("bathrooms", 0),data.get("address", ""), data.get("id"))
    result, code = unit.edit()
    return jsonify(result), code


@app.route("/eliminarUnidad", methods = ['POST'])
@jwt_required()
def deleteUnit():
    id = request.get_json().get("id",None)
    message, code = {'message' : 'Parametro id no encontrado'}, 404
    if id:
        message, code = DB.deleteUnit(id)
    return jsonify(message), code

@app.route("/api/terceros/units/", methods=["GET", "POST"])
def units():
    id = request.args.get('id')
    if request.method == "GET":
        if id:
            lista = jsonify(DB.searchUnits({"id":id}))
        else:
            lista = jsonify(DB.searchUnits()) 
        if lista:
            code = 200
        else:
            code = 404
        return lista, code
    elif request.method == "POST":
        criteria = request.get_json()
        check_in_date, check_out_date = dt.strptime(criteria["check_in_date"],"%Y-%m-%d").date() , dt.strptime(criteria["check_out_date"],"%Y-%m-%d").date()
        units = DB.searchUnits(criteria)
        multipler = Unit.calculateMultipler(check_in_date, check_out_date, DB)
        for unit in units:
            unit["price"] = round(float(unit["price"]) * multipler)
            unit_id = unit['id']
            unit_price = unit['price']
            dataToken = f'{{"id": {unit_id}, "price": {unit_price}}}'
            unit["token"] = create_access_token(identity=dataToken,expires_delta=timedelta(hours=5))
        if units:
            code = 200
        else:
            code = 404
        return jsonify(units), code


@app.route("/informes")
@jwt_required()
def generateReports():
    message = {}
    recipient = json.loads(get_jwt_identity()).get("username")
    message, code = reports.sendReports(app, recipient, DB, render_template("/mails/informes.html"))
    return jsonify(message), code


@app.route("/api/terceros/almacenaReserva", methods = ['POST'])
@jwt_required()
def saveReservation():
    try:
        data_token = json.loads(get_jwt_identity())
        unit_id = data_token.get("id")
        unit_price = data_token.get("price")
        data = request.get_json()
        dataGuest = data.get("guest")
        if unit_id == data.get("unit_id"):
            guest = Guest(dataGuest.get("name"), dataGuest.get("mail"),dataGuest.get("phone"),DB)
            guestId = guest.save()
            reservation = Reservation(unit_id, guestId, dt.strptime(data.get("check_in_date"),"%Y-%m-%d"), dt.strptime(data.get("check_out_date"),"%Y-%m-%d"), unit_price, data.get("amount_paid"), DB)
            return jsonify(reservation.save()), 201
        else:
            return jsonify({"message":"error en el token, reserva no almacenada"}), 403
    except json.JSONDecodeError:
        return jsonify({"message":"Error: La identidad del token no es un JSON válido."}), 400
        

@app.route("/motor", methods = ['POST','GET'])
@jwt_required()
def datos_multiplicador():
    if request.method == "POST":
        data = request.get_json()
        count = DB.setSeasonRates(data)
        return jsonify({"message": f"Se han creado {count} periodos correctamente."}), 201
    lista = DB.getSeasonRates()
    if lista:
        code = 200
    else:
        code = 404 
    return jsonify(lista), code

@app.route("/verReservas")
def getReservations():
    lista = DB.getDataReservation()
    if lista:
        code = 200
    else:
        code = 404 
    return jsonify(lista), code

@app.route("/cancelarReserva")
@jwt_required()
def cancelReservation():
    id = request.args.get("id")
    if id:
        response, code = DB.cancelReservation(id)
        return jsonify(response),code
    return jsonify({"message":"Id de reserva faltante"}), 400

@app.route("/enviarLinkCheckin")
def sendLinkCheckin():
    # para tomorrow y yesterday se descuentan 3 horas para corregir desfazaje por zona horaria
    tomorrow = (dt.today()-timedelta(hours=3)).date() + timedelta(days=1)
    yesterday = (dt.today()-timedelta(hours=3)).date() - timedelta(days=1)
    reservationsForTomorrow, reservationsFinishedYesterday = DB.getReservation_mail(tomorrow,yesterday)    
    urlFront = os.getenv("URL_FRONT")
    messages = {}
    for reservation in reservationsForTomorrow:
        link = f"{urlFront}/checkin/{reservation[0]}"
        # se envian mails de check-in
        messages[reservation[1]] = sendMail(app,reservation[1],"Check-in",[],render_template("/mails/checkin.html", link=link))[0]["message"]
    for reservaton in reservationsFinishedYesterday:
        # se envian mails de encuesta
        link = f"{urlFront}/encuesta/{reservation[0]}"
        messages[reservation[1]] = sendMail(app,reservation[1],"Encuesta",[],render_template("/mails/linkEncuesta.html", link=link))[0]["message"]
    return jsonify(messages), 200

@app.route("/checkin")
def checkin():
    id = request.args.get('id')
    unitTitle = DB.getUnitForReservationById(id)
    if unitTitle:
        DB.setCheckedIn(id)
        return jsonify({"message":"Check-in realizado con éxito","unit":unitTitle[0]}), 200
    return jsonify({"message":"Reserva no encontrada"}),400

@app.route("/encuesta", methods = ["POST"])
def encuesta():
    result,code = DB.uploadSurvey(request)
    return jsonify(result), code




if __name__ == "__main__":
     app.run(debug=True, host="0.0.0.0", port=5000)

