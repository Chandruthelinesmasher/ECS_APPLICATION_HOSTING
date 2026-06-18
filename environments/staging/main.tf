module "infra" {
  source = "../../"

  aws_region           = var.aws_region
  environment          = var.environment
  app_name             = var.app_name
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  container_image      = var.container_image
  container_port       = var.container_port
  container_cpu        = var.container_cpu
  container_memory     = var.container_memory
  desired_count        = var.desired_count

  db_name              = var.db_name
  db_username          = var.db_username
  db_instance_class    = var.db_instance_class
  db_allocated_storage = var.db_allocated_storage
  db_multi_az          = var.db_multi_az
  api_secret_key       = var.api_secret_key
}
