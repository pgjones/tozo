provider "acme" {
  server_url = "https://acme-v02.api.letsencrypt.org/directory"
}

resource "tls_private_key" "private_key" {
  algorithm = "RSA"
}

resource "acme_registration" "me" {
  account_key_pem = tls_private_key.private_key.private_key_pem
  email_address   = "pgjones@tozo.dev"
}

resource "acme_certificate" "tozo_dev" {
  account_key_pem = acme_registration.me.account_key_pem
  common_name     = "tozo.dev"

  dns_challenge {
    provider = "gandiv5"

    config = {
      GANDIV5_API_KEY = var.gandi_api_key
    }
  }
}

resource "aws_acm_certificate" "tozo_dev" {
  private_key       = acme_certificate.tozo_dev.private_key_pem
  certificate_body  = acme_certificate.tozo_dev.certificate_pem
  certificate_chain = "${acme_certificate.tozo_dev.certificate_pem}${acme_certificate.tozo_dev.issuer_pem}"

  lifecycle {
    create_before_destroy = true
  }
}
