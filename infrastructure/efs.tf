resource "aws_efs_file_system" "iplocate_fs" {
  tags = {
    Project = var.project
  }
}

resource "aws_efs_access_point" "iplocate_fs_ap" {
  file_system_id = aws_efs_file_system.iplocate_fs.id

  posix_user {
    gid = 1001
    uid = 1001
  }

  root_directory {
    path = "/geoip-data"
    creation_info {
      owner_gid   = 1001
      owner_uid   = 1001
      permissions = "755"
    }
  }

  tags = {
    Project = var.project
  }
}

resource "aws_efs_mount_target" "iplocate_fs_mount" {
  file_system_id = aws_efs_file_system.iplocate_fs.id
  subnet_id      = aws_subnet.iplocate_private_net.id

  security_groups = [aws_security_group.iplocate_sg.id]
}

resource "aws_ssm_parameter" "iplocate_fs_ap_arn" {
  name  = "/iplocate/fs_access_point"
  type  = "String"
  value = aws_efs_access_point.iplocate_fs_ap.arn
}
