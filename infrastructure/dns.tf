variable "cloudflare_api_token" {
  sensitive = true
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

data "cloudflare_zone" "tozo_dev" {
  name = "tozo.dev"
}

resource "cloudflare_record" "tozo_dev_A" {
  zone_id = data.cloudflare_zone.tozo_dev.id
  name    = "@"
  value   = aws_lb.tozo.dns_name
  type    = "CNAME"
  ttl     = 3600
}

resource "cloudflare_record" "tozo_dev_www" {
  zone_id = data.cloudflare_zone.tozo_dev.id
  name    = "www"
  value   = "tozo.dev"
  type    = "CNAME"
  ttl     = 3600
}
