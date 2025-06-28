#!/bin/bash

# Script de inicio para PPIV
echo "🚀 Iniciando PPIV - Sistema de Gestión de Propiedades"

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

# Construir y levantar los servicios
echo "🔨 Construyendo imágenes Docker..."
docker-compose build

echo "📦 Levantando servicios..."
docker-compose up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# Verificar el estado de los servicios
echo "🔍 Verificando estado de los servicios..."
docker-compose ps

echo "✅ PPIV está listo!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "🗄️  Base de datos MySQL: localhost:3306"
echo ""
echo "📋 Comandos útiles:"
echo "   Ver logs: docker-compose logs -f"
echo "   Detener: docker-compose down"
echo "   Reiniciar: docker-compose restart" 