import pytest
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

@pytest.fixture(scope="function")
def driver():
    """Fixture para crear un driver de Chrome configurado para CI/CD"""
    chrome_options = Options()
    
    # Configuración para CI/CD
    if os.getenv('CI'):
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--disable-extensions')
        chrome_options.add_argument('--disable-plugins')
        chrome_options.add_argument('--disable-images')
        chrome_options.add_argument('--disable-javascript')
        chrome_options.add_argument('--disable-web-security')
        chrome_options.add_argument('--allow-running-insecure-content')
        chrome_options.add_argument('--disable-features=VizDisplayCompositor')
    
    # Configuración para desarrollo local
    else:
        chrome_options.add_argument('--start-maximized')
        chrome_options.add_argument('--disable-extensions')
    
    # Configuración común
    chrome_options.add_argument('--disable-blink-features=AutomationControlled')
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    # Crear el driver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    # Configurar timeouts
    driver.implicitly_wait(10)
    driver.set_page_load_timeout(30)
    
    yield driver
    
    # Limpiar después de cada test
    driver.quit()

@pytest.fixture
def base_url():
    """URL base para los tests"""
    return os.getenv('FRONTEND_URL', 'https://proyecto-ppiv-front.vercel.app')

@pytest.fixture
def test_credentials():
    """Credenciales de prueba"""
    return {
        'username': 'germangp62@gmail.com',
        'password': '1234'
    } 