# Criar uma instância EC2 na sub-rede existente
resource "aws_instance" "example" {
  ami             = var.ami_id
  instance_type   = var.instance_type
  subnet_id       = data.aws_subnet.existing_subnet.id         # Usando a sub-rede existente
  security_groups = [data.aws_security_group.existing_sg.name] # Usando o security group existente

  tags = {
    Name = "example-instance"
  }
}

# Criar um Elastic IP para a instância EC2
resource "aws_eip" "example" {
  instance = aws_instance.example.id

}

# Associar o Elastic IP à instância EC2
resource "aws_eip_association" "example" {
  instance_id   = aws_instance.example.id
  allocation_id = aws_eip.example.id
}

# Criar um bucket S3 para armazenamento de arquivos
resource "aws_s3_bucket" "example_bucket" {
  bucket = var.bucket_name # Nome do bucket (deve ser único globalmente)     # Controle de acesso: private, public-read, etc.
  tags = {
    Name = "example-bucket"
  }
}

# Configurar a política de acesso ao bucket S3 (opcional)
resource "aws_s3_bucket_policy" "example_bucket_policy" {
  bucket = aws_s3_bucket.example_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.example_bucket.arn}/*"
      }
    ]
  })
}
