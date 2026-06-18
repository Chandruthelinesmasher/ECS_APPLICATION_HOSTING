variable "environment" {
  description = "The environment name (e.g. dev, prod)"
  type        = string
}

variable "app_name" {
  description = "The application name used for resource naming"
  type        = string
}

variable "vpc_id" {
  description = "The ID of the VPC where ALB is deployed"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs for the ALB"
  type        = list(string)
}

variable "container_port" {
  description = "Port the ECS container is listening on"
  type        = number
  default     = 80
}

variable "health_check_path" {
  description = "Destination path for ALB health checks"
  type        = string
  default     = "/"
}
