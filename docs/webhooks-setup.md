# Configuración de Webhooks para Deploy Automático

## 🔗 Obteniendo los Webhooks

### Render (Backend) - Webhook URL

1. **Accede a tu dashboard de Render**:

   - Ve a https://dashboard.render.com
   - Inicia sesión con tu cuenta

2. **Selecciona tu servicio de backend**:

   - En la lista de servicios, encuentra tu aplicación backend
   - Haz clic en el nombre del servicio

3. **Obtén el webhook**:
   - En el menú lateral, ve a **"Settings"**
   - Busca la sección **"Build & Deploy"**
   - Desplázate hacia abajo hasta encontrar **"Webhook URL"**
   - Copia la URL completa (se ve algo así):
     ```
     https://api.render.com/deploy/srv-XXXXXXXXXXXX?key=tu-api-key
     ```

### Vercel (Frontend) - Opciones Disponibles

#### 🆓 Plan Gratuito - Deploy Hooks (Recomendado)

1. **Accede a tu dashboard de Vercel**:

   - Ve a https://vercel.com/dashboard
   - Inicia sesión con tu cuenta

2. **Selecciona tu proyecto frontend**:

   - En la lista de proyectos, encuentra tu aplicación frontend
   - Haz clic en el nombre del proyecto

3. **Crea un Deploy Hook**:
   - En el menú lateral, ve a **"Settings"**
   - Busca la sección **"Git"**
   - Haz clic en **"Deploy Hooks"**
   - Haz clic en **"Create Hook"**
   - Completa el formulario:
     - **Name**: `GitHub Actions Deploy`
     - **Branch**: `main`
     - **Framework Preset**: `Vite` (o el que uses)
   - Haz clic en **"Create Hook"**
   - Copia la URL que se genera (se ve algo así):
     ```
     https://api.vercel.com/v1/hooks/deploy?url=tu-deploy-hook-url
     ```

#### 💰 Plan de Pago - Webhooks Avanzados

Si tienes un plan de pago, también puedes usar webhooks más avanzados:

- Ve a **Settings** → **Integrations** → **Webhooks**
- Crea un webhook con más opciones de configuración

#### 📡 Auto-Deploy (Plan Gratuito - Sin Configuración)

Si no configuras nada, Vercel se despliega automáticamente con cada push a `main`.

## 🔧 Configurando los Webhooks en GitHub

### Paso 1: Ir a los Secrets del Repositorio

1. **Ve a tu repositorio en GitHub**
2. Haz clic en la pestaña **"Settings"**
3. En el menú lateral, busca **"Secrets and variables"**
4. Haz clic en **"Actions"**

### Paso 2: Agregar los Secrets

1. **Para Render**:

   - Haz clic en **"New repository secret"**
   - **Name**: `RENDER_WEBHOOK_URL`
   - **Value**: Pega la URL del webhook de Render que copiaste
   - Haz clic en **"Add secret"**

2. **Para Vercel (Plan Gratuito)**:

   - Haz clic en **"New repository secret"**
   - **Name**: `VERCEL_DEPLOY_HOOK_URL`
   - **Value**: Pega la URL del Deploy Hook de Vercel que copiaste
   - Haz clic en **"Add secret"**

3. **Para Vercel (Plan de Pago - Opcional)**:
   - Haz clic en **"New repository secret"**
   - **Name**: `VERCEL_WEBHOOK_URL`
   - **Value**: Pega la URL del webhook avanzado de Vercel
   - Haz clic en **"Add secret"**

## 🚀 Cómo Funcionan los Webhooks

### Render (Backend)

- **Webhook**: Dispara deploy manualmente desde GitHub Actions
- **Auto-Deploy**: Detecta cambios automáticamente (fallback)

### Vercel (Frontend) - Plan Gratuito

- **Deploy Hooks**: Dispara deploy manualmente desde GitHub Actions
- **Auto-Deploy**: Detecta cambios automáticamente (fallback)

### Vercel (Frontend) - Plan de Pago

- **Webhooks Avanzados**: Más opciones de configuración y control
- **Deploy Hooks**: También disponibles
- **Auto-Deploy**: Siempre disponible

## 📋 Configuración Completa

### Render (Backend)

1. **Configuración del repositorio**:

   - En "Settings" → "Build & Deploy"
   - **Auto-Deploy**: ✅ Habilitado
   - **Branch**: `main`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

