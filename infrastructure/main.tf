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
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
    github = {
      source  = "integrations/github"
      version = "~> 4.0"
    }
  }
  required_version = ">=1.0"
}
