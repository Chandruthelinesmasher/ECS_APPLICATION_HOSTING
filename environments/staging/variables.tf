variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "The environment name"
  type        = string
  default     = "staging"
}

variable "app_name" {
  description = "The application name used for resource naming"
  type        = string
  default     = "ecs-modular"
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  type        = string
  default     = "10.10.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.10.1.0/24", "10.10.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.10.10.0/24", "10.10.11.0/24"]
}

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
  description = "Fargate CPU units"
  type        = number
  default     = 256
}

variable "container_memory" {
  description = "Fargate memory allocation"
  type        = number
  default     = 512
}

variable "desired_count" {
  description = "Number of ECS tasks to run"
  type        = number
  default     = 1
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
  description = "Enable multi-AZ for RDS"
  type        = bool
  default     = false
}

variable "api_secret_key" {
  description = "The API secret key (set via TF_VAR_api_secret_key in CI)"
  type        = string
  sensitive   = true
}
