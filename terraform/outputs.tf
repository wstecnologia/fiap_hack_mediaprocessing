output "vpc_id" {
  value = data.aws_vpc.selected.id
}

output "subnet_id" {
  value = data.aws_subnet.existing_subnet.id
}

output "instance_public_ip" {
  value = aws_eip.example.public_ip
}

output "s3_bucket_name" {
  value = aws_s3_bucket.example_bucket.bucket
}

output "s3_bucket_arn" {
  value = aws_s3_bucket.example_bucket.arn
}
