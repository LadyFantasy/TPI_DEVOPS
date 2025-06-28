import pytest
import json
import os
from unittest.mock import patch, MagicMock
from app import app
from flask_jwt_extended import create_access_token
from datetime import timedelta

@pytest.fixture
def client():
    """Fixture para crear un cliente de prueba"""
    app.config['TESTING'] = True
    app.config['WTF_CSRF_ENABLED'] = False
    app.config['JWT_SECRET_KEY'] = 'test-secret-key'  # Agregar clave JWT para tests
    
    with app.test_client() as client:
        yield client

@pytest.fixture
def auth_headers():
    """Headers de autenticación para tests"""
    with app.app_context():
        # Crear un token JWT válido para tests
        user_identity = {"superUser": True, "username": "admin"}
        token = create_access_token(identity=json.dumps(user_identity), expires_delta=timedelta(hours=1))
        
        return {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}'
        }

class TestAppRoutes:
    """Tests para las rutas principales de la aplicación"""
    
    def test_index_route(self, client):
        """Test para la ruta principal"""
        response = client.get('/')
        assert response.status_code == 200
        data = json.loads(response.data)
        # La respuesta contiene rutas con el formato "route ('/ruta')"
        assert 'route (' in str(data) or 'routes' in data or 'info' in data
    
    def test_login_success(self, client):
        """Test de login exitoso"""
        with patch('app.Admin') as mock_admin:
            mock_instance = MagicMock()
            mock_instance.authenticated = True
            mock_instance.superUser = True
            mock_instance.username = 'testuser'
            mock_admin.return_value = mock_instance
            
            response = client.post('/login', 
                json={'username': 'testuser', 'password': 'testpass'})
            
            assert response.status_code == 200
            data = json.loads(response.data)
            assert 'access_token' in data
            assert data['superUser'] == True
    
    def test_login_failure(self, client):
        """Test de login fallido"""
        with patch('app.Admin') as mock_admin:
            mock_instance = MagicMock()
            mock_instance.authenticated = False
            mock_admin.return_value = mock_instance
            
            response = client.post('/login', 
                json={'username': 'wronguser', 'password': 'wrongpass'})
            
            assert response.status_code == 401
            data = json.loads(response.data)
            assert 'error' in data
    
    def test_login_missing_data(self, client):
        """Test de login con datos faltantes"""
        response = client.post('/login', json={})
        assert response.status_code == 400
        
        response = client.post('/login', json={'username': 'test'})
        assert response.status_code == 400
    
    def test_protected_route_without_token(self, client):
        """Test de ruta protegida sin token"""
        response = client.get('/verAdmins')
        assert response.status_code == 401
    
    @patch('app.DB')
    def test_ver_admins_success(self, mock_db, client, auth_headers):
        """Test de ver administradores exitoso"""
        mock_db.auxVerAdmins.return_value = [
            (1, 'admin1', 'hash1', True),
            (2, 'admin2', 'hash2', False)
        ]
        
        response = client.get('/verAdmins', headers=auth_headers)
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'admin1' in data
        assert 'admin2' in data
    
    def test_ver_admins_unauthorized(self, client):
        """Test de ver administradores sin permisos"""
        with app.app_context():
            # Crear un token con superUser = False
            user_identity = {"superUser": False, "username": "user"}
            token = create_access_token(identity=json.dumps(user_identity), expires_delta=timedelta(hours=1))
            
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {token}'
            }
            
            response = client.get('/verAdmins', headers=headers)
            assert response.status_code == 403

class TestUnitOperations:
    """Tests para operaciones de unidades"""
    
    @patch('app.Unit')
    def test_create_unit_success(self, mock_unit, client, auth_headers):
        """Test de creación de unidad exitosa"""
        mock_instance = MagicMock()
        mock_instance.save.return_value = ({"message": "Unidad creada con éxito"}, 201)
        mock_unit.return_value = mock_instance
        
        unit_data = {
            "rooms": 2,
            "beds": 4,
            "description": "Test unit",
            "price": 100.0,
            "amenities": ["wifi", "parking"],
            "urls_fotos": ["photo1.jpg"],
            "title": "Test Unit",
            "bathrooms": 2,
            "address": "Test Address"
        }
        
        response = client.post('/creaUnidad', 
            json=unit_data, headers=auth_headers)
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert 'message' in data
    
    @patch('app.DB')
    def test_delete_unit_success(self, mock_db, client, auth_headers):
        """Test de eliminación de unidad exitosa"""
        mock_db.deleteUnit.return_value = ({'message': 'Unidad eliminada con éxito'}, 200)
        
        response = client.post('/eliminarUnidad', 
            json={'id': 1}, headers=auth_headers)
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'message' in data

class TestReservationOperations:
    """Tests para operaciones de reservas"""
    
    def test_get_units_public(self, client):
        """Test de obtención de unidades (público)"""
        with patch('app.DB') as mock_db:
            mock_db.searchUnits.return_value = [
                {
                    'id': 1,
                    'title': 'Test Unit',
                    'price': 100.0,
                    'rooms': 2,
                    'beds': 4
                }
            ]
            
            response = client.get('/api/terceros/units/')
            assert response.status_code == 200
            data = json.loads(response.data)
            assert len(data) > 0
            assert data[0]['title'] == 'Test Unit'
    
    def test_get_unit_by_id(self, client):
        """Test de obtención de unidad por ID"""
        with patch('app.DB') as mock_db:
            mock_db.searchUnits.return_value = [
                {
                    'id': 1,
                    'title': 'Test Unit',
                    'price': 100.0
                }
            ]
            
            response = client.get('/api/terceros/units/?id=1')
            assert response.status_code == 200
            data = json.loads(response.data)
            assert len(data) > 0
            assert data[0]['id'] == 1

class TestErrorHandling:
    """Tests para manejo de errores"""
    
    def test_404_route(self, client):
        """Test de ruta no encontrada"""
        response = client.get('/ruta-inexistente')
        assert response.status_code == 404
    
    def test_invalid_json(self, client):
        """Test de JSON inválido"""
        response = client.post('/login', 
            data='invalid json',
            content_type='application/json')
        assert response.status_code == 400

if __name__ == '__main__':
    pytest.main([__file__]) 