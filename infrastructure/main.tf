terraform {
  required_providers {
    acme = {
      source  = "vancluever/acme"
      version = "~> 2.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = ">=3.35.0"
    }
    gandi = {
      source  = "go-gandi/gandi"
      version = "~> 2.0.0"
    }
    github = {
      source  = "integrations/github"
      version = "~> 4.0"
    }
  }
  required_version = ">=1.0"
}
