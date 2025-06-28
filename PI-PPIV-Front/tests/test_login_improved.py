import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestLoginImproved:
    """Tests mejorados de login para CI/CD"""
    
    def test_login_success(self, driver, base_url, test_credentials):
        """Test de login exitoso con mejor manejo de errores"""
        try:
            # Navegar a la página de login
            driver.get(f"{base_url}/login")
            
            # Esperar a que la página cargue
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".login-input-top"))
            )
            
            # Ingresar credenciales
            username_input = driver.find_element(By.CSS_SELECTOR, ".login-input-top")
            password_input = driver.find_element(By.CSS_SELECTOR, ".login-input-bottom")
            
            username_input.clear()
            username_input.send_keys(test_credentials['username'])
            
            password_input.clear()
            password_input.send_keys(test_credentials['password'])
            
            # Hacer click en el botón de login
            login_button = driver.find_element(By.CSS_SELECTOR, ".button1")
            login_button.click()
            
            # Esperar a que se complete el login (redirección o cambio de página)
            time.sleep(3)
            
            # Verificar que el login fue exitoso
            # Puede ser redirección a dashboard o cambio en la URL
            current_url = driver.current_url
            assert "/login" not in current_url or "admin" in current_url.lower()
            
            print(f"✅ Login exitoso - URL actual: {current_url}")
            
        except Exception as e:
            print(f"❌ Error en test de login: {str(e)}")
            # Tomar screenshot en caso de error
            driver.save_screenshot("login_error.png")
            raise
    
    def test_login_invalid_password(self, driver, base_url, test_credentials):
        """Test de login con contraseña incorrecta"""
        try:
            driver.get(f"{base_url}/login")
            
            # Esperar a que la página cargue
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".login-input-top"))
            )
            
            # Ingresar credenciales incorrectas
            username_input = driver.find_element(By.CSS_SELECTOR, ".login-input-top")
            password_input = driver.find_element(By.CSS_SELECTOR, ".login-input-bottom")
            
            username_input.clear()
            username_input.send_keys(test_credentials['username'])
            
            password_input.clear()
            password_input.send_keys("wrong_password")
            
            # Hacer click en el botón de login
            login_button = driver.find_element(By.CSS_SELECTOR, ".button1")
            login_button.click()
            
            # Esperar y verificar que permanece en la página de login
            time.sleep(3)
            
            current_url = driver.current_url
            assert "/login" in current_url
            
            print(f"✅ Login con contraseña incorrecta - Permanece en: {current_url}")
            
        except Exception as e:
            print(f"❌ Error en test de contraseña incorrecta: {str(e)}")
            driver.save_screenshot("login_invalid_password_error.png")
            raise
    
    def test_login_invalid_username(self, driver, base_url):
        """Test de login con usuario incorrecto"""
        try:
            driver.get(f"{base_url}/login")
            
            # Esperar a que la página cargue
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".login-input-top"))
            )
            
            # Ingresar credenciales incorrectas
            username_input = driver.find_element(By.CSS_SELECTOR, ".login-input-top")
            password_input = driver.find_element(By.CSS_SELECTOR, ".login-input-bottom")
            
            username_input.clear()
            username_input.send_keys("wrong_user@example.com")
            
            password_input.clear()
            password_input.send_keys("1234")
            
            # Hacer click en el botón de login
            login_button = driver.find_element(By.CSS_SELECTOR, ".button1")
            login_button.click()
            
            # Esperar y verificar que permanece en la página de login
            time.sleep(3)
            
            current_url = driver.current_url
            assert "/login" in current_url
            
            print(f"✅ Login con usuario incorrecto - Permanece en: {current_url}")
            
        except Exception as e:
            print(f"❌ Error en test de usuario incorrecto: {str(e)}")
            driver.save_screenshot("login_invalid_username_error.png")
            raise 