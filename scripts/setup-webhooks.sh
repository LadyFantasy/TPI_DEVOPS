#!/bin/bash

# Script para configurar webhooks de deploy automático
# PPIV - GitHub Actions + Render + Vercel

echo "🚀 Configurando webhooks para deploy automático..."
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    print_error "Este script debe ejecutarse desde el directorio raíz del proyecto"
    exit 1
fi

print_status "Verificando estructura del proyecto..."

# Verificar que existan los directorios necesarios
if [ ! -d "ProyectoPPVI" ]; then
    print_error "No se encontró el directorio ProyectoPPVI"
    exit 1
fi

if [ ! -d "PI-PPIV-Front" ]; then
    print_error "No se encontró el directorio PI-PPIV-Front"
    exit 1
fi

if [ ! -d ".github/workflows" ]; then
    print_error "No se encontró el directorio .github/workflows"
    exit 1
fi

print_success "Estructura del proyecto verificada"

echo ""
print_status "Configuración de GitHub Actions:"
echo "1. Los workflows ya están configurados en .github/workflows/"
echo "2. Se ejecutarán automáticamente en cada push a main"
echo "3. Verifica que los secrets estén configurados en GitHub"

echo ""
print_status "Configuración de Render (Backend):"
echo "1. Ve a https://dashboard.render.com"
echo "2. Selecciona tu servicio de backend"
echo "3. En Settings → Build & Deploy:"
echo "   - Auto-Deploy: ✅ Habilitado"
echo "   - Branch: main"
echo "   - Build Command: pip install -r requirements.txt"
echo "   - Start Command: gunicorn app:app"
echo "4. En Environment Variables, configura:"
echo "   - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD"
echo "   - SECRET_KEY, JWT_SECRET_KEY"

echo ""
print_status "Configuración de Vercel (Frontend):"
echo "1. Ve a https://vercel.com/dashboard"
echo "2. Selecciona tu proyecto frontend"
echo "3. En Settings → Git:"
echo "   - Auto-Deploy: ✅ Habilitado"
echo "   - Branch: main"
echo "   - Framework Preset: Vite"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist"
echo "4. En Environment Variables, configura:"
echo "   - VITE_API_URL=https://tu-backend-render.onrender.com"

echo ""
print_status "Verificación de archivos de configuración:"

# Verificar archivos importantes
if [ -f "ProyectoPPVI/requirements.txt" ]; then
    print_success "requirements.txt encontrado"
else
    print_warning "requirements.txt no encontrado en ProyectoPPVI/"
fi

if [ -f "PI-PPIV-Front/package.json" ]; then
    print_success "package.json encontrado"
else
    print_warning "package.json no encontrado en PI-PPIV-Front/"
fi

if [ -f "ProyectoPPVI/Dockerfile" ]; then
    print_success "Dockerfile del backend encontrado"
else
    print_warning "Dockerfile no encontrado en ProyectoPPVI/"
fi

if [ -f "PI-PPIV-Front/Dockerfile" ]; then
    print_success "Dockerfile del frontend encontrado"
else
    print_warning "Dockerfile no encontrado en PI-PPIV-Front/"
fi

echo ""
print_status "Comandos útiles para verificar el estado:"

echo "1. Verificar workflows de GitHub Actions:"
echo "   gh run list"

echo "2. Ver logs de un workflow específico:"
echo "   gh run view <workflow-id>"

echo "3. Re-ejecutar un workflow:"
echo "   gh run rerun <workflow-id>"

echo "4. Verificar estado de Render:"
echo "   curl https://tu-app.onrender.com/health"

echo "5. Verificar estado de Vercel:"
echo "   curl https://tu-app.vercel.app"

echo ""
print_success "Configuración completada!"
echo ""
echo "📋 Resumen de lo que necesitas hacer:"
echo "1. ✅ Verificar que los workflows estén en .github/workflows/"
echo "2. 🔧 Configurar variables de entorno en Render"
echo "3. 🔧 Configurar variables de entorno en Vercel"
echo "4. 🚀 Hacer push a main para probar el deploy automático"
echo ""
echo "📚 Documentación completa en: docs/webhooks-setup.md" 