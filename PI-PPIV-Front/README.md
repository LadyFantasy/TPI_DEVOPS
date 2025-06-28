# 🏨 Sistema de Gestión de Alquileres - Frontend

[![Deploy con Vercel](https://vercel.com/button)](https://proyecto-ppiv-front.vercel.app)

> **Accede a la aplicación en vivo:** [**https://pi-ppiv-front.vercel.app/**](https://pi-ppiv-front.vercel.app/)

![Panel Principal de la aplicación](src/assets/img%20project/panel%20.png)

Este es el repositorio del frontend para la aplicación de gestión de alquileres, una plataforma robusta diseñada para administrar unidades de alquiler, reservas, precios dinámicos, administradores y más.

La aplicación está construida con **React** y **Vite**, utilizando **React Router** para la navegación y ofreciendo una experiencia de usuario moderna e intuitiva.

---

## 📋 Características Principales

- **Gestión de Unidades**: Crear, leer, actualizar y eliminar (CRUD) propiedades de alquiler. Incluye carga de imágenes, asignación de comodidades y detalles completos por unidad.
- **Gestión de Administradores**: Sistema de roles con un **Super-administrador** que puede crear, eliminar y gestionar los permisos de otros administradores.
- **Sistema de Reservas**: Visualización de reservas organizadas por estado (Vigentes, Futuras, Pasadas, Canceladas).
- **Proceso de Check-in**: Funcionalidad para registrar la llegada de huéspedes a través de un enlace único.
- **Motor de Precios Dinámicos**: Permite configurar multiplicadores de precios para períodos específicos (temporada alta, baja, etc.), afectando el costo final de las reservas.
- **Generación de Informes**: Genera informes de ocupación y los envía por correo electrónico al administrador.
- **Seguridad y Autenticación**: Sistema de login basado en tokens (JWT) y rutas protegidas para asegurar el acceso solo a usuarios autorizados.
- **Validación de Formularios**: Todos los formularios cuentan con validación en el lado del cliente para asegurar la integridad de los datos antes de ser enviados al backend.

---

## 🛠️ Tecnologías Utilizadas

- **Framework**: [React](https://reactjs.org/) (v18+)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Estilos**: CSS plano con enfoque en la modularidad y variables CSS.
- **Iconos**: [React Icons](https://react-icons.github.io/react-icons/)
- **Cliente de Calendario**: [React Datepicker](https://reactdatepicker.com/)
- **Linting**: [ESLint](https://eslint.org/)

---

## 🚀 Cómo Empezar

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno de desarrollo local.

### **Prerrequisitos**

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [npm](https://www.npmjs.com/) (generalmente se instala con Node.js)

### **Instalación**

1.  **Clona el repositorio:**

    ```bash
    git clone https://github.com/LadyFantasy/ProyectoPPIV_Front
    cd tu-repo
    ```

2.  **Instala las dependencias del proyecto:**
    ```bash
    npm install
    ```

### **Configuración del Backend**

Este proyecto frontend necesita conectarse a un backend para funcionar. La configuración de la URL del backend se encuentra en el archivo `src/config.js`.

1.  Abre el archivo `src/config.js`.
2.  Modifica la variable `isLocal` según tus necesidades:

    - `isLocal: true` para conectarte a un backend en `http://localhost:5001`.
    - `isLocal: false` para conectarte al backend de producción en Render.

    ```javascript
    const config = {
      isLocal: false, // Cambia a `true` para desarrollo local
      urls: {
        local: "http://localhost:5001",
        remote: "https://proyectoppvi.onrender.com"
      }
      // ...
    };
    ```

### **Ejecutar el Proyecto**

Una vez instaladas las dependencias, puedes iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o en el puerto que Vite asigne si el 5173 está ocupado).

![Vista de Administrar Unidades](src/assets/img%20project/units.png)
![Vista de Multiplicadores de Precios](src/assets/img%20project/multis.png)

---

## 📜 Scripts Disponibles

En el `package.json`, puedes encontrar los siguientes scripts:

- `npm run dev`: Inicia el servidor de desarrollo con Hot-Reload.
- `npm run build`: Compila la aplicación para producción en la carpeta `dist/`.
- `npm run lint`: Ejecuta ESLint para analizar el código en busca de errores y problemas de estilo.
- `npm run preview`: Sirve la carpeta de `build` de producción localmente para previsualizar el resultado final.

---
