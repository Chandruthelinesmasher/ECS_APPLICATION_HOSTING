variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "The environment name (e.g. dev, prod)"
  type        = string
  default     = "dev"
}

variable "app_name" {
  description = "The application name used for resource naming"
  type        = string
  default     = "myapp"
}

# VPC Configuration
variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

# ECS Configuration
variable "container_image" {
  description = "The Docker image to run"
  type        = string
  default     = "nginx:alpine"
}

variable "container_port" {
  description = "Port public traffic is routed to in the container"
  type        = number
  default     = 5000
}

variable "container_cpu" {
  description = "Fargate CPU units (1024 = 1 vCPU)"
  type        = number
  default     = 256
}

variable "container_memory" {
  description = "Fargate memory allocation (in MiB)"
  type        = number
  default     = 512
}

variable "desired_count" {
  description = "Number of ECS tasks to run"
  type        = number
  default     = 2
}

# RDS Configuration
variable "db_name" {
  description = "The name of the PostgreSQL database"
  type        = string
  default     = "appdb"
}

variable "db_username" {
  description = "The master username for the database"
  type        = string
  default     = "appuser"
}

variable "db_instance_class" {
  description = "The RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage for RDS in GiB"
  type        = number
  default     = 20
}

variable "db_multi_az" {
  description = "Enable multi-AZ for RDS high availability"
  type        = bool
  default     = false
}

variable "api_secret_key" {
  description = "The API secret key stored in Secrets Manager"
  type        = string
  sensitive   = true
}
