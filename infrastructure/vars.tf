variable aws_region {
  type    = string
  default = "us-east-1"
}

variable state_bucket {
  type = string
}

variable state_bucket_key {
  type    = string
  default = "/tfstate"
}

variable frontend_bucket {
  type    = string
  default = "iplocate-frontend"
}

# all ssm params must start with the /<project>
variable project {
  type    = string
  default = "iplocate"
}

variable ssm_private_subnet_id {
  type    = string
  default = "/iplocate/subnet_id"
}

variable ssm_security_group_id {
  type    = string
  default = "/iplocate/security_group_id"
}

variable ssm_geoip_license_key {
  type    = string
  default = "/iplocate/geoip_license_key"
}

variable ssm_geoip_account_id {
  type    = string
  default = "/iplocate/geoip_account_id"
}

variable geoip_account_id {
  type = string
}

variable geoip_license_key {
  type = string
}

variable worker_log_group {
  type    = string
  default = "iplocate_worker_logs"
}

variable geoip_edition_ids {
  type    = string
  default = "GeoLite2-City"
}

variable geoip_update_freq {
  type    = string
  default = "rate(5 days)"
}

