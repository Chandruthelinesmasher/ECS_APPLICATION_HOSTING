variable "environment" {
  description = "The environment name"
  type        = string
}

variable "app_name" {
  description = "The application name used for resource naming"
  type        = string
}

variable "vpc_id" {
  description = "The VPC ID"
  type        = string
}

variable "vpc_cidr" {
  description = "The VPC CIDR block (used to allow inbound access from within the VPC)"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for the RDS subnet group"
  type        = list(string)
}

variable "db_name" {
  description = "The name of the PostgreSQL database to create"
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

variable "allocated_storage" {
  description = "Allocated storage in GiB"
  type        = number
  default     = 20
}

variable "engine_version" {
  description = "PostgreSQL engine version"
  type        = string
  default     = "15.7"
}

variable "multi_az" {
  description = "Enable multi-AZ deployment for high availability"
  type        = bool
  default     = false
}
