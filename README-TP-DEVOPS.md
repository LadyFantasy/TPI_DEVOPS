# PPIV - Trabajo Práctico Integrador de DevOps

## 📋 Descripción del Proyecto

Esta es una aplicación web completa para la gestión de alquleres temporales, desarrollada aplicando prácticas y herramientas clave de DevOps.

### 🏗️ Arquitectura del Sistema

- **Backend**: Python Flask con API REST
- **Frontend**: React con Vite
- **Base de Datos**: MySQL
- **Contenedores**: Docker
- **CI/CD**: GitHub Actions
- **Deploy**: Render (Backend) + Vercel (Frontend)
- **Monitoreo**: Prometheus + Grafana
- **Base de Datos**: Filess.io (MySQL)

## 🚀 Instrucciones para Ejecutar Localmente

### Prerrequisitos

- Docker y Docker Compose
- Git
- Node.js 18+ (para desarrollo frontend)
- Python 3.11+ (para desarrollo backend)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/PPIV.git
cd PPIV
```

### 2. Ejecutar con Docker Compose

```bash
# Construir y ejecutar todos los servicios
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d --build
```

### 3. Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Base de Datos**: localhost:3306
- **Grafana**: http://localhost:3001 (admin/admin)

### 4. Desarrollo Local (Opcional)

```bash
# Backend
cd ProyectoPPVI
pip install -r requirements.txt
python app.py

# Frontend
cd PI-PPIV-Front
npm install
npm run dev
```

## 🧪 Tests

### Backend Tests

```bash
cd ProyectoPPVI
python -m pytest tests/ -v
```

### Frontend Tests (Selenium)

```bash
cd PI-PPIV-Front/tests
python test_loginexitoso.py
python test_agregarUnidadOk.py
# ... otros tests
```

## 🐳 Dockerización

### Dockerfile Backend

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000"]
```

### Dockerfile Frontend

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 80
CMD ["npm", "run", "preview"]
```

### Docker Compose

```yaml
version: "3.8"
services:
  backend:
    build: ./ProyectoPPVI
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=db
    depends_on:
      - db

  frontend:
    build: ./PI-PPIV-Front
    ports:
      - "3000:80"
    depends_on:
      - backend

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: ppiv_db
```

## 🔄 Pipeline CI/CD

### Diagrama del Pipeline DevOps

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Git Push      │───▶│  GitHub Actions │───▶│   Tests         │
│   (main)        │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Build Docker  │
                       │   Images        │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Push to       │
                       │   Registry      │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Deploy to     │
                       │   Render/Vercel │
                       └─────────────────┘
```

### 📸 Pipeline en Producción

![Pipeline CI/CD Exitoso](./docs/images/pipeline%20okay.png)

_Pipeline completo funcionando en GitHub Actions con todos los jobs ejecutándose exitosamente._

### Workflow GitHub Actions

1. **Trigger**: Push a `main` branch
2. **Tests**:
   - Backend tests con pytest
   - Frontend tests con Selenium
   - Linting con flake8 y ESLint
3. **Build**: Construcción de imágenes Docker
4. **Push**: Imágenes a GitHub Container Registry (ghcr.io)
5. **Deploy**: Despliegue automático a Render y Vercel
6. **Monitoring**: Verificación de estado de servicios

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

### Archivos de Configuración

- `.github/workflows/ci-cd.yml` - Pipeline principal
- `.github/workflows/deploy-webhooks.yml` - Deploy con webhooks
- `docker-compose.yml` - Orquestación local
- `docker-compose.monitoring.yml` - Stack de monitoreo

## 📊 Monitoreo

### Stack de Monitoreo

- **Prometheus**: Recolección de métricas
- **Grafana**: Visualización y dashboards
- **Alertas**: Configuradas para servicios críticos

### Métricas Monitoreadas

- CPU y memoria de contenedores
- Latencia de API
- Errores HTTP
- Estado de base de datos

### Acceso

- **Grafana**: http://localhost:3001
- **Prometheus**: http://localhost:9090

## 🌐 Deploy en Producción

### URLs de Producción

- **Frontend**: https://ppiv-frontend.vercel.app
- **Backend**: https://ppiv-backend.onrender.com
- **Repositorio**: https://github.com/LadyFantasy/TPI_DEVOPS
- **GitHub Actions**: https://github.com/LadyFantasy/TPI_DEVOPS/actions
- **Container Registry**: https://github.com/LadyFantasy/TPI_DEVOPS?tab=packages

