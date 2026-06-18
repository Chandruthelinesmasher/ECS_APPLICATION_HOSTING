resource "aws_secretsmanager_secret" "app_secrets" {
  name                    = "${var.app_name}-${var.environment}-app-secrets"
  description             = "Application secrets for ${var.app_name} (${var.environment})"
  recovery_window_in_days = 0

  tags = {
    Name        = "${var.app_name}-${var.environment}-app-secrets"
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "app_secrets_val" {
  secret_id = aws_secretsmanager_secret.app_secrets.id
  secret_string = jsonencode({
    DATABASE_URL   = "postgresql://db_user:dummy_password@db_host:5432/db_name"
    API_SECRET_KEY = "super_secret_key_placeholder"
    PORT           = tostring(var.container_port)
  })
}
