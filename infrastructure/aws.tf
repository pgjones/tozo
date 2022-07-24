variable "aws_access_key" {
  sensitive = true
}

variable "aws_secret_key" {
  sensitive = true
}

provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = "eu-west-2"
}

variable "db_password" {
  sensitive = true
}

resource "aws_db_instance" "tozo" {
  apply_immediately       = true
  allocated_storage       = 20
  backup_retention_period = 5
  db_subnet_group_name    = aws_db_subnet_group.default.name
  deletion_protection     = true
  engine                  = "postgres"
  engine_version          = "14"
  instance_class          = "db.t3.micro"
  db_name                 = "tozo"
  username                = "tozo"
  password                = var.db_password
  vpc_security_group_ids  = [aws_security_group.database.id]
}
