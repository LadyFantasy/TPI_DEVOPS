#!/bin/bash

# Script para obtener y configurar webhooks de Render y Vercel
# PPIV - GitHub Actions + Render + Vercel

echo "🔗 Obteniendo Webhooks para Deploy Automático"
echo "=============================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

print_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

print_note() {
    echo -e "${CYAN}[NOTE]${NC} $1"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    print_error "Este script debe ejecutarse desde el directorio raíz del proyecto"
    exit 1
fi

echo ""
print_step "PASO 1: Obtener Webhook de Render (Backend)"
echo "------------------------------------------------"

echo "1. Ve a https://dashboard.render.com"
echo "2. Inicia sesión con tu cuenta"
echo "3. Selecciona tu servicio de backend"
echo "4. Ve a Settings → Build & Deploy"
echo "5. Busca la sección 'Webhook URL'"
echo "6. Copia la URL completa"

echo ""
read -p "¿Ya tienes la URL del webhook de Render? (s/n): " has_render_webhook

if [[ $has_render_webhook =~ ^[Ss]$ ]]; then
    read -p "Pega la URL del webhook de Render: " render_webhook_url
    echo ""
    print_success "Webhook de Render guardado:"
    echo "  $render_webhook_url"
else
    print_warning "No se configuró el webhook de Render"
    render_webhook_url=""
fi

echo ""
print_step "PASO 2: Obtener Deploy Hook de Vercel (Frontend) - PLAN GRATUITO"
echo "----------------------------------------------------------------------"

echo "📝 IMPORTANTE: En Vercel, los webhooks avanzados requieren plan de pago."
echo "   Para el plan gratuito, usamos 'Deploy Hooks' que son completamente gratuitos."
echo ""

echo "1. Ve a https://vercel.com/dashboard"
echo "2. Inicia sesión con tu cuenta"
echo "3. Selecciona tu proyecto frontend"
echo "4. Ve a Settings → Git → Deploy Hooks"
echo "5. Haz clic en 'Create Hook'"
echo "6. Completa el formulario:"
echo "   - Name: GitHub Actions Deploy"
echo "   - Branch: main"
echo "   - Framework Preset: Vite"
echo "7. Copia la URL que se genera"

echo ""
read -p "¿Ya tienes la URL del Deploy Hook de Vercel? (s/n): " has_vercel_hook

if [[ $has_vercel_hook =~ ^[Ss]$ ]]; then
    read -p "Pega la URL del Deploy Hook de Vercel: " vercel_deploy_hook_url
    echo ""
    print_success "Deploy Hook de Vercel guardado:"
    echo "  $vercel_deploy_hook_url"
else
    print_warning "No se configuró el Deploy Hook de Vercel"
    vercel_deploy_hook_url=""
fi

echo ""
print_step "PASO 3: Configurar Secrets en GitHub"
echo "------------------------------------------"

echo "1. Ve a tu repositorio en GitHub"
echo "2. Haz clic en Settings"
echo "3. En el menú lateral, busca 'Secrets and variables'"
echo "4. Haz clic en 'Actions'"
echo "5. Haz clic en 'New repository secret'"

if [[ -n "$render_webhook_url" ]]; then
    echo ""
    print_note "Para Render:"
    echo "  - Name: RENDER_WEBHOOK_URL"
    echo "  - Value: $render_webhook_url"
fi

if [[ -n "$vercel_deploy_hook_url" ]]; then
    echo ""
    print_note "Para Vercel (Plan Gratuito):"
    echo "  - Name: VERCEL_DEPLOY_HOOK_URL"
    echo "  - Value: $vercel_deploy_hook_url"
fi

echo ""
read -p "¿Ya configuraste los secrets en GitHub? (s/n): " secrets_configured

if [[ $secrets_configured =~ ^[Ss]$ ]]; then
    print_success "¡Perfecto! Los secrets están configurados"
else
    print_warning "Recuerda configurar los secrets antes de continuar"
fi

echo ""
print_step "PASO 4: Probar los Webhooks"
echo "--------------------------------"

if [[ -n "$render_webhook_url" ]]; then
    echo ""
    read -p "¿Quieres probar el webhook de Render ahora? (s/n): " test_render
    
    if [[ $test_render =~ ^[Ss]$ ]]; then
        print_status "Probando webhook de Render..."
        response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$render_webhook_url")
        
        if [[ $response == "200" ]]; then
            print_success "Webhook de Render funcionó correctamente (HTTP $response)"
        else
            print_warning "Webhook de Render devolvió HTTP $response"
        fi
    fi
fi

if [[ -n "$vercel_deploy_hook_url" ]]; then
    echo ""
    read -p "¿Quieres probar el Deploy Hook de Vercel ahora? (s/n): " test_vercel
    
    if [[ $test_vercel =~ ^[Ss]$ ]]; then
        print_status "Probando Deploy Hook de Vercel..."
        response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$vercel_deploy_hook_url")
        
        if [[ $response == "200" ]]; then
            print_success "Deploy Hook de Vercel funcionó correctamente (HTTP $response)"
        else
            print_warning "Deploy Hook de Vercel devolvió HTTP $response"
        fi
    fi
fi

echo ""
print_step "PASO 5: Verificar Configuración"
echo "------------------------------------"

echo "Para verificar que todo esté configurado correctamente:"
echo ""
echo "1. Ve a la pestaña 'Actions' en tu repositorio de GitHub"
echo "2. Busca el workflow 'Deploy Webhooks - PPIV'"
echo "3. Haz clic en 'Run workflow'"
echo "4. Revisa los logs para ver el estado de los webhooks:"
echo ""
echo "   📝 Deployment Method Status:"
echo "     - Render Webhook: ✅ Configured (o ⚠️ Not configured)"
echo "     - Vercel Deploy Hook: ✅ Configured (Free Plan) (o ⚠️ Not configured)"

echo ""
print_success "¡Configuración de webhooks completada!"
echo ""
echo "📋 Resumen:"
if [[ -n "$render_webhook_url" ]]; then
    echo "  ✅ Render Webhook: Configurado"
else
    echo "  ⚠️  Render Webhook: No configurado (usará auto-deploy)"
fi

if [[ -n "$vercel_deploy_hook_url" ]]; then
    echo "  ✅ Vercel Deploy Hook: Configurado (Plan Gratuito)"
else
    echo "  ⚠️  Vercel Deploy Hook: No configurado (usará auto-deploy)"
fi

echo ""
echo "💡 Información sobre Vercel:"
echo "  - Deploy Hooks: ✅ Gratuitos (lo que acabamos de configurar)"
echo "  - Webhooks Avanzados: 💰 Requieren plan de pago"
echo "  - Auto-Deploy: ✅ Siempre disponible"
echo ""
echo "🚀 Próximos pasos:"
echo "1. Haz push a main para probar el deploy automático"
echo "2. Revisa los logs en GitHub Actions"
echo "3. Verifica que las aplicaciones se desplieguen correctamente"
echo ""
echo "📚 Documentación completa en: docs/webhooks-setup.md" 