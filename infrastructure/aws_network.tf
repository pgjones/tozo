resource "aws_vpc" "vpc" {
  cidr_block         = "10.0.0.0/16"
  enable_dns_support = true
}

data "aws_availability_zones" "available" {}

resource "aws_subnet" "public" {
  availability_zone = data.aws_availability_zones.available.names[count.index]
  cidr_block        = "10.0.0.${64 * count.index}/26"
  count             = min(4, length(data.aws_availability_zones.available.names))
  vpc_id            = aws_vpc.vpc.id
}

resource "aws_subnet" "private" {
  availability_zone = data.aws_availability_zones.available.names[count.index]
  cidr_block        = "10.0.1.${64 * count.index}/26"
  count             = min(4, length(data.aws_availability_zones.available.names))
  vpc_id            = aws_vpc.vpc.id
}

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.vpc.id
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
  }
}

resource "aws_route_table_association" "public_gateway" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "lb" {
  vpc_id = aws_vpc.vpc.id

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol    = "tcp"
    from_port   = 443
    to_port     = 443
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb" "tozo" {
  name               = "alb"
  subnets            = aws_subnet.public.*.id
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb.id]
}

resource "aws_lb_target_group" "tozo" {
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.vpc.id
  target_type = "ip"

  health_check {
    path = "/control/ping/"
  }

  lifecycle {
    create_before_destroy = true
  }

  stickiness {
    enabled = true
    type    = "lb_cookie"
  }
}

resource "aws_db_subnet_group" "default" {
  subnet_ids = aws_subnet.private.*.id
}

resource "aws_security_group" "database" {
  vpc_id = aws_vpc.vpc.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "TCP"
    cidr_blocks = aws_subnet.public.*.cidr_block
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = aws_subnet.public.*.cidr_block
  }
}
