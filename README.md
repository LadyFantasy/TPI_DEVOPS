# PI-PPIV - Sistema de Gestión de Propiedades

Sistema completo de gestión de propiedades vacacionales con frontend React y backend Flask, configurado para funcionar tanto en desarrollo local (Docker) como en producción (deploy automático).

## 🏗️ Arquitectura

- **Frontend**: React + Vite (deploy en Vercel)
- **Backend**: Flask + Python (deploy en Render)
- **Base de datos**: MySQL (local en Docker, Filess.io en producción)
- **Tests**: Selenium E2E (Python)

## 🚀 Configuración Automática

El sistema detecta automáticamente el entorno:

### 🔧 Desarrollo Local (Docker)

- Usa MySQL local en contenedor
- Variables de entorno predefinidas para desarrollo
- Base de datos inicializada con datos de ejemplo

### 🌐 Producción (Deploy)

- Usa MySQL de Filess.io
- Variables de entorno configuradas en Render/Vercel
- Deploy automático desde GitHub

## 📦 Instalación y Uso

### Desarrollo Local

1. **Clonar el repositorio:**

   ```bash
   git clone <tu-repo>
   cd PPIV
   ```

2. **Configurar variables de entorno:**

   ```bash
   cp env.example .env
   # Editar .env con tus configuraciones
   ```

3. **Ejecutar con Docker Compose:**

   ```bash
   docker-compose up -d
   ```

4. **Acceder a la aplicación:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - Base de datos: localhost:3306

### Deploy Automático

1. **Subir a GitHub:**

   ```bash
   git add .
   git commit -m "Configuración lista para deploy"
   git push origin main
   ```

2. **Configurar Render (Backend):**

   - Conectar repositorio de GitHub
   - Root Directory: `ProyectoPPVI`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
   - Variables de entorno:
     ```
     IS_PRODUCTION=true
     DB_HOST=pk3b0.h.filess.io
     DB_PORT=3307
     DB_NAME=alojamientosomeguitas_particles
     DB_USER=alojamientosomeguitas_particles
     DB_PASSWORD=78257cb7780930b4a49e34a571e84c54848c62c9
     SECRET_KEY=tu-secret-key
     JWT_SECRET_KEY=tu-jwt-secret-key
     URL_FRONT=https://tu-frontend.vercel.app
     ```

3. **Configurar Vercel (Frontend):**
   - Conectar repositorio de GitHub
   - Root Directory: `PI-PPIV-Front`
   - Variables de entorno:
     ```
     VITE_API_URL=https://tu-backend.onrender.com
     ```

## 🧪 Tests

### Ejecutar Tests Selenium:

```bash
cd PI-PPIV-Front
python -m pytest tests/ -v
```

Ver [tests/README.md](PI-PPIV-Front/tests/README.md) para más detalles.

## 📁 Estructura del Proyecto

```
PPIV/
├── ProyectoPPVI/          # Backend Flask
│   ├── app.py
│   ├── config.py          # Configuración condicional
│   ├── requirements.txt
│   └── Dockerfile
├── PI-PPIV-Front/         # Frontend React
│   ├── src/
│   ├── tests/             # Tests Selenium
│   └── Dockerfile
├── docker-compose.yml     # Configuración local
├── env.example           # Variables de entorno
└── README.md
```

## 🔄 Flujo de Deploy

1. **Push a GitHub** → Trigger automático
2. **Render** → Build y deploy del backend
3. **Vercel** → Build y deploy del frontend
4. **Base de datos** → Filess.io (ya configurada)

## 🛠️ Comandos Útiles

```bash
# Desarrollo local
docker-compose up -d          # Iniciar todo
docker-compose down           # Parar todo
docker-compose logs -f        # Ver logs

# Tests
cd PI-PPIV-Front
python -m pytest tests/ -v    # Ejecutar todos los tests
python tests/test_login.py    # Ejecutar test específico

# Deploy
git add .
git commit -m "Cambios"
git push origin main          # Deploy automático
```

## 🔧 Variables de Entorno

### Desarrollo (.env)

```env
DB_HOST=mysql
DB_USER=ppiv_user
DB_PASSWORD=ppiv_password
DB_NAME=ppiv_db
SECRET_KEY=dev-secret-key
```

### Producción (Render/Vercel)

```env
IS_PRODUCTION=true
DB_HOST=pk3b0.h.filess.io
DB_PORT=3307
DB_NAME=alojamientosomeguitas_particles
DB_USER=alojamientosomeguitas_particles
DB_PASSWORD=78257cb7780930b4a49e34a571e84c54848c62c9
SECRET_KEY=tu-secret-key-super-segura
```

## 📝 Notas Importantes

- Los tests pueden modificar datos reales en el entorno de pruebas
- La base de datos local se inicializa con datos de ejemplo
- El sistema detecta automáticamente si está en Docker o producción
- Los deploys son automáticos al hacer push a `main`
- La base de datos en Filess.io ya está configurada y lista para usar

## 🆘 Troubleshooting

### Problemas comunes:

1. **Puerto 3306 ocupado**: Cambiar puerto en docker-compose.yml
2. **Tests fallan**: Verificar que la app esté corriendo en https://proyecto-ppiv-front.vercel.app
3. **Deploy falla**: Verificar variables de entorno en Render/Vercel
4. **Conexión a Filess.io**: Verificar credenciales en el dashboard de Filess.io

---

¿Necesitas ayuda? Revisa los logs o abre un issue en el repositorio.
