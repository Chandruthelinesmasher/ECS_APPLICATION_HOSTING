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
}
