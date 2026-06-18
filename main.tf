data "aws_availability_zones" "available" {
  state = "available"
}

module "vpc" {
  source               = "./modules/vpc"
  environment          = var.environment
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  availability_zones   = slice(data.aws_availability_zones.available.names, 0, length(var.public_subnet_cidrs))
}

module "iam" {
  source      = "./modules/iam"
  environment = var.environment
  app_name    = var.app_name
  secret_arns = [aws_secretsmanager_secret.app_secrets.arn]
}

module "alb" {
  source            = "./modules/alb"
  environment       = var.environment
  app_name          = var.app_name
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
  container_port    = var.container_port
}

module "rds" {
  source             = "./modules/rds"
  environment        = var.environment
  app_name           = var.app_name
  vpc_id             = module.vpc.vpc_id
  vpc_cidr           = var.vpc_cidr
  private_subnet_ids = module.vpc.private_subnet_ids
  db_name            = var.db_name
  db_username        = var.db_username
  db_instance_class  = var.db_instance_class
  allocated_storage  = var.db_allocated_storage
  multi_az           = var.db_multi_az
}

module "ecs" {
  source                      = "./modules/ecs"
  environment                 = var.environment
  app_name                    = var.app_name
  vpc_id                      = module.vpc.vpc_id
  private_subnet_ids          = module.vpc.private_subnet_ids
  alb_security_group_id       = module.alb.alb_security_group_id
  target_group_arn            = module.alb.target_group_arn
  ecs_task_execution_role_arn = module.iam.ecs_task_execution_role_arn
  ecs_task_role_arn           = module.iam.ecs_task_role_arn
  container_image             = var.container_image
  container_port              = var.container_port
  container_cpu               = var.container_cpu
  container_memory            = var.container_memory
  desired_count               = var.desired_count
  secrets_arn                 = aws_secretsmanager_secret.app_secrets.arn

  # Ensures ECS tasks start only after the real DB URL is written to Secrets Manager
  depends_on = [aws_secretsmanager_secret_version.app_secrets_val]
}
