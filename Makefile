# Makefile para PPIV - Sistema de Gestión de Propiedades

.PHONY: help build up down restart logs clean dev prod test

# Variables
COMPOSE_PROD = docker-compose
COMPOSE_DEV = docker-compose -f docker-compose.dev.yml

# Comando por defecto
help:
	@echo "🐳 PPIV - Comandos disponibles:"
	@echo ""
	@echo "📦 Producción:"
	@echo "  make build    - Construir imágenes Docker"
	@echo "  make up       - Levantar servicios de producción"
	@echo "  make down     - Detener servicios"
	@echo "  make restart  - Reiniciar servicios"
	@echo "  make logs     - Ver logs en tiempo real"
	@echo ""
	@echo "🔧 Desarrollo:"
	@echo "  make dev      - Levantar entorno de desarrollo"
	@echo "  make dev-down - Detener entorno de desarrollo"
	@echo "  make dev-logs - Ver logs de desarrollo"
	@echo ""
	@echo "🧪 Testing:"
	@echo "  make test     - Ejecutar tests"
	@echo "  make test-cov - Ejecutar tests con cobertura"
	@echo ""
	@echo "🧹 Limpieza:"
	@echo "  make clean    - Limpiar recursos Docker"
	@echo "  make clean-all- Limpiar todo (incluyendo volúmenes)"

# Producción
build:
	@echo "🔨 Construyendo imágenes Docker..."
	$(COMPOSE_PROD) build

up:
	@echo "📦 Levantando servicios de producción..."
	$(COMPOSE_PROD) up -d

down:
	@echo "🛑 Deteniendo servicios..."
	$(COMPOSE_PROD) down

restart:
	@echo "🔄 Reiniciando servicios..."
	$(COMPOSE_PROD) restart

logs:
	@echo "📋 Mostrando logs en tiempo real..."
	$(COMPOSE_PROD) logs -f

# Desarrollo
dev:
	@echo "🚀 Iniciando entorno de desarrollo..."
	$(COMPOSE_DEV) up -d

dev-down:
	@echo "🛑 Deteniendo entorno de desarrollo..."
	$(COMPOSE_DEV) down

dev-logs:
	@echo "📋 Mostrando logs de desarrollo..."
	$(COMPOSE_DEV) logs -f

# Testing
test:
	@echo "🧪 Ejecutando tests..."
	$(COMPOSE_DEV) exec backend pytest

test-cov:
	@echo "🧪 Ejecutando tests con cobertura..."
	$(COMPOSE_DEV) exec backend pytest --cov=app --cov-report=html

# Limpieza
clean:
	@echo "🧹 Limpiando recursos Docker..."
	docker system prune -f

clean-all:
	@echo "🧹 Limpiando todo (incluyendo volúmenes)..."
	$(COMPOSE_PROD) down -v
	$(COMPOSE_DEV) down -v
	docker system prune -af --volumes

# Utilidades
status:
	@echo "📊 Estado de los servicios:"
	$(COMPOSE_PROD) ps

dev-status:
	@echo "📊 Estado de los servicios de desarrollo:"
	$(COMPOSE_DEV) ps

shell-backend:
	@echo "🐚 Abriendo shell del backend..."
	$(COMPOSE_DEV) exec backend bash

shell-frontend:
	@echo "🐚 Abriendo shell del frontend..."
	$(COMPOSE_DEV) exec frontend sh

shell-mysql:
	@echo "🐚 Abriendo shell de MySQL..."
	$(COMPOSE_DEV) exec mysql mysql -u root -p

# Inicialización
init:
	@echo "🚀 Inicializando PPIV..."
	@if [ ! -f .env ]; then \
		echo "📝 Copiando archivo de variables de entorno..."; \
		cp env.example .env; \
		echo "⚠️  Por favor edita el archivo .env con tus configuraciones"; \
	fi
	@echo "✅ Inicialización completada" 