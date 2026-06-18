output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.infra.vpc_id
}

output "alb_dns_name" {
  description = "The public DNS name of the ALB"
  value       = module.infra.alb_dns_name
}

output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value       = module.infra.ecs_cluster_name
}

output "ecs_service_name" {
  description = "The name of the ECS service"
  value       = module.infra.ecs_service_name
}

output "secrets_manager_secret_arn" {
  description = "The ARN of the Secrets Manager secret"
  value       = module.infra.secrets_manager_secret_arn
}
