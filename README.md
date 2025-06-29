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
- [🏗️ Infraestructura como Código con Terraform](#️-infraestructura-como-código)
- [📚 Documentación Adicional](#-documentación-adicional)
- [🤝 Contribución](#-contribución)
- [📞 Soporte](#-soporte)

---

## 🎯 Descripción del Sistema

**Omeguitas** es una plataforma para administradores de alojamientos temporales que centraliza y facilita las siguientes funcionalidades:

- **🏠 Gestión de Propiedades**: Administración completa de unidades de alojamiento
- **📅 Sistema de Reservas**: Calendario interactivo y proceso de reserva simplificado
- **👥 Gestión de Usuarios**: CRUD de administradores del sistema
- **💰 Gestión de Precios**: Multiplicadores por temporada y configuraciones flexibles
- **📊 Reportes**: Informes detallados de ocupación y rentabilidad
- **📧 Notificaciones**: Sistema de emails automáticos para check-in

---

## 🌍 Entornos de Ejecución

### 🔧 Desarrollo Local (Docker)

- **Frontend y Backend**: Se levantan como contenedores Docker usando `docker-compose.dev.yml`.
- **Base de datos**: Se levanta automáticamente en un contenedor MySQL llamado `ppiv_mysql_dev`.
  - El esquema y los datos iniciales se cargan desde el archivo `init.sql` al iniciar el contenedor.
- **Comando para levantar todo**:
  ```bash
  docker-compose -f docker-compose.dev.yml up -d
  ```
- **Acceso**:
  - Frontend: http://localhost:3000
  - Backend: http://localhost:5000
  - MySQL: localhost:3306 (usuario y contraseña definidos en `.env` o variables por defecto)

### 🚀 Producción (Render + Vercel)

- **Backend**: Deploy automático en Render.com (PaaS) usando GitHub Actions.
- **Frontend**: Deploy automático en Vercel.com (PaaS) usando GitHub Actions.
- **Base de datos**: Servicio gestionado en Filess.io, accesible desde ambos entornos.
- **Deploys**:
  - Se disparan automáticamente al hacer push a la rama `main` en GitHub.
  - GitHub Actions ejecuta tests y, si todo pasa, hace deploy usando los webhooks de Render y Vercel (URLs configuradas como secrets en GitHub).
- **Health checks**: Ambos servicios tienen health checks automáticos tras el deploy.

### ⚙️ Configuración Automática

El sistema detecta automáticamente el entorno y configura la base de datos según corresponda:

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

#### Acceso a las Imágenes

- **GitHub Packages**: https://github.com/LadyFantasy/TPI_DEVOPS?tab=packages
- **Pull local**: `docker pull ghcr.io/ladyfantasy/tpi_devops-backend:main`
- **Pull local**: `docker pull ghcr.io/ladyfantasy/tpi_devops-frontend:main`

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
# Base de Datos Local
DB_HOST=mysql
DB_PORT=3306
DB_NAME=ppiv_db
DB_USER=root
DB_PASSWORD=password

# Flask
SECRET_KEY=dev-secret-key
JWT_SECRET_KEY=dev-jwt-secret
IS_PRODUCTION=false
```

#### 4. **Iniciar Desarrollo**

```bash
# Iniciar todo el stack de desarrollo
docker-compose -f docker-compose.dev.yml up -d

# Verificar que todo esté funcionando
docker-compose -f docker-compose.dev.yml ps
```

#### 5. **Acceso a la Aplicación**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Base de datos**: localhost:3306

### 🌐 Producción (Deploy Automático)

El proyecto se despliega automáticamente en:

- **Backend**: Render (Flask API)
- **Frontend**: Vercel (React App)
- **Base de datos**: Filess.io (MySQL)

**No requiere configuración manual** - el pipeline CI/CD maneja todo automáticamente.

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

### 📈 ¿Qué Muestran los Dashboards?

#### **Grafana Dashboard Principal**

1. **🌐 Métricas de Aplicación**

   - HTTP Request Rate: Tasa de requests por segundo
   - Response Time: Tiempo de respuesta promedio
   - Error Rate: Porcentaje de errores HTTP
   - Active Connections: Conexiones activas

2. **📊 Métricas del Sistema**

   - CPU Usage: Uso de procesador en tiempo real
   - Memory Usage: Consumo de memoria RAM
   - Disk Usage: Espacio en disco utilizado
   - Network Traffic: Tráfico de red

### 🛠️ Cómo Usar Grafana

#### **1. Acceder al Dashboard**

1. Abrir http://localhost:3001
2. Login: `admin` / `admin`
3. Ir a "Dashboards" → "PPIV Dashboard"

#### **2. Navegar por los Paneles**

- **Panel Superior**: Métricas generales del sistema
- **Panel Izquierdo**: Métricas de aplicación
- **Panel Derecho**: Métricas de rendimiento

#### **3. Personalizar Dashboards**

1. Hacer clic en "Edit" en cualquier panel
2. Modificar queries de Prometheus
3. Cambiar visualizaciones
4. Guardar cambios

### 🔧 Configuración de Prometheus

#### **Targets Monitoreados**

```yaml
# prometheus.yml
scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: "ppiv-backend"
    static_configs:
      - targets: ["ppiv_backend_dev:5000"]
    metrics_path: "/metrics"
    scrape_interval: 10s

  - job_name: "ppiv-frontend"
    static_configs:
      - targets: ["ppiv_frontend_dev:3000"]
    metrics_path: "/metrics"
    scrape_interval: 10s
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

### Archivos de Terraform

En el repositorio se incluyen archivos de configuración de Terraform (`terraform/main.tf`, `terraform/variables.tf`, y módulos), pero **no están en uso actualmente** en el pipeline ni en producción. Estos archivos están preparados para mostrar cómo se podría aprovisionar infraestructura en la nube (por ejemplo, redes, instancias, bases de datos) si se migrara a un entorno IaaS como AWS, Azure o GCP.

Actualmente, toda la infraestructura se gestiona como PaaS (Render, Vercel, Filess.io), por lo que no es necesario aplicar Terraform, pero los archivos quedan como referencia y ejemplo de buenas prácticas de Infraestructura como Código.

### Arquitectura Actual

- **Backend**: Render (PaaS) - Configuración automática
- **Frontend**: Vercel (PaaS) - Configuración automática
- **Base de datos**: Filess.io (DBaaS) - Configuración automática
- **CI/CD**: GitHub Actions - Configuración automática

### ¿Por qué no Terraform?

1. **PaaS vs IaaS**: Render/Vercel son PaaS (Platform as a Service)

   - No es necesario gestionar servidores
   - Configuración automática
   - Terraform es más útil para IaaS (AWS, Azure, GCP)

2. **Costo vs Beneficio**:

   - PaaS gratuito vs IaaS con costos
   - Para este proyecto, PaaS es más eficiente

3. **Complejidad innecesaria**:
   - El pipeline ya está automatizado
   - Agregar Terraform sería over-engineering

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

## 🏆 Conclusiones y Roles del Equipo

### 👥 Roles y Responsabilidades

Este proyecto fue desarrollado por un equipo de 4 personas, cada una con responsabilidades específicas que permitieron crear una aplicación completa y robusta:

#### **Soledad Martínez** - Project Manager & Frontend

- **Rol**: Liderazgo del proyecto y desarrollo frontend
- **Responsabilidades**:
  - Gestión del proyecto y planificación de sprints
  - Desarrollo de la interfaz con React y Vite
  - Coordinación entre frontend, backend y DevOps
  - Documentación y presentación del proyecto
  - Configuración de CI/CD y monitoreo

#### **Guillermo Köster** - Backend & Base de Datos

- **Rol**: Desarrollo del backend y gestión de datos
- **Responsabilidades**:
  - Desarrollo de la API REST con Flask
  - Diseño y optimización de la base de datos MySQL
  - Implementación de autenticación JWT
  - Configuración de servicios de email
  - Dockerización del backend

#### **Carolina Cerón** - UI/UX & Diseño

- **Rol**: Diseño de interfaz y experiencia de usuario
- **Responsabilidades**:
  - Diseño de componentes y estilos CSS
  - Optimización de la experiencia de usuario
  - Responsive design y accesibilidad
  - Creación de wireframes y prototipos
  - Aseguramiento de la usabilidad del sistema

#### **Germán Pappalardo** - Testing & Calidad

- **Rol**: Aseguramiento de calidad y testing
- **Responsabilidades**:
  - Implementación de tests unitarios con pytest
  - Tests de integración y E2E con Selenium
  - Configuración de coverage y métricas de calidad
  - Validación de funcionalidades críticas
  - Aseguramiento de la estabilidad del sistema

### 🎯 Logros del Equipo

#### **Trabajo Colaborativo**

- **Comunicación efectiva** entre todos los roles
- **Integración exitosa** de frontend, backend y DevOps
- **Cumplimiento de deadlines** y objetivos del proyecto
- **Aplicación de mejores prácticas** de desarrollo

#### **Resultados Técnicos**

- **Aplicación funcional** con todas las características solicitadas
- **Pipeline CI/CD completo** y automatizado
- **Monitoreo implementado** con Prometheus y Grafana
- **Documentación exhaustiva** y clara
- **Cobertura de tests** superior al 85%

#### **Aprendizajes Adquiridos**

- **DevOps en la práctica**: CI/CD, Docker, monitoreo
- **Trabajo en equipo** con roles definidos
- **Gestión de proyectos** con metodologías ágiles
- **Integración de tecnologías** modernas
- **Despliegue en la nube** con servicios PaaS

### 🚀 Impacto del Proyecto

Este trabajo práctico demostró la capacidad del equipo para:

- **Desarrollar aplicaciones completas** desde cero hasta producción
- **Implementar prácticas DevOps** modernas y efectivas
- **Trabajar colaborativamente** con roles bien definidos
- **Entregar productos de calidad** con documentación completa

El proyecto no solo cumple con todos los requisitos técnicos solicitados, sino que también demuestra las habilidades de trabajo en equipo y la capacidad de aplicar conocimientos teóricos en un proyecto real y funcional.

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
7. **Monitoreo básico** con Prometheus + Grafana

### 🎯 Beneficios Obtenidos

- **Automatización completa** del proceso de desarrollo
- **Despliegue confiable** y reproducible
- **Monitoreo básico** de la aplicación
- **Escalabilidad** con contenedores
- **Registry de imágenes** centralizado en GitHub

### 🛠️ Tecnologías Aprendidas

- **Docker** y **Docker Compose**
- **GitHub Actions** para CI/CD
- **GitHub Container Registry** para imágenes Docker
- **Prometheus** y **Grafana** para monitoreo básico
- **Render** y **Vercel** para deploy
- **Selenium** para testing de UI

## 🛠️ Comandos Útiles

### 🔧 Desarrollo Local

```bash
# Iniciar todo el stack de desarrollo
docker-compose -f docker-compose.dev.yml up -d

# Ver logs en tiempo real
docker-compose -f docker-compose.dev.yml logs -f

# Parar servicios
docker-compose -f docker-compose.dev.yml down

# Reconstruir imágenes
docker-compose -f docker-compose.dev.yml build --no-cache

# Acceder a la base de datos
docker-compose -f docker-compose.dev.yml exec mysql mysql -u root -p ppiv_db
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

# Ejecutar contenedores individuales
docker run -p 5000:5000 ppiv-backend
docker run -p 3000:3000 ppiv-frontend
```

## 🗂️ Estrategia de ramas (Git Flow)

- `main`: Rama principal, siempre estable y lista para producción.
- `develop`: Rama de integración para nuevas funcionalidades.
- `feature/*`: Ramas para el desarrollo de nuevas features o fixes.

> En este proyecto, la estructura de ramas se implementó para cumplir con las mejores prácticas de DevOps, aunque el desarrollo principal se realizó en `main` por ser un trabajo individual y cerrado.
