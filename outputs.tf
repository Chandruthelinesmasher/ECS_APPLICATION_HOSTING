output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.vpc.vpc_id
}

output "alb_dns_name" {
  description = "The public DNS name of the ALB"
  value       = module.alb.alb_dns_name
}

output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value       = module.ecs.ecs_cluster_name
}

output "ecs_service_name" {
  description = "The name of the ECS service"
  value       = module.ecs.ecs_service_name
}

output "secrets_manager_secret_arn" {
  description = "The ARN of the Secrets Manager secret"
  value       = aws_secretsmanager_secret.app_secrets.arn
}

output "db_endpoint" {
  description = "The RDS instance endpoint"
  value       = module.rds.db_endpoint
}
