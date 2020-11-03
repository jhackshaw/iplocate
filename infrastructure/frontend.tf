resource "aws_s3_bucket" "frontend" {
  bucket = var.frontend_bucket
  acl    = "public-read"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadAccessForS3Bucket",
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${var.frontend_bucket}/*"
    }
  ]
}
EOF

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  tags = {
    Project = var.project
  }
}
