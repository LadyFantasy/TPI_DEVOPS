# Diagrama del Pipeline DevOps - PPIV

## Pipeline CI/CD Completo

```mermaid
graph TD
    A[Developer Push to main] --> B[GitHub Repository]
    B --> C[GitHub Actions Trigger]

    C --> D[Checkout Code]
    D --> E[Setup Python & Node.js]

    E --> F[Install Dependencies]
    F --> G[Run Backend Tests]
    F --> H[Run Frontend Tests]
    F --> I[Run Linting]

    G --> J{Tests Pass?}
    H --> J
    I --> J

    J -->|Yes| K[Build Docker Images]
    J -->|No| Z[Fail Pipeline]

    K --> L[Push to GitHub Container Registry]
    L --> M[Security Scan]

    M --> N[Deploy to Render Backend]
    M --> O[Deploy to Vercel Frontend]

    N --> P[Health Check Backend]
    O --> Q[Health Check Frontend]

    P --> R{Deploy Success?}
    Q --> R

    R -->|Yes| S[Notify Success]
    R -->|No| T[Notify Failure]

    S --> U[Update Monitoring]
    T --> U

    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#fff3e0
    style K fill:#e8f5e8
    style N fill:#e3f2fd
    style O fill:#f1f8e9
    style S fill:#c8e6c9
    style T fill:#ffcdd2
```

## Arquitectura de Infraestructura

```mermaid
graph TB
    subgraph "GitHub"
        A[Repository]
        B[GitHub Actions]
        C[Container Registry]
    end

    subgraph "Cloud Services"
        D[Render - Backend]
        E[Vercel - Frontend]
        F[MySQL Database]
    end

    subgraph "Monitoring"
        G[Prometheus]
        H[Grafana]
        I[Alert Manager]
    end

    subgraph "Infrastructure"
        J[Terraform]
        K[AWS Resources]
    end

    A --> B
    B --> C
    B --> D
    B --> E

    D --> F
    E --> D

    D --> G
    E --> G
    G --> H
    H --> I

    J --> K
```

## Flujo de Desarrollo

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Git as GitHub
    participant GA as GitHub Actions
    participant Docker as Docker Registry
    participant Render as Render
    participant Vercel as Vercel
    participant Monitor as Monitoring

    Dev->>Git: Push to main
    Git->>GA: Trigger workflow
    GA->>GA: Run tests
    GA->>GA: Build Docker images
    GA->>Docker: Push images
    GA->>Render: Deploy backend
    GA->>Vercel: Deploy frontend
    Render->>Monitor: Health check
    Vercel->>Monitor: Health check
    Monitor->>Dev: Notify status
```

## Stack Tecnológico

```mermaid
graph LR
    subgraph "Frontend"
        A[React]
        B[Vite]
        C[CSS]
    end

    subgraph "Backend"
        D[Python Flask]
        E[MySQL]
        F[JWT Auth]
    end

    subgraph "DevOps"
        G[Docker]
        H[GitHub Actions]
        I[Terraform]
    end

    subgraph "Deploy"
        J[Render]
        K[Vercel]
    end

    subgraph "Monitoring"
        L[Prometheus]
        M[Grafana]
    end

    A --> B
    B --> C
    D --> E
    D --> F
    G --> H
    H --> I
    I --> J
    I --> K
    J --> L
    K --> L
    L --> M
```

## Estados del Pipeline

```mermaid
stateDiagram-v2
    [*] --> Pending
    Pending --> Running: Trigger
    Running --> Testing: Setup Complete
    Testing --> Building: Tests Pass
    Testing --> Failed: Tests Fail
    Building --> Deploying: Build Success
    Building --> Failed: Build Fail
    Deploying --> Success: Deploy Success
    Deploying --> Failed: Deploy Fail
    Success --> [*]
    Failed --> [*]
```

## Métricas de Monitoreo

```mermaid
graph TD
    A[Application Metrics] --> B[CPU Usage]
    A --> C[Memory Usage]
    A --> D[Response Time]
    A --> E[Error Rate]

    B --> F[Grafana Dashboard]
    C --> F
    D --> F
    E --> F

    F --> G[Alert Rules]
    G --> H[Email/Slack Notifications]
```

## Configuración de Webhooks

```mermaid
graph LR
    A[GitHub Push] --> B[GitHub Actions]
    B --> C{Webhooks Configured?}

    C -->|Yes| D[Trigger Render Deploy]
    C -->|Yes| E[Trigger Vercel Deploy]
    C -->|No| F[Auto-Deploy]

    D --> G[Backend Live]
    E --> H[Frontend Live]
    F --> I[Both Live]

    G --> J[Health Check]
    H --> J
    I --> J

    J --> K[Success Notification]
```

Para más detalles sobre la configuración de webhooks, consulta [README-DEPLOY.md](../README-DEPLOY.md).

## Pipeline Exitoso en Producción

### Captura del Pipeline CI/CD Funcionando

![Pipeline CI/CD Exitoso](./images/pipeline%20okay.png)

_Pipeline completo ejecutándose exitosamente en GitHub Actions con todos los jobs en verde._

### Jobs del Pipeline:

1. **✅ Lint** - Verificación de código y estilo
2. **✅ Test Backend** - Pruebas unitarias del backend Python
3. **✅ Test Frontend** - Pruebas automatizadas del frontend React
4. **✅ Build** - Construcción y push de imágenes Docker
5. **✅ Deploy Backend** - Despliegue automático a Render
6. **✅ Deploy Frontend** - Despliegue automático a Vercel

### Estado Actual:

- **Pipeline Status**: ✅ Funcionando
- **Última ejecución**: Exitoso
- **Tiempo promedio**: ~5-7 minutos
- **Tasa de éxito**: 100%

---

_Documentación actualizada: $(date)_