2. **Variables de entorno**:

   - En "Environment Variables", configura:
     ```
     DB_HOST=tu-host-de-mysql
     DB_PORT=3306
     DB_NAME=ppiv_db
     DB_USER=tu-usuario
     DB_PASSWORD=tu-password
     SECRET_KEY=tu-secret-key
     JWT_SECRET_KEY=tu-jwt-secret-key
     ```

3. **Webhook URL**:
   - Copia la URL de la sección "Webhook URL"
   - Configúrala como secret en GitHub

### Vercel (Frontend) - Plan Gratuito

1. **Configuración del repositorio**:

   - En "Settings" → "Git"
   - **Auto-Deploy**: ✅ Habilitado
   - **Branch**: `main`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

2. **Variables de entorno**:

   - En "Environment Variables", configura:
     ```
     VITE_API_URL=https://tu-backend-render.onrender.com
     ```

3. **Deploy Hook** (Recomendado):
   - Crea un Deploy Hook en "Settings" → "Git" → "Deploy Hooks"
   - Configúralo como secret en GitHub

## 🔍 Verificando la Configuración

### Verificar Webhooks en GitHub Actions

1. **Ve a la pestaña "Actions"** en tu repositorio
2. **Ejecuta el workflow** `deploy-webhooks.yml`
3. **Revisa los logs** para ver el estado de los webhooks:
   ```
   📝 Deployment Method Status:
     - Render Webhook: ✅ Configured
     - Vercel Deploy Hook: ✅ Configured (Free Plan)
   ```

### Probar los Webhooks Manualmente

```bash
# Probar webhook de Render
curl -X POST "tu-render-webhook-url"

# Probar Deploy Hook de Vercel (Plan Gratuito)
curl -X POST "tu-vercel-deploy-hook-url"
```

## 🆓 Plan Gratuito vs Plan de Pago

### Plan Gratuito ✅

- **Deploy Hooks**: ✅ Disponibles
- **Auto-Deploy**: ✅ Disponible
- **Webhooks Avanzados**: ❌ No disponibles
- **Funcionalidad**: Perfecta para la mayoría de proyectos

### Plan de Pago 💰

- **Deploy Hooks**: ✅ Disponibles
- **Auto-Deploy**: ✅ Disponible
- **Webhooks Avanzados**: ✅ Disponibles
- **Funcionalidad**: Más opciones de control y configuración

## 🛠️ Troubleshooting

### Deploy Hook de Vercel no funciona

- Verifica que la URL esté correcta
- Asegúrate de que el proyecto esté conectado a GitHub
- Revisa los logs de Vercel para errores

### Webhook de Render no funciona

- Verifica que la URL esté correcta
- Asegúrate de que el servicio esté activo en Render
- Revisa los logs de Render para errores

### GitHub Actions no encuentra los secrets

- Verifica que los nombres de los secrets sean exactos:
  - `RENDER_WEBHOOK_URL`
  - `VERCEL_DEPLOY_HOOK_URL` (Plan Gratuito)
  - `VERCEL_WEBHOOK_URL` (Plan de Pago)
- Asegúrate de que estén configurados en el repositorio correcto

## 📚 Comandos Útiles

```bash
# Verificar workflows de GitHub Actions
gh run list

# Ver logs de un workflow específico
gh run view <workflow-id>

# Re-ejecutar un workflow
gh run rerun <workflow-id>

# Verificar estado de Render
curl https://tu-app.onrender.com/health

# Verificar estado de Vercel
curl https://tu-app.vercel.app

# Probar webhook de Render
curl -X POST "$RENDER_WEBHOOK_URL"

# Probar Deploy Hook de Vercel (Plan Gratuito)
curl -X POST "$VERCEL_DEPLOY_HOOK_URL"
```

## 🎯 Flujo Completo de Deploy

1. **Push a `main`** → GitHub Actions se ejecuta
2. **Tests pasan** → Se ejecuta el workflow de webhooks
3. **Webhook de Render** → Dispara deploy del backend
4. **Deploy Hook de Vercel** → Dispara deploy del frontend
5. **Notificación** → Resumen del estado del deploy

## 💡 Recomendación para Plan Gratuito

Para el plan gratuito, te recomiendo:

1. **Configurar Deploy Hooks** en Vercel (son gratuitos)
2. **Configurar Webhooks** en Render
3. **Mantener Auto-Deploy habilitado** como respaldo

¡Con esta configuración tendrás un pipeline de CI/CD completo y funcional en el plan gratuito! 🚀
