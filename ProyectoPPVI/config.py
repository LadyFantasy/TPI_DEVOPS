import os

# Detectar si estamos en producción (deploy) o desarrollo (Docker)
IS_PRODUCTION = os.getenv('IS_PRODUCTION', 'false').lower() == 'true'
IS_DOCKER = os.path.exists('/.dockerenv') or os.getenv('DOCKER_ENV', 'false').lower() == 'true'

# Configuración de base de datos
if IS_PRODUCTION:
    # Configuración para producción (Filess.io)
    DB_CONFIG = {
        'host': os.getenv('DB_HOST', 'pk3b0.h.filess.io'),
        'user': os.getenv('DB_USER', 'alojamientosomeguitas_particles'),
        'password': os.getenv('DB_PASSWORD', '78257cb7780930b4a49e34a571e84c54848c62c9'),
        'database': os.getenv('DB_NAME', 'alojamientosomeguitas_particles'),
        'port': int(os.getenv('DB_PORT', '3307'))
    }
    print("🔧 Configuración de PRODUCCIÓN detectada - Usando Filess.io")
else:
    # Configuración para desarrollo (Docker local)
    DB_CONFIG = {
        'host': os.getenv('DB_HOST', 'mysql'),
        'user': os.getenv('DB_USER', 'root'),
        'password': os.getenv('DB_PASSWORD', 'password'),
        'database': os.getenv('DB_NAME', 'ppiv_db'),  # Usar el mismo nombre que en init.sql
        'port': int(os.getenv('DB_PORT', '3306'))
    }
    print("🔧 Configuración de DESARROLLO detectada - Usando MySQL local")

# Configuración de la aplicación
APP_CONFIG = {
    'debug': not IS_PRODUCTION,
    'host': '0.0.0.0',
    'port': int(os.getenv('PORT', '5000')),
    'secret_key': os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production'),
    'jwt_secret_key': os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret-key-change-in-production')
}

print(f"🌍 Environment: {'PRODUCTION' if IS_PRODUCTION else 'DEVELOPMENT'}")
print(f"🐳 Docker: {'YES' if IS_DOCKER else 'NO'}")
print(f"🗄️  Database Host: {DB_CONFIG['host']}")
print(f"📊 Database Name: {DB_CONFIG['database']}")
print(f"🔌 Database Port: {DB_CONFIG['port']}") 