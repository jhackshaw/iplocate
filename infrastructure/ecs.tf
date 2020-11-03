resource "aws_ssm_parameter" "geoip_account_id" {
  name      = var.ssm_geoip_account_id
  value     = var.geoip_account_id
  type      = "SecureString"
  overwrite = true
}
resource "aws_ssm_parameter" "geoip_license_key" {
  name      = var.ssm_geoip_license_key
  value     = var.geoip_license_key
  type      = "SecureString"
  overwrite = true
}

resource "aws_ecs_cluster" "iplocate_worker_cluster" {
  name               = "iplocate_worker"
  capacity_providers = ["FARGATE"]

  tags = {
    Project = var.project
  }
}

resource "aws_ecs_task_definition" "iplocate_updater_task" {
  family                = "iplocate_updater_task"
  container_definitions = <<EOF
    [
      {
        "name": "iplocate_update",
        "image": "maxmindinc/geoipupdate",
        "essential": false,
        "logConfiguration": {
          "logDriver": "awslogs",
          "options": {
            "awslogs-group": "${var.worker_log_group}",
            "awslogs-region": "${var.aws_region}",
            "awslogs-stream-prefix": "geoip-updater"
          }
        },
        "environment": [
          {
            "name": "GEOIPUPDATE_EDITION_IDS",
            "value": "${var.geoip_edition_ids}"
          },
          {
            "name": "GEOIPUPDATE_VERBOSE",
            "value": "true"
          }
        ],
        "secrets": [
          {
            "name": "GEOIPUPDATE_ACCOUNT_ID",
            "valueFrom": "${aws_ssm_parameter.geoip_account_id.arn}"
          },
          {
            "name": "GEOIPUPDATE_LICENSE_KEY",
            "valueFrom": "${aws_ssm_parameter.geoip_license_key.arn}"
          }
        ],
        "mountPoints": [
          {
            "containerPath": "/usr/share/GeoIP",
            "sourceVolume": "geoip-data"
          }
        ]
      }
    ]
    EOF

  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  task_role_arn            = aws_iam_role.iplocate_worker_task_role.arn
  execution_role_arn       = aws_iam_role.iplocate_worker_task_exec_role.arn

  volume {
    name = "geoip-data"

    efs_volume_configuration {
      file_system_id     = aws_efs_file_system.iplocate_fs.id
      root_directory     = "/"
      transit_encryption = "ENABLED"

      authorization_config {
        access_point_id = aws_efs_access_point.iplocate_fs_ap.id
        iam             = "DISABLED"
      }
    }
  }

  tags = {
    Project = var.project
  }
}

resource "aws_cloudwatch_event_rule" "iplocate_update_sched" {
  name                = "iplocate_db_update_schedule"
  description         = "Schedule update of iplocate db"
  schedule_expression = var.geoip_update_freq

  tags = {
    Project = var.project
  }
}

resource "aws_cloudwatch_event_target" "iplocate_scheduled_task" {
  arn      = aws_ecs_cluster.iplocate_worker_cluster.arn
  rule     = aws_cloudwatch_event_rule.iplocate_update_sched.name
  role_arn = aws_iam_role.iplocate_worker_task_exec_role.arn

  ecs_target {
    task_count          = 1
    task_definition_arn = aws_ecs_task_definition.iplocate_updater_task.arn
    launch_type         = "FARGATE"
    platform_version    = "1.4.0"

    network_configuration {
      subnets          = [aws_subnet.iplocate_private_net.id]
      security_groups  = [aws_security_group.iplocate_sg.id]
      assign_public_ip = false
    }
  }
}

resource "aws_cloudwatch_log_group" "iplocate_worker_logs" {
  name = var.worker_log_group
  tags = {
    Project = var.project
  }
}
