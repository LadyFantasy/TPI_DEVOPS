# Variables para la configuración de Terraform

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "ppiv_db"
}

variable "db_username" {
  description = "Database username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "app_image_backend" {
  description = "Backend Docker image"
  type        = string
  default     = "ghcr.io/your-username/ppiv-backend:latest"
}

variable "app_image_frontend" {
  description = "Frontend Docker image"
  type        = string
  default     = "ghcr.io/your-username/ppiv-frontend:latest"
}

variable "app_count" {
  description = "Number of application instances"
  type        = number
  default     = 2
}

variable "health_check_path" {
  description = "Health check path for the default target group"
  type        = string
  default     = "/health"
}

variable "certificate_arn" {
  description = "ARN of the SSL certificate"
  type        = string
  default     = ""
} 