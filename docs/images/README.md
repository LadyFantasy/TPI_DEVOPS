# 📸 Guía para Agregar Imágenes al README de GitHub Actions

Este directorio contiene las imágenes utilizadas en el README de GitHub Actions para hacer la documentación más visual y fácil de entender.

## 📁 Estructura de Archivos

```
docs/images/
├── README.md                           # Este archivo
├── workflow-overview.png               # Vista general del workflow
├── pipeline-execution.png              # Ejecución del pipeline
├── backend-tests-success.png           # Tests backend exitosos
├── frontend-tests-success.png          # Tests frontend exitosos
├── linting-results.png                 # Resultados de linting
├── docker-build-success.png            # Build de Docker exitoso
├── ghcr-images.png                     # Imágenes en GitHub Container Registry
├── render-dashboard.png                # Dashboard de Render
├── vercel-dashboard.png                # Dashboard de Vercel
├── github-secrets.png                  # Configuración de secrets
├── pipeline-metrics.png                # Métricas del pipeline
├── error-logs-example.png              # Ejemplo de logs de error
├── performance-dashboard.png           # Dashboard de rendimiento
├── jobs-running.png                    # Jobs ejecutándose
├── tests-success.png                   # Tests exitosos
├── docker-build.png                    # Build de Docker
└── deploy-status.png                   # Estado del deploy
```

## 🖼️ Cómo Agregar Imágenes

### 1. **Capturar Screenshots**

#### GitHub Actions

- Ve a tu repositorio > **Actions**
- Captura la vista general del workflow
- Captura jobs específicos ejecutándose
- Captura resultados exitosos/fallidos

#### Render Dashboard

- Ve a tu dashboard de Render
- Captura el estado del servicio
- Captura los logs de deploy

#### Vercel Dashboard

- Ve a tu dashboard de Vercel
- Captura el estado del proyecto
- Captura los logs de build

### 2. **Formato de Imágenes**

- **Formato**: PNG o JPG
- **Resolución**: Mínimo 800x600px
- **Tamaño**: Máximo 2MB por imagen
- **Nombres**: Usar kebab-case (ej: `workflow-overview.png`)

### 3. **Agregar al README**

```markdown
![Descripción de la imagen](./docs/images/nombre-imagen.png)
```

### 4. **Optimizar Imágenes**

Antes de subir las imágenes:

- Comprimir para reducir el tamaño
- Asegurar que el texto sea legible
- Recortar áreas innecesarias

## 📋 Lista de Imágenes Necesarias

### ✅ Imágenes Principales (Obligatorias)

- [ ] `workflow-overview.png` - Vista general del workflow en GitHub Actions
- [ ] `pipeline-execution.png` - Pipeline ejecutándose en tiempo real
- [ ] `backend-tests-success.png` - Tests del backend pasando
- [ ] `frontend-tests-success.png` - Tests del frontend pasando
- [ ] `docker-build-success.png` - Build de Docker exitoso

### 📊 Imágenes de Monitoreo (Recomendadas)

- [ ] `render-dashboard.png` - Dashboard de Render
- [ ] `vercel-dashboard.png` - Dashboard de Vercel
- [ ] `github-secrets.png` - Configuración de secrets
- [ ] `pipeline-metrics.png` - Métricas del pipeline

### 🚨 Imágenes de Debugging (Opcionales)

- [ ] `error-logs-example.png` - Ejemplo de logs de error
- [ ] `performance-dashboard.png` - Dashboard de rendimiento

## 🎯 Consejos para Capturas de Pantalla

### GitHub Actions

1. **Vista General**: Captura toda la página de Actions
2. **Jobs Específicos**: Enfócate en un job específico
3. **Logs**: Captura logs relevantes (sin información sensible)
4. **Métricas**: Captura gráficos de tiempo y éxito

### Dashboards

1. **Estado General**: Vista completa del dashboard
2. **Detalles**: Enfócate en métricas específicas
3. **Logs**: Captura logs de deploy (sin datos sensibles)

### Configuración

1. **Secrets**: Captura la estructura (sin valores reales)
2. **Variables**: Muestra nombres pero no valores
3. **Settings**: Configuración general sin datos privados

## 🔒 Seguridad

⚠️ **IMPORTANTE**: Nunca incluyas en las capturas de pantalla:

- Tokens de acceso
- Contraseñas
- URLs de webhooks
- Datos de conexión a bases de datos
- Información personal

## 📝 Ejemplo de Uso

```markdown
## 📸 Workflow en Acción

### Vista General del Pipeline

![GitHub Actions Workflow Overview](./docs/images/workflow-overview.png)

### Tests Exitosos

![Backend Tests Success](./docs/images/backend-tests-success.png)

### Deploy Status

![Render Dashboard](./docs/images/render-dashboard.png)
```

## 🚀 Próximos Pasos

1. **Capturar screenshots** de tu pipeline en acción
2. **Optimizar imágenes** para el repositorio
3. **Agregar al README** siguiendo el formato
4. **Verificar** que las imágenes se muestren correctamente
5. **Actualizar** la documentación según sea necesario

---

**¡Con estas imágenes, tu README será mucho más visual y fácil de entender! 📸**

# 📸 Imágenes del Proyecto PPIV

Esta carpeta contiene todas las imágenes y capturas de pantalla utilizadas en la documentación del proyecto.

## 📋 Contenido

### 🚀 Pipeline CI/CD

- **`pipeline okay.png`** - Captura del pipeline de GitHub Actions funcionando exitosamente con todos los jobs en verde

### 📊 Diagramas y Documentación

- Diagramas de arquitectura
- Capturas de interfaces
- Gráficos de métricas

## 📝 Cómo Agregar Imágenes

1. **Formato recomendado**: PNG o JPG
2. **Tamaño**: Optimizar para web (máximo 1MB)
3. **Nomenclatura**: Usar nombres descriptivos en minúsculas con guiones
4. **Referencia**: Actualizar este README cuando se agreguen nuevas imágenes

## 🔗 Referencias en Documentación

- **README.md**: `./docs/images/pipeline%20okay.png`
- **pipeline-diagram.md**: `./images/pipeline%20okay.png`

---

_Última actualización: $(date)_
