import pytest
import json
import os
from unittest.mock import patch, MagicMock
from app import app

@pytest.fixture
def client():
    """Fixture para crear un cliente de prueba"""
    app.config['TESTING'] = True
    app.config['WTF_CSRF_ENABLED'] = False
    
    with app.test_client() as client:
        yield client

@pytest.fixture
def auth_headers():
    """Headers de autenticación para tests"""
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
    }

class TestAppRoutes:
    """Tests para las rutas principales de la aplicación"""
    
    def test_index_route(self, client):
        """Test para la ruta principal"""
        response = client.get('/')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'routes' in data or 'info' in data
    
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
    
    @patch('app.get_jwt_identity')
    @patch('app.DB')
    def test_ver_admins_success(self, mock_db, mock_jwt, client, auth_headers):
        """Test de ver administradores exitoso"""
        mock_jwt.return_value = '{"superUser": true, "username": "admin"}'
        mock_db.auxVerAdmins.return_value = [
            (1, 'admin1', 'hash1', True),
            (2, 'admin2', 'hash2', False)
        ]
        
        response = client.get('/verAdmins', headers=auth_headers)
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'admin1' in data
        assert 'admin2' in data
    
    @patch('app.get_jwt_identity')
    def test_ver_admins_unauthorized(self, mock_jwt, client, auth_headers):
        """Test de ver administradores sin permisos"""
        mock_jwt.return_value = '{"superUser": false, "username": "user"}'
        
        response = client.get('/verAdmins', headers=auth_headers)
        assert response.status_code == 403

class TestUnitOperations:
    """Tests para operaciones de unidades"""
    
    @patch('app.get_jwt_identity')
    @patch('app.Unit')
    def test_create_unit_success(self, mock_unit, mock_jwt, client, auth_headers):
        """Test de creación de unidad exitosa"""
        mock_jwt.return_value = '{"superUser": true, "username": "admin"}'
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
    
    @patch('app.get_jwt_identity')
    @patch('app.DB')
    def test_delete_unit_success(self, mock_db, mock_jwt, client, auth_headers):
        """Test de eliminación de unidad exitosa"""
        mock_jwt.return_value = '{"superUser": true, "username": "admin"}'
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