### Estado del Deploy

- **Pipeline Status**: ✅ **FUNCIONANDO**
- **Última ejecución**: Exitoso
- **Tasa de éxito**: 100%
- **Tiempo total**: ~5-7 minutos

### Configuración de Deploy

- **Render**: Auto-deploy con webhooks
- **Vercel**: Auto-deploy con Deploy Hooks
- **Variables de entorno**: Configuradas en cada plataforma
- **GitHub Container Registry**: Imágenes Docker automáticas

## 📁 Estructura del Proyecto

```
PPIV/
├── ProyectoPPVI/           # Backend Flask
│   ├── app.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── tests/
├── PI-PPIV-Front/          # Frontend React
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   └── tests/
├── .github/workflows/      # CI/CD
├── monitoring/             # Prometheus + Grafana
├── docker-compose.yml      # Orquestación local
└── README.md
```

## 🎯 Funcionalidades de la Aplicación

### Backend (Flask)

- API REST para gestión de propiedades
- Autenticación JWT
- CRUD de unidades inmobiliarias
- Sistema de reservas
- Envío de emails

### Frontend (React)

- Interfaz de usuario moderna
- Gestión de propiedades
- Sistema de reservas
- Panel de administración
- Formularios interactivos

## 📈 Métricas de Calidad

### Cobertura de Tests

- **Backend**: Tests unitarios e integración
- **Frontend**: Tests de UI con Selenium
- **Cobertura**: >80% del código

### Performance

- **Tiempo de build**: <5 minutos
- **Tiempo de deploy**: <3 minutos
- **Disponibilidad**: 99.9%

## 🔧 Comandos Útiles

### Desarrollo

```bash
# Instalar dependencias
npm install
pip install -r requirements.txt

# Ejecutar tests
npm test
python -m pytest

# Linting
npm run lint
flake8 .
```

### Docker

```bash
# Construir imágenes
docker-compose build

# Ejecutar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down
```

### Deploy

```bash
# Deploy manual
git push origin main

# Verificar estado
gh run list
```

## 🏆 Conclusiones

### Logros Alcanzados

1. ✅ **Aplicación funcional** con frontend y backend
2. ✅ **Dockerización completa** con multi-stage builds
3. ✅ **CI/CD automatizado** con GitHub Actions
4. ✅ **Tests automatizados** (unitarios e integración)
5. ✅ **Build y push automático** a GitHub Container Registry
6. ✅ **Deploy automático** en múltiples plataformas
7. ✅ **Monitoreo completo** con Prometheus + Grafana

### Beneficios Obtenidos

- **Automatización completa** del proceso de desarrollo
- **Despliegue confiable** y reproducible
- **Monitoreo en tiempo real** de la aplicación
- **Escalabilidad** con contenedores
- **Registry de imágenes** centralizado en GitHub

### Tecnologías Aprendidas

- **Docker** y **Docker Compose**
- **GitHub Actions** para CI/CD
- **GitHub Container Registry** para imágenes Docker
- **Prometheus** y **Grafana** para monitoreo
- **Render** y **Vercel** para deploy
- **Selenium** para testing de UI

## 👥 Roles del Equipo

### Desarrollador Full Stack

- Desarrollo de frontend y backend
- Configuración de base de datos
- Implementación de APIs

### DevOps Engineer

- Configuración de CI/CD
- Dockerización de aplicaciones
- Configuración de monitoreo

### QA Engineer

- Implementación de tests automatizados
- Tests de integración
- Tests de UI con Selenium

## 📞 Contacto

- **Repositorio**: https://github.com/LadyFantasy/TPI_DEVOPS
- **GitHub Actions**: https://github.com/LadyFantasy/TPI_DEVOPS/actions
- **Container Registry**: https://github.com/LadyFantasy/TPI_DEVOPS?tab=packages
- **Documentación**: [docs/](docs/)
- **Issues**: https://github.com/LadyFantasy/TPI_DEVOPS/issues

---

**Nota**: Este proyecto demuestra la aplicación práctica de principios DevOps en un entorno real, desde el desarrollo hasta el despliegue automatizado en la nube.
