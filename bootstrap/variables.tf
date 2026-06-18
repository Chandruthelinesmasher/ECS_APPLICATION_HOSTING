variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "The environment name (staging or production)"
  type        = string
}

variable "app_name" {
  description = "The application name used for resource naming"
  type        = string
}
