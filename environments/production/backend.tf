# Once the production bootstrap resources are created:
# 1. Uncomment the backend "s3" block.
# 2. Insert the actual S3 bucket name created for production.
# 3. Run 'terraform init -migrate-state'.

# terraform {
#   backend "s3" {
#     bucket         = "INSERT_PRODUCTION_TF_STATE_BUCKET_NAME"
#     key            = "production/terraform.tfstate"
#     region         = "us-east-1"
#     dynamodb_table = "ecs-modular-production-tf-locks"
#     encrypt        = true
#   }
# }
