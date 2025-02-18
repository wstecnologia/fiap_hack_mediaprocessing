# Acessar a VPC existente
data "aws_vpc" "selected" {
  id = "vpc-0f4ca59045ade1eb8" # ID da VPC principal
}

# Acessar a sub-rede existente pelo ID
data "aws_subnet" "existing_subnet" {
  id = "subnet-082bdd184a2ac6160" # ID da sub-rede existente
}

# Acessar o security group existente
data "aws_security_group" "existing_sg" {
  filter {
    name   = "group-name"
    values = ["nome-do-seu-security-group"] # Substitua pelo nome do seu security group
  }
}
