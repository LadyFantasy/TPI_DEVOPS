# 🐳 PPIV - Dockerización Completa

Este documento describe cómo dockerizar y desplegar la aplicación PPIV (Sistema de Gestión de Propiedades) usando Docker y Docker Compose.

## 📋 Requisitos Previos

- Docker Desktop instalado
- Docker Compose instalado
- Git instalado

## 🏗️ Arquitectura de la Aplicación

La aplicación PPIV está compuesta por los siguientes servicios:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Base de       │
│   (React)       │◄──►│   (Flask)       │◄──►│   Datos         │
│   Puerto: 3000  │    │   Puerto: 5000  │    │   (MySQL)       │
│                 │    │                 │    │   Puerto: 3306  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd PPIV
```

### 2. Configurar variables de entorno

```bash
cp env.example .env
# Editar .env con tus configuraciones
```

### 3. Ejecutar con script automático

```bash
chmod +x scripts/start.sh
./scripts/start.sh
```

### 4. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Base de datos**: localhost:3306

## 🔧 Configuración Manual

### Variables de Entorno (.env)

```env
# Base de datos
MYSQL_ROOT_PASSWORD=tu_password_root
DB_NAME=ppiv_db
DB_USER=ppiv_user
DB_PASSWORD=tu_password_db

# Flask
SECRET_KEY=tu_clave_secreta_super_segura
JWT_SECRET_KEY=tu_clave_jwt_secreta

# Email
MAIL_SERVER=smtp.gmail.com
MAIL_USERNAME=tu_email@gmail.com
MAIL_PASSWORD=tu_password_app
MAIL_DEFAULT_SENDER=tu_email@gmail.com

# Frontend URL
URL_FRONT=http://localhost:3000
```

### Comandos Docker Compose

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

## 📁 Estructura de Archivos Docker

```
PPIV/
├── docker-compose.yml          # Orquestación de servicios
├── .dockerignore              # Archivos a ignorar en build
├── env.example                # Variables de entorno de ejemplo
├── init.sql                   # Script de inicialización de BD
├── scripts/
│   ├── start.sh              # Script de inicio
│   └── stop.sh               # Script de parada
├── nginx/
│   └── nginx.conf            # Configuración de reverse proxy
├── PI-PPIV-Front/
│   ├── Dockerfile            # Dockerfile del frontend
│   └── nginx.conf            # Configuración nginx frontend
└── ProyectoPPVI/
    └── Dockerfile            # Dockerfile del backend
```

## 🔍 Servicios Detallados

### 1. Frontend (React + Vite)

- **Puerto**: 3000
- **Tecnología**: React 19, Vite
- **Servidor**: Nginx
- **Build**: Multi-stage build optimizado

### 2. Backend (Flask)

- **Puerto**: 5000
- **Tecnología**: Flask, Gunicorn
- **Workers**: 4
- **Timeout**: 120s

### 3. Base de Datos (MySQL)

- **Puerto**: 3306
- **Versión**: MySQL 8.0
- **Persistencia**: Volumen Docker
- **Health Check**: Automático

### 4. Nginx Reverse Proxy (Opcional)

- **Puerto**: 80, 443
- **Funcionalidad**: Load balancing, SSL termination

## 🧪 Testing

### Ejecutar tests del backend

```bash
docker-compose exec backend python -m pytest tests/
```

### Ejecutar tests del frontend

```bash
docker-compose exec frontend npm test
```

## 📊 Monitoreo

### Ver logs en tiempo real

```bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Verificar estado de servicios

```bash
docker-compose ps
```

### Estadísticas de recursos

```bash
docker stats
```

## 🔒 Seguridad

### Buenas Prácticas Implementadas

1. **Variables de entorno**: No hardcodeadas en imágenes
2. **Usuarios no-root**: Contenedores ejecutan con usuarios limitados
3. **Health checks**: Verificación automática de salud de servicios
4. **Volúmenes**: Persistencia segura de datos
5. **Networks**: Aislamiento de red entre servicios

### Configuración de Producción

```bash
# Generar claves secretas seguras
openssl rand -hex 32

# Configurar SSL/TLS
# Descomentar sección HTTPS en nginx/nginx.conf
# Agregar certificados en nginx/ssl/
```

## 🚀 Despliegue en Producción

### 1. Preparar servidor

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Configurar variables de producción

```bash
# Editar .env con configuraciones de producción
nano .env
```

### 3. Desplegar

```bash
./scripts/start.sh
```

## 🐛 Troubleshooting

### Problemas Comunes

1. **Puerto ya en uso**

   ```bash
   # Verificar puertos en uso
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :5000
   netstat -tulpn | grep :3306
   ```

2. **Error de conexión a base de datos**

   ```bash
   # Verificar logs de MySQL
   docker-compose logs mysql

   # Conectar manualmente
   docker-compose exec mysql mysql -u root -p
   ```

3. **Error de build**

   ```bash
   # Limpiar cache de Docker
   docker system prune -a

   # Reconstruir sin cache
   docker-compose build --no-cache
   ```

### Logs de Error

```bash
# Ver logs de error específicos
docker-compose logs --tail=100 backend | grep ERROR
docker-compose logs --tail=100 frontend | grep error
```

## 📈 Escalabilidad

### Escalar servicios

```bash
# Escalar backend a 3 instancias
docker-compose up -d --scale backend=3

# Escalar frontend a 2 instancias
docker-compose up -d --scale frontend=2
```

### Load Balancing

El nginx reverse proxy distribuye automáticamente la carga entre múltiples instancias.

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker images
        run: docker-compose build
      - name: Run tests
        run: docker-compose run backend python -m pytest
      - name: Deploy
        run: docker-compose up -d
```

## 📚 Recursos Adicionales

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://reactjs.org/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

**Desarrollado con ❤️ para el TP de DevOps**
