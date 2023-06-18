variable "github_token" {
  sensitive = true
}

provider "github" {
  token = var.github_token
}

resource "github_repository" "tozo" {
  name       = "tozo"
  visibility = "public"
  has_issues = true
}

resource "github_actions_secret" "debt_aws_access_key" {
  repository      = github_repository.tozo.name
  secret_name     = "AWS_ACCESS_KEY_ID"
  plaintext_value = aws_iam_access_key.cd_bot.id
}

resource "github_actions_secret" "debt_aws_secret_key" {
  repository      = github_repository.tozo.name
  secret_name     = "AWS_SECRET_ACCESS_KEY"
  plaintext_value = aws_iam_access_key.cd_bot.secret
}

resource "github_actions_secret" "debt_aws_repository_url" {
  repository      = github_repository.tozo.name
  secret_name     = "AWS_REPOSITORY_URL"
  plaintext_value = aws_ecr_repository.tozo.repository_url
}
