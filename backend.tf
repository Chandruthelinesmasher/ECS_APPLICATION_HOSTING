# Once the bootstrap resources (S3 bucket and DynamoDB table) are created:
# 1. Copy the bucket name output from terraform apply.
# 2. Uncomment the backend "s3" block below, update the bucket name and dynamodb_table.
# 3. Run 'terraform init -migrate-state' to transition local state to the cloud.

# terraform {
#   backend "s3" {
#     bucket         = "INSERT_YOUR_GENERATED_S3_BUCKET_NAME"
#     key            = "terraform.tfstate"
#     region         = "us-east-1"
#     dynamodb_table = "ecs-modular-dev-tf-locks"
#     encrypt        = true
#   }
# }
