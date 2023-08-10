terraform {
  required_providers {
    acme = {
      source = "vancluever/acme"
    }
    aws = {
      source = "hashicorp/aws"
    }
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
    github = {
      source = "integrations/github"
    }
  }
  required_version = ">=1.0"
}
