# Selenium E2E Tests para PI-PPIV-Front

Este directorio contiene tests de integración/end-to-end (E2E) para la aplicación frontend de PI-PPIV, utilizando Python, Selenium y ChromeDriver.

## ¿Qué prueban estos tests?

Los tests automatizan flujos críticos de la aplicación web, simulando la interacción de un usuario real en el navegador. Cubren:

- **Login exitoso y fallido**
- **Agregar una unidad (formulario completo e incompleto)**
- **Editar una unidad existente**
- **Eliminar una unidad**
- **Consultar reservas**

Cada test realiza acciones como completar formularios, navegar entre páginas, hacer clicks en botones y verificar que los mensajes de éxito/error o redirecciones sean correctos.

## Estructura de los tests

- Cada archivo `test_*.py` contiene una clase de test con un método principal que automatiza un flujo de usuario.
- Se utiliza Selenium WebDriver con Chrome en modo headless (sin abrir ventana).
- Los selectores CSS y los flujos están adaptados a la estructura real del frontend React.

## Requisitos previos

- Python 3.8+
- Google Chrome instalado
- ChromeDriver compatible con tu versión de Chrome
- Paquetes Python: `selenium`, `pytest`, `webdriver-manager`

Puedes instalar los paquetes necesarios con:

```bash
pip install selenium pytest webdriver-manager
```

## Cómo ejecutar los tests

Desde la carpeta `PI-PPIV-Front` ejecuta:

```bash
pytest tests/ -v
```

O para correr un test específico:

```bash
python tests/test_agregarUnidadOk.py
```

## Notas importantes

- Los tests usan datos de ejemplo (usuario admin: `germangp62@gmail.com`, password: `1234`).
- Los tests pueden modificar datos reales en el entorno de pruebas (agregar, editar o eliminar unidades).
- Si la estructura del frontend cambia (clases CSS, rutas, nombres de campos), los tests pueden requerir actualización.
- Se recomienda correr estos tests en un entorno de pruebas, no en producción.

## Archivos principales

- `test_loginexitoso.py` — Login correcto
- `test_loginnoexitosopasserr.py` — Login con contraseña incorrecta
- `test_loginnoexitosousererr.py` — Login con usuario incorrecto
- `test_agregarUnidadOk.py` — Agregar unidad con datos completos
- `test_agregarUnidadIncompleto.py` — Intento de agregar unidad con datos incompletos
- `test_editarUnidad.py` — Editar una unidad existente
- `test_eliminarUnidad.py` — Eliminar una unidad existente
- `test_consultarReservas.py` — Consultar reservas

---

Si tienes dudas sobre cómo adaptar o extender estos tests, consulta el código fuente o abre un issue en el repositorio.
