#!/bin/bash

# Script de inicio para desarrollo de PPIV
echo "🚀 Iniciando PPIV - Entorno de Desarrollo"

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Verificar si existe el archivo .env
if [ ! -f .env ]; then
    echo "⚠️  Archivo .env no encontrado. Copiando desde env.example..."
    cp env.example .env
    echo "📝 Por favor edita el archivo .env con tus configuraciones antes de continuar."
    echo "🔑 Credenciales por defecto:"
    echo "   Usuario: admin"
    echo "   Contraseña: admin123"
    exit 1
fi

# Construir y levantar los servicios de desarrollo
echo "🔨 Construyendo imágenes Docker para desarrollo..."
docker-compose -f docker-compose.dev.yml build

echo "📦 Levantando servicios de desarrollo..."
docker-compose -f docker-compose.dev.yml up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# Verificar el estado de los servicios
echo "🔍 Verificando estado de los servicios..."
docker-compose -f docker-compose.dev.yml ps

echo "✅ PPIV Desarrollo está listo!"
echo "🌐 Frontend: http://localhost:3000 (con hot reload)"
echo "🔧 Backend API: http://localhost:5000 (con hot reload)"
echo "🗄️  Base de datos MySQL: localhost:3306"
echo ""
echo "📋 Comandos útiles:"
echo "   Ver logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "   Detener: docker-compose -f docker-compose.dev.yml down"
echo "   Reiniciar: docker-compose -f docker-compose.dev.yml restart"
echo "   Ejecutar tests: docker-compose -f docker-compose.dev.yml exec backend pytest"
echo ""
echo "🔄 Hot reload activado - Los cambios se reflejarán automáticamente" 