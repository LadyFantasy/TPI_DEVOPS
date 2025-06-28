# Configuración de Terraform para PPIV
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "ppiv-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}

# Configuración del proveedor AWS
provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "PPIV"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# VPC y Networking
module "vpc" {
  source = "./modules/vpc"
  
  environment = var.environment
  vpc_cidr    = var.vpc_cidr
  azs         = var.availability_zones
}

# ECS Cluster
module "ecs" {
  source = "./modules/ecs"
  
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
  public_subnets  = module.vpc.public_subnets
}

# RDS Database
module "rds" {
  source = "./modules/rds"
  
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
  db_name         = var.db_name
  db_username     = var.db_username
  db_password     = var.db_password
}

# Application Load Balancer
module "alb" {
  source = "./modules/alb"
  
  environment    = var.environment
  vpc_id         = module.vpc.vpc_id
  public_subnets = module.vpc.public_subnets
}

# ECS Services
module "backend_service" {
  source = "./modules/ecs-service"
  
  name           = "ppiv-backend"
  environment    = var.environment
  cluster_id     = module.ecs.cluster_id
  task_definition = module.ecs.backend_task_definition_arn
  target_group_arn = module.alb.backend_target_group_arn
  container_port = 5000
  
  depends_on = [module.ecs, module.alb]
}

module "frontend_service" {
  source = "./modules/ecs-service"
  
  name           = "ppiv-frontend"
  environment    = var.environment
  cluster_id     = module.ecs.cluster_id
  task_definition = module.ecs.frontend_task_definition_arn
  target_group_arn = module.alb.frontend_target_group_arn
  container_port = 80
  
  depends_on = [module.ecs, module.alb]
}

# CloudWatch Logs
module "cloudwatch" {
  source = "./modules/cloudwatch"
  
  environment = var.environment
  log_groups = [
    "/ecs/ppiv-backend",
    "/ecs/ppiv-frontend"
  ]
}

# Outputs
output "alb_dns_name" {
  description = "DNS name of the load balancer"
  value       = module.alb.alb_dns_name
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = module.rds.rds_endpoint
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = module.ecs.cluster_name
} 