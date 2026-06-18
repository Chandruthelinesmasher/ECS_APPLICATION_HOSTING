variable "environment" {
  description = "The environment name (e.g. dev, prod)"
  type        = string
}

variable "app_name" {
  description = "The application name used for resource naming"
  type        = string
}

variable "secret_arns" {
  description = "List of Secrets Manager ARNs to grant access to"
  type        = list(string)
  default     = []
}
