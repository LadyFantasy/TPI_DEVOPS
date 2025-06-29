# 🏠 PPIV - Sistema de Reservas para Alojamientos Temporales

Sistema completo de gestión y reservas para alojamientos temporales con frontend React, backend Flask, y pipeline CI/CD automatizado. Permite a propietarios gestionar sus propiedades y a huéspedes realizar el check-in.

## 📋 Índice

- [🎯 Descripción del Sistema](#-descripción-del-sistema)
- [🌍 Entornos de Ejecución](#-entornos-de-ejecución)
- [🏗️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [🚀 Pipeline CI/CD Automatizado](#-pipeline-cicd-automatizado)
- [📦 Instalación y Configuración](#-instalación-y-configuración)
- [🧪 Sistema de Tests](#-sistema-de-tests)
- [🏠 Funcionalidades del Sistema](#-funcionalidades-del-sistema)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🔄 Flujo de Deploy Automático](#-flujo-de-deploy-automático)
- [🛠️ Comandos Útiles](#️-comandos-útiles)
- [📊 Monitoreo con Prometheus + Grafana](#-monitoreo-con-prometheus--grafana)
- [🔧 Configuración Avanzada](#-configuración-avanzada)
- [🚨 Troubleshooting](#-troubleshooting)
- [🏗️ Infraestructura como Código](#️-infraestructura-como-código)
- [📚 Documentación Adicional](#-documentación-adicional)
- [🤝 Contribución](#-contribución)
- [📞 Soporte](#-soporte)

---

## 🎯 Descripción del Sistema

**Omeguitas** es una plataforma 

- **🏠 Gestión de Propiedades**: Administración completa de unidades de alojamiento
- **📅 Sistema de Reservas**: Calendario interactivo y proceso de reserva simplificado
- **👥 Gestión de Usuarios**: CRUD de administradores del sistema
- **💰 Gestión de Precios**: Multiplicadores por temporada y configuraciones flexibles
- **📊 Reportes**: Informes detallados de ocupación y rentabilidad
- **📧 Notificaciones**: Sistema de emails automáticos para check-in

---

## 🌍 Entornos de Ejecución

### 🔧 Desarrollo Local (Docker)

- **Base de datos**: MySQL local en contenedor (`ppiv_db`)
- **Usuario DB**: `root`
- **Configuración**: `IS_PRODUCTION=false`
- **Archivo**: `docker-compose.dev.yml`
- **Uso**: Desarrollo y testing local

### 🚀 Producción (Render + Vercel)

- **Base de datos**: MySQL en Filess.io (`alojamientosomeguitas_particles`)
- **Usuario DB**: `alojamientosomeguitas_particles`
- **Configuración**: `IS_PRODUCTION=true`
- **Deploy**: Automático via GitHub Actions
- **Uso**: Aplicación en producción

### ⚙️ Configuración Automática

El sistema detecta automáticamente el entorno:

```python
# En config.py
if IS_PRODUCTION:
    # Usa Filess.io (producción)
    DB_CONFIG = {
        'host': 'pk3b0.h.filess.io',
        'database': 'alojamientosomeguitas_particles',
        # ...
    }
else:
    # Usa MySQL local (desarrollo)
    DB_CONFIG = {
        'host': 'mysql',
        'database': 'ppiv_db',
        # ...
    }
```

---

## 🏗️ Arquitectura del Sistema

```mermaid
graph TB
    A[Frontend React/Vite] --> B[Backend Flask API]
    B --> C[MySQL Database]
    B --> D[Email Service]
    B --> E[File Storage]

    F[GitHub Actions] --> G[Tests & Build]
    G --> H[Render Backend]
    G --> I[Vercel Frontend]

    style A fill:#61dafb
    style B fill:#007bff
    style C fill:#ff6b35
    style F fill:#28a745
```

### 🎨 Frontend (React + Vite)

- **Framework**: React 18 con Vite
- **UI**: Componentes modernos y responsivos
- **Estado**: Context API para gestión global
- **Routing**: React Router para navegación
- **Deploy**: Vercel (automático)

### 🔧 Backend (Flask + Python)

- **Framework**: Flask con rutas REST
- **Autenticación**: JWT tokens
- **Base de datos**: MySQL con Flask-MySQL
- **Emails**: Flask-Mail con templates
- **Deploy**: Render (automático)

### 🗄️ Base de Datos

- **Desarrollo**: MySQL en Docker
- **Producción**: MySQL en Filess.io
- **Migraciones**: Scripts SQL manuales

---

## 🚀 Pipeline CI/CD Automatizado

### 📋 Workflow de GitHub Actions

```mermaid
graph LR
    A[Push a main] --> B[Tests Backend]
    A --> C[Tests Frontend]
    A --> D[Linting]
    B --> E[Build Docker]
    C --> E
    D --> E
    E --> F[Deploy Render]
    E --> G[Deploy Vercel]
```

### 🔄 Flujo Detallado del Pipeline

```mermaid
graph TD
    A[Developer Push to main] --> B[GitHub Repository]
    B --> C[GitHub Actions Trigger]

    C --> D[Checkout Code]
    D --> E[Setup Python & Node.js]

    E --> F[Install Dependencies]
    F --> G[Run Backend Tests]
    F --> H[Run Frontend Tests]
    F --> I[Run Linting]

    G --> J{Tests Pass?}
    H --> J
    I --> J

    J -->|Yes| K[Build Docker Images]
    J -->|No| Z[Fail Pipeline]

    K --> L[Push to GitHub Container Registry]
    L --> M[Security Scan]

    M --> N[Deploy to Render Backend]
    M --> O[Deploy to Vercel Frontend]

    N --> P[Health Check Backend]
    O --> Q[Health Check Frontend]

    P --> R{Deploy Success?}
    Q --> R

    R -->|Yes| S[Notify Success]
    R -->|No| T[Notify Failure]

    S --> U[Update Monitoring]
    T --> U

    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#fff3e0
    style K fill:#e8f5e8
    style N fill:#e3f2fd
    style O fill:#f1f8e9
    style S fill:#c8e6c9
    style T fill:#ffcdd2
```

### 🏗️ Arquitectura de Infraestructura

```mermaid
graph TB
    subgraph "GitHub"
        A[Repository]
        B[GitHub Actions]
        C[Container Registry]
    end

    subgraph "Cloud Services"
        D[Render - Backend]
        E[Vercel - Frontend]
        F[Filess.io - MySQL]
    end

    subgraph "Monitoring"
        G[Prometheus]
        H[Grafana]
        I[Alert Manager]
    end

    A --> B
    B --> C
    B --> D
    B --> E

    D --> F
    E --> D

    D --> G
    E --> G
    G --> H
    H --> I
```

### 🔄 Flujo de Desarrollo

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Git as GitHub
    participant GA as GitHub Actions
    participant Docker as Docker Registry
    participant Render as Render
    participant Vercel as Vercel
    participant Monitor as Monitoring

    Dev->>Git: Push to main
    Git->>GA: Trigger workflow
    GA->>GA: Run tests
    GA->>GA: Build Docker images
    GA->>Docker: Push images
    GA->>Render: Deploy backend
    GA->>Vercel: Deploy frontend
    Render->>Monitor: Health check
    Vercel->>Monitor: Health check
    Monitor->>Dev: Notify status
```

### ✅ Jobs del Pipeline

1. **🧪 Test Backend**

   - Tests unitarios con pytest
   - Cobertura de código
   - Base de datos MySQL en contenedor
   - Upload de coverage a Codecov

2. **🎨 Test Frontend**

   - Build de producción
   - Tests de componentes
   - Validación de dependencias
   - Verificación de build exitoso

3. **🤖 Test Frontend E2E (Selenium)**

   - Tests E2E con Selenium
   - Instalación automática de Chrome
   - Tests de login y funcionalidades críticas
   - Ejecución en entorno headless

4. **🔍 Linting**

   - Python: Flake8 + Black
   - JavaScript: ESLint
   - Validación de formato
   - Resumen de resultados

5. **🐳 Build Docker**

   - Construcción de imágenes
   - Push a GitHub Container Registry
   - Cache optimizado
   - Nombres de imágenes en minúsculas

6. **🌐 Deploy Automático**
   - Backend → Render
   - Frontend → Vercel
   - Notificaciones de estado
   - Health checks automáticos

### 📊 Métricas del Pipeline

| Job               | Tiempo Promedio | Objetivo |
| ----------------- | --------------- | -------- |
| Test Backend      | ~3-5 min        | < 5 min  |
| Test Frontend     | ~2-3 min        | < 3 min  |
| Test Frontend E2E | ~2-4 min        | < 4 min  |
| Linting           | ~1-2 min        | < 2 min  |
| Build Docker      | ~4-6 min        | < 6 min  |
| Deploy Backend    | ~2-4 min        | < 4 min  |
| Deploy Frontend   | ~1-2 min        | < 2 min  |

### 📈 Cobertura de Tests

| Componente | Cobertura Actual | Objetivo |
| ---------- | ---------------- | -------- |
| Backend    | ~85%             | > 80%    |
| Frontend   | Build validation | Build OK |

### 🔧 Configuración Detallada del Pipeline

#### **Services MySQL para Tests**

```yaml
services:
  mysql:
    image: mysql:8.0
    env:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: ppiv_db
      MYSQL_USER: ppiv_user
      MYSQL_PASSWORD: ppiv_password
    options: >-
      --health-cmd "mysqladmin ping"
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
    ports:
      - 3306:3306
```

#### **Cache de Dependencias**

```yaml
# Python dependencies
- name: Cache pip dependencies
  uses: actions/cache@v3
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('ProyectoPPVI/requirements.txt') }}

# Node.js dependencies
- name: Set up Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "20"
    cache: "npm"
    cache-dependency-path: PI-PPIV-Front/package-lock.json
```

#### **Docker Buildx con Cache**

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Build and push images
  uses: docker/build-push-action@v5
  with:
    context: ./ProyectoPPVI
    push: true
    tags: ${{ steps.image-names.outputs.backend-image }}:main
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

### 🎉 Pipeline en Producción

![Pipeline CI/CD Exitoso](./docs/images/pipeline%20okay.png)

_Pipeline completo funcionando en GitHub Actions con todos los jobs ejecutándose exitosamente._

**Estado Actual**: ✅ **FUNCIONANDO**

- **Última ejecución**: Exitoso
- **Tasa de éxito**: 100%
- **Tiempo total**: ~5-7 minutos

### 📊 Estados del Pipeline

```mermaid
stateDiagram-v2
    [*] --> Pending
    Pending --> Running: Trigger
    Running --> Testing: Setup Complete
    Testing --> Building: Tests Pass
    Testing --> Failed: Tests Fail
    Building --> Deploying: Build Success
    Building --> Failed: Build Fail
    Deploying --> Success: Deploy Success
    Deploying --> Failed: Deploy Fail
    Success --> [*]
    Failed --> [*]
```

### 🐳 GitHub Container Registry

#### Imágenes Docker Generadas

- **Backend**: `ghcr.io/ladyfantasy/tpi_devops-backend:main`
- **Frontend**: `ghcr.io/ladyfantasy/tpi_devops-frontend:main`

#### Configuración del Registry

```yaml
env:
  REGISTRY: ghcr.io  # GitHub Container Registry

- name: Log in to Container Registry
  uses: docker/login-action@v3
  with:
    registry: ${{ env.REGISTRY }}
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- name: Build and push images
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: ${{ steps.image-names.outputs.backend-image }}:main
```

#### Acceso a las Imágenes

- **GitHub Packages**: https://github.com/LadyFantasy/TPI_DEVOPS?tab=packages
- **Pull local**: `docker pull ghcr.io/ladyfantasy/tpi_devops-backend:main`
- **Pull local**: `docker pull ghcr.io/ladyfantasy/tpi_devops-frontend:main`

### 🔄 Deploy con Webhooks (Opcional)

El workflow `deploy-webhooks.yml` permite disparar deploys manualmente usando webhooks:

- **Se ejecuta**: En push a `main` o manualmente desde GitHub Actions
- **Render**: Usa `RENDER_WEBHOOK_URL` (si configurado) o auto-deploy
- **Vercel**: Usa `VERCEL_DEPLOY_HOOK_URL` (gratuito) o `VERCEL_WEBHOOK_URL` (pago)
- **Uso**: Para forzar deploy cuando el auto-deploy falla

**Configuración**: Agregar secrets en GitHub → Settings → Secrets and variables → Actions

---

## 📦 Instalación y Configuración

### 🔧 Desarrollo Local

#### 1. **Prerrequisitos**

```bash
# Instalar Docker y Docker Compose
# Node.js 20+
# Python 3.11+
```

#### 2. **Clonar y Configurar**

```bash
git clone https://github.com/LadyFantasy/TPI_DEVOPS.git
cd TPI_DEVOPS
cp env.example .env
```

#### 3. **Variables de Entorno (Desarrollo)**

```env
# Base de Datos
DB_HOST=mysql
DB_PORT=3306
DB_NAME=ppiv_db
DB_USER=ppiv_user
DB_PASSWORD=ppiv_password

# Flask
SECRET_KEY=dev-secret-key
JWT_SECRET_KEY=dev-jwt-secret

# Email (opcional para desarrollo)
MAIL_SERVER=smtp.gmail.com
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-app-password
MAIL_DEFAULT_SENDER=tu-email@gmail.com

# Frontend URL
URL_FRONT=http://localhost:3000
```

#### 4. **Ejecutar con Docker**

```bash
# Iniciar todo el stack
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down
```

#### 5. **Acceso a la Aplicación**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Base de datos**: localhost:3306

### 🌐 Producción (Deploy Automático)

#### 1. **Configuración en Render (Backend)**

- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn --bind 0.0.0.0:10000 --workers 4 --timeout 120 app:app`
- **Python Version**: 3.11

#### 2. **Configuración en Vercel (Frontend)**

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

#### 3. **Variables de Entorno (Producción)**

```env
# Backend (Render)
IS_PRODUCTION=true
DB_HOST=pk3b0.h.filess.io
DB_PORT=3307
DB_NAME=alojamientosomeguitas_particles
DB_USER=alojamientosomeguitas_particles
DB_PASSWORD=your-production-db-password
SECRET_KEY=tu-secret-key-super-segura
JWT_SECRET_KEY=tu-jwt-secret-super-segura
URL_FRONT=https://tu-frontend.vercel.app

# Frontend (Vercel)
VITE_API_URL=https://tu-backend.onrender.com
```

---

## 🧪 Sistema de Tests

### 🔧 Tests del Backend

#### **Ejecutar Tests**

```bash
cd ProyectoPPVI
python -m pytest tests/ -v --cov=app --cov-report=html
```

#### **Tests Incluidos**

- ✅ **Autenticación**: Login, registro, JWT tokens
- ✅ **Gestión de Unidades**: CRUD completo
- ✅ **Reservas**: Creación, modificación, cancelación
- ✅ **Usuarios**: Roles y permisos
- ✅ **Reportes**: Generación de informes
- ✅ **Emails**: Envío de notificaciones

#### **Cobertura de Tests**

- **Objetivo**: > 80%
- **Actual**: ~85%
- **Reporte**: `coverage.html` generado automáticamente

### 🎨 Tests del Frontend

#### **Ejecutar Tests**

```bash
cd PI-PPIV-Front
npm ci
npm run build
```

#### **Tests Incluidos**

- ✅ **Build de Producción**: Validación de compilación
- ✅ **Dependencias**: Verificación de package-lock.json
- ✅ **Linting**: ESLint y formateo
- ✅ **Componentes**: Validación de React

### 🤖 Tests E2E (Selenium)

#### **Ejecutar Tests E2E**

```bash
cd PI-PPIV-Front
python -m pytest tests/ -v
```

#### **Tests E2E Incluidos**

- ✅ **Login Exitoso**: `test_loginexitoso.py`
- ✅ **Login Fallido**: `test_loginnoexitosopasserr.py`, `test_loginnoexitosousererr.py`
- ✅ **Gestión de Unidades**: `test_agregarUnidadOk.py`, `test_agregarUnidadIncompleto.py`
- ✅ **Reservas**: `test_consultarReservas.py`
- ✅ **Edición**: `test_editarUnidad.py`, `test_eliminarUnidad.py`

---

## 🏠 Funcionalidades del Sistema

### 👤 Gestión de Usuarios

- **Roles**: Admin, Propietario, Huésped
- **Autenticación**: JWT tokens seguros
- **Perfiles**: Información personal y preferencias
- **Recuperación**: Sistema de recuperación de contraseñas

### 🏘️ Gestión de Propiedades

- **Unidades**: Creación y edición de alojamientos
- **Fotos**: Carga múltiple con Cloudinary
- **Amenities**: Lista de servicios disponibles
- **Ubicación**: Geolocalización y direcciones
- **Precios**: Configuración base y multiplicadores

### 📅 Sistema de Reservas

- **Calendario**: Vista interactiva de disponibilidad
- **Reservas**: Proceso simplificado de booking
- **Confirmaciones**: Emails automáticos
- **Check-in**: Proceso de llegada digitalizado
- **Cancelaciones**: Políticas flexibles

### 💰 Gestión de Precios

- **Precio Base**: Tarifa estándar por noche
- **Multiplicadores**: Ajustes por temporada
- **Temporadas**: Configuración de fechas especiales
- **Descuentos**: Ofertas y promociones

### 📊 Reportes y Analytics

- **Ocupación**: Estadísticas de reservas
- **Rentabilidad**: Análisis de ingresos
- **Huéspedes**: Comportamiento y preferencias
- **Propiedades**: Rendimiento por unidad

### 📧 Sistema de Notificaciones

- **Confirmaciones**: Emails de reserva
- **Recordatorios**: Notificaciones de check-in
- **Encuestas**: Feedback post-estadía
- **Alertas**: Notificaciones importantes

---

## 📁 Estructura del Proyecto

```
PPIV/
├── 📁 ProyectoPPVI/                    # Backend Flask
│   ├── 🐍 app.py                      # Aplicación principal
│   ├── ⚙️ config.py                   # Configuración
│   ├── 📦 requirements.txt             # Dependencias Python
│   ├── 🐳 Dockerfile                  # Imagen Docker
│   ├── 📁 clases/                     # Modelos de datos
│   │   ├── admin.py                   # Gestión de admins
│   │   ├── guest.py                   # Gestión de huéspedes
│   │   ├── reservation.py             # Sistema de reservas
│   │   ├── unit.py                    # Gestión de unidades
│   │   ├── reports.py                 # Generación de reportes
│   │   └── sendMail.py                # Sistema de emails
│   ├── 📁 templates/                  # Templates de email
│   │   └── 📁 mails/
│   │       ├── checkin.html           # Email de check-in
│   │       ├── informes.html          # Email de reportes
│   │       └── recoveryPass.html      # Email de recuperación
│   └── 📁 tests/                      # Tests del backend
│       ├── test_app.py                # Tests de la aplicación
│       └── test_integration.py        # Tests de integración
├── 📁 PI-PPIV-Front/                  # Frontend React
│   ├── ⚛️ src/                        # Código fuente
│   │   ├── 📁 components/             # Componentes React
│   │   ├── 📁 pages/                  # Páginas de la aplicación
│   │   ├── 📁 context/                # Context API
│   │   ├── 📁 utils/                  # Utilidades
│   │   └── 📁 styles/                 # Estilos CSS
│   ├── 📦 package.json                # Dependencias Node.js
│   ├── 🐳 Dockerfile                  # Imagen Docker
│   └── 📁 tests/                      # Tests E2E Selenium
│       ├── test_loginexitoso.py       # Test de login
│       ├── test_agregarUnidadOk.py    # Test de agregar unidad
│       └── ...                        # Más tests
├── 📁 .github/                        # Configuración GitHub
│   └── 📁 workflows/
│       └── ci-cd.yml                  # Pipeline CI/CD
├── 📁 docs/                           # Documentación
│   ├── 📁 images/                     # Imágenes para docs
│   └── README.md                      # Guía de imágenes
├── 📁 monitoring/                     # Monitoreo
│   ├── 📁 grafana/                    # Dashboards
│   └── 📁 prometheus/                 # Métricas
├── 🐳 docker-compose.yml              # Stack local
├── 🐳 docker-compose.dev.yml          # Desarrollo
├── 🐳 docker-compose.monitoring.yml   # Monitoreo
├── 📄 env.example                     # Variables de entorno
├── 📄 init.sql                        # Inicialización DB
└── 📄 README.md                       # Este archivo
```

---

## 🔄 Flujo de Deploy Automático

### 1. **Push a GitHub**

```bash
git add .
git commit -m "Nuevas funcionalidades"
git push origin main
```

### 2. **GitHub Actions se Ejecuta**

- ✅ Tests automáticos
- ✅ Linting y validación
- ✅ Build de imágenes Docker
- ✅ Deploy automático

### 3. **Deploy Completo**

- **Backend**: Render (Flask API)
- **Frontend**: Vercel (React App)
- **Base de datos**: Filess.io (MySQL)

### 4. **Verificación**

- **URLs de producción** actualizadas automáticamente
- **Tests de integración** ejecutados
- **Notificaciones** enviadas

---

## 🛠️ Comandos Útiles

### 🔧 Desarrollo Local

```bash
# Iniciar todo el stack
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Parar servicios
docker-compose down

# Reconstruir imágenes
docker-compose build --no-cache

# Acceder a la base de datos
docker-compose exec mysql mysql -u ppiv_user -p ppiv_db
```

### 🧪 Tests

```bash
# Tests del backend
cd ProyectoPPVI
python -m pytest tests/ -v --cov=app

# Tests del frontend
cd PI-PPIV-Front
npm ci
npm run build

# Tests E2E
cd PI-PPIV-Front
python -m pytest tests/ -v
```

### 🐳 Docker

```bash
# Construir imágenes localmente
docker build -t ppiv-backend ./ProyectoPPVI
docker build -t ppiv-frontend ./PI-PPIV-Front

# Ejecutar contenedores
docker run -p 5000:5000 ppiv-backend
docker run -p 3000:3000 ppiv-frontend
```

### 🐳 Docker Compose Detallado

#### **Desarrollo Local**

```bash
# Desarrollo con hot reload
docker-compose -f docker-compose.dev.yml up --build

# Ver logs en tiempo real
docker-compose -f docker-compose.dev.yml logs -f

# Detener servicios de desarrollo
docker-compose -f docker-compose.dev.yml down

# Limpiar contenedores huérfanos
docker-compose -f docker-compose.dev.yml down --remove-orphans
```

#### **Producción**

```bash
# Construir imágenes
docker-compose build

# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart
```

#### **Configuración de Desarrollo**

El entorno de desarrollo incluye hot reload para ambos servicios:

```yaml
# Backend - Flask con hot reload
command: ["flask", "run", "--host=0.0.0.0", "--port=5000", "--reload"]

# Frontend - Vite con hot reload
volumes:
  - ./PI-PPIV-Front:/app
  - /app/node_modules
environment:
  - CHOKIDAR_USEPOLLING=true
  - WATCHPACK_POLLING=true
```

#### **Volúmenes de Desarrollo**

```yaml
# Backend
volumes:
  - ./ProyectoPPVI:/app
  - ./ProyectoPPVI/logs:/app/logs

# Frontend
volumes:
  - ./PI-PPIV-Front:/app
  - /app/node_modules
```

#### **Health Checks**

Todos los servicios incluyen health checks:

```yaml
healthcheck:
  test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
  timeout: 20s
  retries: 10
```

#### **Troubleshooting Docker**

##### **1. Puerto ya en uso**

```bash
# Verificar puertos ocupados
netstat -tulpn | grep :5000
netstat -tulpn | grep :3000

# Cambiar puertos en docker-compose.yml
ports:
  - "5001:5000"  # Puerto host:puerto contenedor
```

##### **2. Problemas de permisos**

```bash
# Cambiar permisos de volúmenes
sudo chown -R $USER:$USER ./ProyectoPPVI/logs
```

##### **3. Problemas de red**

```bash
# Verificar redes Docker
docker network ls
docker network inspect ppiv_network

# Recrear red
docker network rm ppiv_network
docker-compose up -d
```

##### **4. Comandos de Debug**

```bash
# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql

# Entrar a un contenedor
docker-compose exec backend bash
docker-compose exec frontend sh
docker-compose exec mysql mysql -u root -p

# Verificar estado de servicios
docker-compose ps
docker-compose top
```

#### **Optimizaciones de Producción**

- **Multi-stage builds** para reducir tamaño de imágenes
- **Health checks** para todos los servicios
- **Networks** aisladas para seguridad
- **Volúmenes** persistentes para datos

#### **Variables de Entorno de Producción**

```env
# Producción
IS_PRODUCTION=true
DB_HOST=pk3b0.h.filess.io
DB_PORT=3307
DB_NAME=alojamientosomeguitas_particles
DB_USER=alojamientosomeguitas_particles
DB_PASSWORD=your-production-password
```

#### **Buenas Prácticas de Seguridad**

- **Variables de entorno** para configuraciones sensibles
- **Networks aisladas** para comunicación entre servicios
- **Health checks** para monitoreo de servicios
- **Volúmenes nombrados** para persistencia de datos

```yaml
# Usar variables de entorno
environment:
  - SECRET_KEY=${SECRET_KEY}
  - JWT_SECRET_KEY=${JWT_SECRET_KEY}

# Networks aisladas
networks:
  - ppiv_network
```

---

## 📊 Monitoreo con Prometheus + Grafana

### 🚀 Iniciar el Stack de Monitoreo

```bash
# Crear red de Docker (si no existe)
docker network create ppiv_network

# Iniciar stack de monitoreo
docker-compose -f docker-compose.monitoring.yml up -d
```

### 🌐 Acceso a las Herramientas

- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Alertmanager**: http://localhost:9093
- **Node Exporter**: http://localhost:9100
- **cAdvisor**: http://localhost:8080
- **MySQL Exporter**: http://localhost:9104

### 📈 ¿Qué Muestran los Dashboards?

#### **Grafana Dashboard Principal**

1. **📊 Métricas del Sistema**

   - CPU Usage: Uso de procesador en tiempo real
   - Memory Usage: Consumo de memoria RAM
   - Disk Usage: Espacio en disco utilizado
   - Network Traffic: Tráfico de red

2. **🐳 Métricas de Contenedores**

   - Container CPU: Uso de CPU por contenedor
   - Container Memory: Memoria por contenedor
   - Container Status: Estado de cada contenedor
   - Container Restarts: Reinicios de contenedores

3. **🌐 Métricas de Aplicación**

   - HTTP Request Rate: Tasa de requests por segundo
   - Response Time: Tiempo de respuesta promedio
   - Error Rate: Porcentaje de errores HTTP
   - Active Connections: Conexiones activas

4. **🗄️ Métricas de Base de Datos**
   - MySQL Connections: Conexiones activas a MySQL
   - Query Performance: Rendimiento de consultas
   - Database Size: Tamaño de la base de datos
   - Slow Queries: Consultas lentas

### 🔔 Sistema de Alertas

#### **Alertas Configuradas**

1. **🚨 Alertas de Sistema**

   - CPU > 80% por más de 5 minutos
   - Memory > 85% por más de 5 minutos
   - Disk > 90% de uso
   - Container restart > 3 veces en 10 minutos

2. **🌐 Alertas de Aplicación**

   - Error rate > 5% en 5 minutos
   - Response time > 2 segundos promedio
   - Service down por más de 1 minuto
   - Database connection failures

3. **📧 Notificaciones**
   - Email automático al administrador
   - Slack webhook (configurable)
   - Dashboard visual con alertas activas

### 🛠️ Cómo Usar Grafana

#### **1. Acceder al Dashboard**

1. Abrir http://localhost:3001
2. Login: `admin` / `admin`
3. Ir a "Dashboards" → "PPIV Dashboard"

#### **2. Navegar por los Paneles**

- **Panel Superior**: Métricas generales del sistema
- **Panel Izquierdo**: Métricas de contenedores
- **Panel Derecho**: Métricas de aplicación
- **Panel Inferior**: Métricas de base de datos

#### **3. Configurar Alertas**

1. Ir a "Alerting" → "Alert Rules"
2. Crear nueva regla de alerta
3. Configurar condiciones y notificaciones

#### **4. Personalizar Dashboards**

1. Hacer clic en "Edit" en cualquier panel
2. Modificar queries de Prometheus
3. Cambiar visualizaciones
4. Guardar cambios

### 🔧 Configuración de Prometheus

#### **Targets Monitoreados**

```yaml
# prometheus.yml
scrape_configs:
  - job_name: "backend"
    static_configs:
      - targets: ["backend:5000"]

  - job_name: "frontend"
    static_configs:
      - targets: ["frontend:3000"]

  - job_name: "mysql"
    static_configs:
      - targets: ["mysql-exporter:9104"]

  - job_name: "node"
    static_configs:
      - targets: ["node-exporter:9100"]
```

#### **Reglas de Alertas**

```yaml
# alert_rules.yml
groups:
  - name: ppiv_alerts
    rules:
      - alert: HighCPUUsage
        expr: cpu_usage > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "CPU usage is high"
```

### 📊 Métricas Específicas del Proyecto

#### **Backend Flask**

- Requests por minuto
- Tiempo de respuesta promedio
- Errores 4xx y 5xx
- Uso de memoria por endpoint

#### **Frontend React**

- Tiempo de carga de páginas
- Errores de JavaScript
- Métricas de rendimiento
- Estado de build

#### **Base de Datos MySQL**

- Conexiones activas
- Consultas por segundo
- Tiempo de respuesta de queries
- Bloqueos y deadlocks

---

## 🚨 Troubleshooting Avanzado

### ❌ Problemas del Pipeline CI/CD

#### **1. Tests Fallan**

```bash
# Verificar que la app esté corriendo
curl http://localhost:5000/health

# Revisar logs
docker-compose logs backend

# Ejecutar tests individualmente
python -m pytest tests/test_login.py -v

# Verificar variables de entorno en CI
echo $DB_HOST
echo $SECRET_KEY
```

#### **2. Docker Build Falla**

```bash
# Verificar nombres de imagen
echo "Repository name must be lowercase"

# Solución: Usar nombres en minúsculas
ghcr.io/ladyfantasy/tpi_devops-backend:main

# Limpiar cache de Docker
docker system prune -a

# Reconstruir sin cache
docker-compose build --no-cache
```

#### **3. Deploy Falla**

```bash
# Verificar variables de entorno
echo $DB_HOST
echo $SECRET_KEY

# Revisar logs de GitHub Actions
# Ir a: GitHub > Actions > Ver logs

# Verificar conectividad
curl https://tu-backend.onrender.com/health

# Verificar secrets de GitHub
# GitHub > Settings > Secrets and variables > Actions
```

#### **4. Selenium Tests Fallan**

```bash
# Verificar que Chrome esté instalado
google-chrome --version

# Ejecutar tests con más verbosidad
python -m pytest tests/test_login_improved.py -v -s

# Verificar variables de entorno
echo $FRONTEND_URL
echo $CI
```

### 🔍 Debugging del Pipeline

#### **Logs Útiles**

```bash
# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend

# Database logs
docker-compose logs mysql

# GitHub Actions logs
# GitHub > Actions > Workflow > Job > View logs

# Monitoreo logs
docker-compose -f docker-compose.monitoring.yml logs -f
```

#### **Verificación de Estado**

```bash
# Verificar servicios
docker-compose ps

# Verificar puertos
netstat -tulpn | grep :5000
netstat -tulpn | grep :3000

# Verificar variables de entorno
docker-compose exec backend env

# Verificar redes Docker
docker network ls
docker network inspect ppiv_network
```

#### **Comandos de Debug Local**

```bash
# Test local del backend
cd ProyectoPPVI
python -m pytest tests/ -v

# Test local del frontend
cd PI-PPIV-Front
npm ci
npm run build

# Test de Docker local
docker build -t test-backend ./ProyectoPPVI
docker build -t test-frontend ./PI-PPIV-Front

# Test de Selenium local
cd PI-PPIV-Front
python -m pytest tests/test_login_improved.py -v
```

### 📈 Métricas de Rendimiento del Pipeline

#### **Tiempos Promedio por Job**

| Job               | Tiempo Promedio | Objetivo | Estado |
| ----------------- | --------------- | -------- | ------ |
| test-backend      | ~3-5 min        | < 5 min  | ✅ OK  |
| test-frontend     | ~2-3 min        | < 3 min  | ✅ OK  |
| test-frontend-e2e | ~2-4 min        | < 4 min  | ✅ OK  |
| lint              | ~1-2 min        | < 2 min  | ✅ OK  |
| build             | ~4-6 min        | < 6 min  | ✅ OK  |
| deploy-backend    | ~2-4 min        | < 4 min  | ✅ OK  |
| deploy-frontend   | ~1-2 min        | < 2 min  | ✅ OK  |

#### **Cobertura de Tests**

| Componente | Cobertura Actual | Objetivo | Estado |
| ---------- | ---------------- | -------- | ------ |
| Backend    | ~85%             | > 80%    | ✅ OK  |
| Frontend   | Build validation | Build OK | ✅ OK  |

#### **Tasa de Éxito del Pipeline**

- **Última ejecución**: Exitoso
- **Tasa de éxito**: 100%
- **Tiempo total**: ~5-7 minutos
- **Jobs paralelos**: 4 (test-backend, test-frontend, test-frontend-e2e, lint)
- **Jobs secuenciales**: 3 (build, deploy-backend, deploy-frontend)

### 🔧 Configuración de Secrets

#### **Secrets Requeridos**

| Secret                   | Descripción                | Estado      |
| ------------------------ | -------------------------- | ----------- |
| `GITHUB_TOKEN`           | Token automático de GitHub | ✅ OK       |
| `RENDER_DEPLOY_HOOK_URL` | Webhook de Render          | ⚠️ Opcional |
| `VERCEL_DEPLOY_HOOK_URL` | Webhook de Vercel          | ⚠️ Opcional |

#### **Configuración de Secrets**

1. **GitHub**: Settings → Secrets and variables → Actions
2. **Render**: Dashboard → Service → Settings → Build & Deploy → Build Hook
3. **Vercel**: Dashboard → Project → Settings → Git → Deploy Hooks

### 📊 Logs y Monitoreo

#### **GitHub Actions Logs**

- **Ubicación**: GitHub > Actions > Workflow > Job
- **Retención**: 90 días
- **Descarga**: Disponible en formato JSON

#### **Render Logs**

- **Ubicación**: Dashboard → Service → Logs
- **Tipos**: Build logs, Runtime logs
- **Retención**: 30 días

#### **Vercel Logs**

- **Ubicación**: Dashboard → Project → Functions
- **Tipos**: Function logs, Build logs
- **Retención**: 30 días

### 🎯 Optimizaciones Implementadas

#### **Cache de Dependencias**

- **Python**: Cache de pip con hash de requirements.txt
- **Node.js**: Cache de npm con package-lock.json
- **Docker**: Cache de GitHub Actions para builds

#### **Paralelización**

- **Jobs paralelos**: test-backend, test-frontend, test-frontend-e2e, lint
- **Dependencias**: Solo build espera a todos los tests
- **Deploy**: Backend y frontend se despliegan en paralelo

#### **Optimizaciones de Docker**

- **Multi-stage builds**: Reduce tamaño de imágenes
- **Buildx cache**: Cache entre ejecuciones
- **Nombres en minúsculas**: Evita problemas de permisos

---

## 🔧 Configuración Avanzada

### 🔒 Seguridad

- **JWT Tokens**: Autenticación segura
- **HTTPS**: Certificados SSL automáticos
- **Rate Limiting**: Protección contra ataques
- **Input Validation**: Sanitización de datos
- **SQL Injection**: Protección con ORM

### 📈 Escalabilidad

- **Load Balancing**: Configuración en Render
- **Caching**: Redis para sesiones
- **CDN**: Vercel Edge Network
- **Database**: Optimización de queries

---

## 🚨 Troubleshooting

### ❌ Problemas Comunes

#### **1. Tests Fallan**

```bash
# Verificar que la app esté corriendo
curl http://localhost:5000/health

# Revisar logs
docker-compose logs backend

# Ejecutar tests individualmente
python -m pytest tests/test_login.py -v
```

#### **2. Deploy Falla**

```bash
# Verificar variables de entorno
echo $DB_HOST
echo $SECRET_KEY

# Revisar logs de GitHub Actions
# Ir a: GitHub > Actions > Ver logs

# Verificar conectividad
curl https://tu-backend.onrender.com/health
```

#### **3. Base de Datos**

```bash
# Verificar conexión
docker-compose exec mysql mysql -u ppiv_user -p

# Reinicializar datos
docker-compose down -v
docker-compose up -d
```

#### **4. Docker Issues**

```bash
# Limpiar Docker
docker system prune -a

# Reconstruir todo
docker-compose build --no-cache
docker-compose up -d
```

#### **5. Monitoreo No Funciona**

```bash
# Verificar que la red existe
docker network ls | grep ppiv_network

# Crear red si no existe
docker network create ppiv_network

# Reiniciar stack de monitoreo
docker-compose -f docker-compose.monitoring.yml down
docker-compose -f docker-compose.monitoring.yml up -d

# Verificar logs
docker-compose -f docker-compose.monitoring.yml logs -f
```

### 🔍 Debugging

#### **Logs Útiles**

```bash
# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend

# Database logs
docker-compose logs mysql

# GitHub Actions logs
# GitHub > Actions > Workflow > Job > View logs

# Monitoreo logs
docker-compose -f docker-compose.monitoring.yml logs -f
```

#### **Verificación de Estado**

```bash
# Verificar servicios
docker-compose ps

# Verificar puertos
netstat -tulpn | grep :5000
netstat -tulpn | grep :3000

# Verificar variables de entorno
docker-compose exec backend env
```

---

## 🏗️ Infraestructura como Código - Análisis

### Arquitectura Actual

- **Backend**: Render (PaaS) - Configuración automática
- **Frontend**: Vercel (PaaS) - Configuración automática
- **Base de datos**: Filess.io (DBaaS) - Configuración automática
- **CI/CD**: GitHub Actions - Configuración automática

### ¿Por qué no Terraform?

1. **PaaS vs IaaS**: Render/Vercel son PaaS (Platform as a Service)

   - No necesitas gestionar servidores
   - Configuración automática
   - Terraform es más útil para IaaS (AWS, Azure, GCP)

2. **Costo vs Beneficio**:

   - PaaS gratuito vs IaaS con costos
   - Para este proyecto, PaaS es más eficiente

3. **Complejidad innecesaria**:
   - Tu pipeline ya está automatizado
   - Agregar Terraform sería over-engineering

### Conocimiento de IaC

Aunque no lo uso en este proyecto, entiendo los conceptos:

- **Infraestructura como código**
- **Terraform/Ansible**
- **Cuándo usar cada herramienta**

---

## 📚 Documentación Adicional

- **📖 [GitHub Actions CI/CD](./README-GITHUB-ACTIONS.md)**: Pipeline completo
- **🐳 [Docker Setup](./README-Docker.md)**: Configuración de contenedores
- **🚀 [Deploy Guide](./README-DEPLOY.md)**: Guía de despliegue
- **📸 [Images Guide](./docs/images/README.md)**: Guía de imágenes para docs

---

## 🤝 Contribución

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crea** un Pull Request

### 📋 Checklist para Contribuciones

- [ ] Tests pasando
- [ ] Linting sin errores
- [ ] Documentación actualizada
- [ ] Variables de entorno documentadas
- [ ] Pipeline CI/CD funcionando

---

## 📞 Soporte

- **🐛 Issues**: [GitHub Issues](https://github.com/LadyFantasy/TPI_DEVOPS/issues)

---

## 🏆 Logros del Proyecto

### ✅ Funcionalidades Implementadas

1. **Aplicación funcional** con frontend y backend
2. **Dockerización completa** con multi-stage builds
3. **CI/CD automatizado** con GitHub Actions
4. **Tests automatizados** (unitarios e integración)
5. **Build y push automático** a GitHub Container Registry
6. **Deploy automático** en múltiples plataformas
7. **Monitoreo completo** con Prometheus + Grafana

### 🎯 Beneficios Obtenidos

- **Automatización completa** del proceso de desarrollo
- **Despliegue confiable** y reproducible
- **Monitoreo en tiempo real** de la aplicación
- **Escalabilidad** con contenedores
- **Registry de imágenes** centralizado en GitHub

### 🛠️ Tecnologías Aprendidas

- **Docker** y **Docker Compose**
- **GitHub Actions** para CI/CD
- **GitHub Container Registry** para imágenes Docker
- **Prometheus** y **Grafana** para monitoreo
- **Render** y **Vercel** para deploy
- **Selenium** para testing de UI
