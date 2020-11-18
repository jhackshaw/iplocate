terraform {
  backend "s3" {
    bucket = "iplocate-terraform-state"
    key    = "tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}


data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_vpc" "iplocate_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Project = var.project
    Name    = var.project
  }
}


resource "aws_subnet" "iplocate_public_net" {
  availability_zone = data.aws_availability_zones.available.names[0]
  vpc_id            = aws_vpc.iplocate_vpc.id
  cidr_block        = "10.0.1.0/24"

  tags = {
    Project = var.project
  }
}

resource "aws_subnet" "iplocate_private_net" {
  availability_zone = data.aws_availability_zones.available.names[0]
  vpc_id            = aws_vpc.iplocate_vpc.id
  cidr_block        = "10.0.2.0/24"
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.iplocate_vpc.id

  tags = {
    Project = var.project
  }
}

# resource "aws_eip" "nat_eip" {
#   tags = {
#     Project = var.project
#   }
# }

# resource "aws_nat_gateway" "natgw" {
#   allocation_id = aws_eip.nat_eip.id
#   subnet_id     = aws_subnet.iplocate_public_net.id

#   tags = {
#     Project = var.project
#   }
# }


# Using a nat instance over a nat gateway for cost
data "aws_ami" "aws_nat_ami" {
  most_recent = true

  filter {
    name   = "name"
    values = ["amzn-ami-vpc-nat-2018.03*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["137112412989"]
}

resource "aws_instance" "nat_instance" {
  ami                         = data.aws_ami.aws_nat_ami.id
  instance_type               = "t3.micro"
  source_dest_check           = false
  associate_public_ip_address = true
  subnet_id                   = aws_subnet.iplocate_public_net.id
  vpc_security_group_ids      = [aws_security_group.iplocate_sg.id]


  tags = {
    Project = var.project
  }
}

resource "aws_route_table" "iplocate_public_rt" {
  vpc_id = aws_vpc.iplocate_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Project = var.project
  }
}

resource "aws_route_table" "iplocate_private_rt" {
  vpc_id = aws_vpc.iplocate_vpc.id

  route {
    cidr_block  = "0.0.0.0/0"
    instance_id = aws_instance.nat_instance.id
  }

  tags = {
    Project = var.project
  }
}

resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.iplocate_public_net.id
  route_table_id = aws_route_table.iplocate_public_rt.id
}

resource "aws_route_table_association" "private_assoc" {
  subnet_id      = aws_subnet.iplocate_private_net.id
  route_table_id = aws_route_table.iplocate_private_rt.id
}

resource "aws_security_group" "iplocate_sg" {
  name        = "iplocate-sg"
  description = "All VPC Internal Traffic"
  vpc_id      = aws_vpc.iplocate_vpc.id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Project = var.project
  }
}

resource "aws_ssm_parameter" "iplocate_sg_id" {
  name  = var.ssm_security_group_id
  type  = "String"
  value = aws_security_group.iplocate_sg.id
}

resource "aws_ssm_parameter" "iplocate_private_subnet" {
  name  = var.ssm_private_subnet_id
  type  = "String"
  value = aws_subnet.iplocate_private_net.id
}
