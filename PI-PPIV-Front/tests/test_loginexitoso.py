# Generated by Selenium IDE
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

class TestLoginexitoso():
  def setup_method(self, method):
    service = Service(ChromeDriverManager().install())
    self.driver = webdriver.Chrome(service=service)
    self.vars = {}
  
  def teardown_method(self, method):
    self.driver.quit()
  
  def test_loginexitoso(self):
    self.driver.get("https://tpi-devops-git-main-ladyfantasys-projects.vercel.app/login")
    self.driver.set_window_size(1936, 1048)
    self.driver.find_element(By.CSS_SELECTOR, ".login-input-top").click()
    self.driver.find_element(By.CSS_SELECTOR, ".login-input-top").send_keys("germangp62@gmail.com")
    self.driver.find_element(By.CSS_SELECTOR, ".login-input-bottom").click()
    self.driver.find_element(By.CSS_SELECTOR, ".login-input-bottom").send_keys("1234")
    self.driver.find_element(By.CSS_SELECTOR, ".button1").click()
  
