variable "instance_type" {
  description = "Tipo da instância EC2"
  default     = "t2.micro"
}

variable "ami_id" {
  description = "ID do AMI para a instância EC2"
  default     = "ami-0c02fb55956c7d316" # Substitua pelo AMI desejado
}

variable "bucket_name" {
  description = "Nome do bucket S3 (deve ser único globalmente)"
  default     = "meu-bucket-exemplo-12345" # Substitua por um nome único
}
