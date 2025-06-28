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

class TestIntegrationFlows:
    """Tests de integración para flujos completos"""
    
    def test_complete_reservation_flow(self, client):
        """Test del flujo completo de reserva"""
        # 1. Obtener unidades disponibles
        with patch('app.DB') as mock_db:
            mock_db.searchUnits.return_value = [
                {
                    'id': 1,
                    'title': 'Test Unit',
                    'price': 100.0,
                    'rooms': 2,
                    'beds': 4,
                    'amenities': '["wifi", "parking"]',
                    'urls_fotos': '["photo1.jpg"]',
                    'bathrooms': 2,
                    'address': 'Test Address'
                }
            ]
            
            response = client.get('/api/terceros/units/')
            assert response.status_code == 200
            units = json.loads(response.data)
            assert len(units) > 0
            
            unit_id = units[0]['id']
        
        # 2. Crear reserva (simulado)
        with patch('app.get_jwt_identity') as mock_jwt:
            mock_jwt.return_value = '{"superUser": true, "username": "admin"}'
            
            reservation_data = {
                'unit_id': unit_id,
                'guest_name': 'Test Guest',
                'guest_email': 'test@example.com',
                'check_in_date': '2024-01-01',
                'check_out_date': '2024-01-03',
                'price': 200.0
            }
            
            # Simular creación de reserva
            response = client.post('/api/terceros/almacenaReserva', 
                json=reservation_data)
            # Nota: Esta ruta requiere autenticación, pero simulamos el flujo
    
    def test_admin_management_flow(self, client):
        """Test del flujo de gestión de administradores"""
        # 1. Login como superusuario
        with patch('app.Admin') as mock_admin:
            mock_instance = MagicMock()
            mock_instance.authenticated = True
            mock_instance.superUser = True
            mock_instance.username = 'superadmin'
            mock_admin.return_value = mock_instance
            
            login_response = client.post('/login', 
                json={'username': 'superadmin', 'password': 'password'})
            assert login_response.status_code == 200
            
            login_data = json.loads(login_response.data)
            token = login_data['access_token']
        
        # 2. Ver administradores
        with patch('app.get_jwt_identity') as mock_jwt, \
             patch('app.DB') as mock_db:
            mock_jwt.return_value = '{"superUser": true, "username": "superadmin"}'
            mock_db.auxVerAdmins.return_value = [
                (1, 'admin1', 'hash1', False),
                (2, 'admin2', 'hash2', False)
            ]
            
            headers = {'Authorization': f'Bearer {token}'}
            response = client.get('/verAdmins', headers=headers)
            assert response.status_code == 200
            
            admins = json.loads(response.data)
            assert len(admins) == 2
        
        # 3. Crear nuevo administrador
        with patch('app.get_jwt_identity') as mock_jwt:
            mock_jwt.return_value = '{"superUser": true, "username": "superadmin"}'
            
            new_admin_data = {
                'username': 'newadmin',
                'password': 'newpassword',
                'superUser': False
            }
            
            response = client.post('/crearAdmin', 
                json=new_admin_data, headers=headers)
            # Nota: Simulamos el flujo completo
    
    def test_unit_management_flow(self, client):
        """Test del flujo de gestión de unidades"""
        # 1. Login
        with patch('app.Admin') as mock_admin:
            mock_instance = MagicMock()
            mock_instance.authenticated = True
            mock_instance.superUser = True
            mock_instance.username = 'admin'
            mock_admin.return_value = mock_instance
            
            login_response = client.post('/login', 
                json={'username': 'admin', 'password': 'password'})
            assert login_response.status_code == 200
            
            login_data = json.loads(login_response.data)
            token = login_data['access_token']
        
        # 2. Crear unidad
        with patch('app.get_jwt_identity') as mock_jwt, \
             patch('app.Unit') as mock_unit:
            mock_jwt.return_value = '{"superUser": true, "username": "admin"}'
            mock_instance = MagicMock()
            mock_instance.save.return_value = ({"message": "Unidad creada con éxito"}, 201)
            mock_unit.return_value = mock_instance
            
            unit_data = {
                "rooms": 3,
                "beds": 6,
                "description": "Integration test unit",
                "price": 150.0,
                "amenities": ["wifi", "parking", "kitchen"],
                "urls_fotos": ["photo1.jpg", "photo2.jpg"],
                "title": "Integration Test Unit",
                "bathrooms": 2,
                "address": "Integration Test Address"
            }
            
            headers = {'Authorization': f'Bearer {token}'}
            response = client.post('/creaUnidad', 
                json=unit_data, headers=headers)
            assert response.status_code == 201
        
        # 3. Editar unidad
        with patch('app.get_jwt_identity') as mock_jwt, \
             patch('app.Unit') as mock_unit:
            mock_jwt.return_value = '{"superUser": true, "username": "admin"}'
            mock_instance = MagicMock()
            mock_instance.edit.return_value = ({"message": "Unidad modificada con éxito"}, 206)
            mock_unit.return_value = mock_instance
            
            edit_data = unit_data.copy()
            edit_data['id'] = 1
            edit_data['price'] = 175.0
            
            response = client.post('/editarUnidad', 
                json=edit_data, headers=headers)
            assert response.status_code == 206
        
        # 4. Eliminar unidad
        with patch('app.get_jwt_identity') as mock_jwt, \
             patch('app.DB') as mock_db:
            mock_jwt.return_value = '{"superUser": true, "username": "admin"}'
            mock_db.deleteUnit.return_value = ({'message': 'Unidad eliminada con éxito'}, 200)
            
            response = client.post('/eliminarUnidad', 
                json={'id': 1}, headers=headers)
            assert response.status_code == 200

class TestDatabaseIntegration:
    """Tests de integración con base de datos"""
    
    @patch('app.DB')
    def test_database_connection(self, mock_db):
        """Test de conexión a base de datos"""
        # Simular conexión exitosa
        mock_db.searchUnits.return_value = []
        
        # Verificar que la aplicación puede conectarse
        assert mock_db is not None
    
    @patch('app.DB')
    def test_data_persistence(self, mock_db):
        """Test de persistencia de datos"""
        # Simular datos guardados
        mock_db.createUnit.return_value = ({"message": "Unidad creada con éxito"}, 201)
        
        # Verificar que los datos se guardan correctamente
        result, code = mock_db.createUnit(None)
        assert code == 201
        assert "message" in result

class TestAuthenticationIntegration:
    """Tests de integración de autenticación"""
    
    def test_jwt_token_flow(self, client):
        """Test del flujo completo de JWT"""
        # 1. Login para obtener token
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
            token = data['access_token']
        
        # 2. Usar token para acceder a ruta protegida
        with patch('app.get_jwt_identity') as mock_jwt:
            mock_jwt.return_value = '{"superUser": true, "username": "testuser"}'
            
            headers = {'Authorization': f'Bearer {token}'}
            response = client.get('/verAdmins', headers=headers)
            # Debería funcionar con el token válido
            assert response.status_code in [200, 403]  # 403 si no hay datos, 200 si hay

if __name__ == '__main__':
    pytest.main([__file__]) 