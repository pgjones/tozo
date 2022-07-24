variable "gandi_api_key" {
  sensitive = true
}

provider "gandi" {
  key = var.gandi_api_key
}

data "gandi_domain" "tozo_dev" {
  name = "tozo.dev"
}

resource "gandi_livedns_record" "tozo_dev_ALIAS" {
  zone   = data.gandi_domain.tozo_dev.id
  name   = "@"
  type   = "ALIAS"
  ttl    = 3600
  values = ["${aws_lb.tozo.dns_name}."]
}

resource "gandi_livedns_record" "tozo_dev_www" {
  zone   = data.gandi_domain.tozo_dev.id
  name   = "www"
  type   = "CNAME"
  ttl    = 3600
  values = ["tozo.dev."]
}
