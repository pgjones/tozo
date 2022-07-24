terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">=3.35.0"
    }
    github = {
      source  = "integrations/github"
      version = "~> 4.0"
    }
  }
  required_version = ">=1.0"
}
