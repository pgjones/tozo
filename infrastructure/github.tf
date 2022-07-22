variable "github_token" {
  sensitive = true
}

provider "github" {
  token = var.github_token
}

resource "github_repository" "tozo" {
  name       = "tozo"
  visibility = "public"
}
