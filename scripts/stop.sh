#!/bin/bash

# Script para detener PPIV
echo "🛑 Deteniendo PPIV - Sistema de Gestión de Propiedades"

# Detener y eliminar contenedores
echo "📦 Deteniendo servicios..."
docker-compose down

echo "🧹 Limpiando recursos..."
docker system prune -f

echo "✅ PPIV ha sido detenido correctamente."
echo ""
echo "📋 Para volver a iniciar: ./scripts/start.sh" 