variable "environment" {
  description = "The environment name (e.g. dev, prod)"
  type        = string
}

variable "app_name" {
  description = "The application name used for resource naming"
  type        = string
}

variable "vpc_id" {
  description = "The ID of the VPC where ECS is deployed"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for the ECS service"
  type        = list(string)
}

variable "alb_security_group_id" {
  description = "The security group ID of the ALB to allow inbound traffic from"
  type        = string
}

variable "target_group_arn" {
  description = "The ARN of the ALB target group"
  type        = string
}

variable "ecs_task_execution_role_arn" {
  description = "The ARN of the ECS task execution role"
  type        = string
}

variable "ecs_task_role_arn" {
  description = "The ARN of the ECS task role"
  type        = string
}

variable "container_image" {
  description = "The Docker image to run"
  type        = string
  default     = "nginx:alpine"
}

variable "container_port" {
  description = "Port public traffic is routed to in the container"
  type        = number
  default     = 80
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

variable "secrets_arn" {
  description = "ARN of the Secrets Manager secret containing environment variables"
  type        = string
  default     = ""
}
