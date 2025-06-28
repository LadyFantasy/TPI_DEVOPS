# 🚀 Deploy Automático: Backend en Render & Frontend en Vercel

Este instructivo explica cómo desplegar automáticamente el **backend** en Render y el **frontend** en Vercel usando GitHub Actions y deploy hooks.

---

## 🌐 Arquitectura

```
┌──────────────┐         ┌──────────────┐
│   Vercel     │         │   Render     │
│  (Frontend)  │◄───────►│  (Backend)   │
│ React + Vite │         │ Flask + MySQL│
└──────────────┘         └──────────────┘
```

---

## 1️⃣ Backend en Render

### 1.1. Crear el servicio en Render

- Ve a [Render](https://render.com/)
- Crea un **Web Service**
- Conecta tu repo de GitHub
- Elige la carpeta `ProyectoPPVI`
- **Build Command:**
  ```bash
  pip install -r requirements.txt
  ```
- **Start Command:**
  ```bash
  gunicorn --bind 0.0.0.0:10000 --workers 4 --timeout 120 app:app
  ```
- **Python Version:** 3.11
- Agrega las variables de entorno necesarias (las mismas que en tu `.env`)

### 1.2. Configurar Deploy Hook en Render

- Ve a la configuración del servicio en Render
- Busca la sección **Deploy Hooks**
- Crea un nuevo hook y copia la URL
- Entra a tu repo en GitHub > **Settings** > **Secrets and variables** > **Actions**
- Agrega un nuevo secreto:
  - **Name:** `RENDER_DEPLOY_HOOK_URL`
  - **Value:** (la URL del hook de Render)

---

## 2️⃣ Frontend en Vercel

### 2.1. Crear el proyecto en Vercel

- Ve a [Vercel](https://vercel.com/)
- Importa tu repo de GitHub
- Elige la carpeta `PI-PPIV-Front`
- Vercel detecta React automáticamente
- Agrega las variables de entorno necesarias (las mismas que en tu `.env`)

### 2.2. Configurar Deploy Hook en Vercel

- Ve a la configuración del proyecto en Vercel
- Busca la sección **Deploy Hooks**
- Crea un nuevo hook para la rama `main` y copia la URL
- Entra a tu repo en GitHub > **Settings** > **Secrets and variables** > **Actions**
- Agrega un nuevo secreto:
  - **Name:** `VERCEL_DEPLOY_HOOK_URL`
  - **Value:** (la URL del hook de Vercel)

---

## 3️⃣ Pipeline de CI/CD en GitHub Actions

Ya tienes el workflow `.github/workflows/ci-cd.yml` configurado. Solo asegúrate de tener estos pasos en el job de deploy:

```yaml
deploy-production:
  name: Deploy to Production
  runs-on: ubuntu-latest
  needs: [build, security-scan]
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  environment: production

  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Trigger Render Backend Deploy
      run: |
        curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_URL }}

    - name: Trigger Vercel Frontend Deploy
      run: |
        curl -X POST ${{ secrets.VERCEL_DEPLOY_HOOK_URL }}
```

---

## 4️⃣ Variables de Entorno

Asegúrate de que **Render** y **Vercel** tengan todas las variables de entorno necesarias:

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `SECRET_KEY`, `JWT_SECRET_KEY`
- `MAIL_SERVER`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_DEFAULT_SENDER`
- `URL_FRONT` (en backend)

Puedes copiar las del archivo `.env`.

---

## 5️⃣ ¿Cómo funciona el deploy automático?

1. Haces push a la rama `main` en GitHub
2. GitHub Actions ejecuta los tests y build
3. Si todo pasa, ejecuta los deploy hooks:
   - Render: Despliega el backend
   - Vercel: Despliega el frontend
4. ¡Tu app está online en ambos servicios!

---

## 6️⃣ URLs de Producción

- **Frontend (Vercel):** https://<tu-proyecto-vercel>.vercel.app
- **Backend (Render):** https://<tu-servicio-render>.onrender.com

---

## 7️⃣ Troubleshooting

- Si el deploy falla, revisa los logs en Render y Vercel
- Verifica que las variables de entorno estén correctas
- Puedes disparar el deploy manualmente desde los paneles de Render y Vercel

---

## 8️⃣ Recursos

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

**¡Listo! Tu pipeline DevOps está 100% automatizado y cloud-native 🚀**
