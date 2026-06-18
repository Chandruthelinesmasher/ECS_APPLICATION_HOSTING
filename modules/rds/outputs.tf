output "db_endpoint" {
  description = "The RDS instance endpoint (host:port)"
  value       = aws_db_instance.main.endpoint
}

output "db_address" {
  description = "The RDS hostname without port"
  value       = aws_db_instance.main.address
}

output "db_port" {
  description = "The RDS port"
  value       = aws_db_instance.main.port
}

output "db_name" {
  description = "The database name"
  value       = aws_db_instance.main.db_name
}

output "connection_url" {
  description = "Full PostgreSQL connection URL (sensitive)"
  value       = "postgresql://${var.db_username}:${random_password.db_password.result}@${aws_db_instance.main.address}:${aws_db_instance.main.port}/${var.db_name}"
  sensitive   = true
}
