variable "image_repository" {
  type    = string
  default = "devops-intern-final"
}

variable "image_tag" {
  type    = string
  default = "v1.0.0"
}

job "nginx-app" {
  datacenters = ["dc1"]
  type        = "service"

  update {
    max_parallel      = 1
    min_healthy_time  = "10s"
    healthy_deadline  = "2m"
    auto_revert       = true
  }

  group "nginx" {
    count = 1
    shutdown_delay = "5s"

    network {
      port "http" {
        to = 8080
      }
    }

    service {
      name     = "nginx-app"
      provider = "consul"
      port     = "http"

      check {
        name     = "http-health"
        type     = "http"
        path     = "/healthz"
        interval = "10s"
        timeout  = "2s"
      }
    }

    restart {
      attempts = 2
      interval = "30m"
      delay    = "15s"
      mode     = "fail"
    }

    reschedule {
      attempts       = 3
      interval       = "1h"
      delay          = "30s"
      delay_function = "exponential"
      max_delay      = "5m"
      unlimited      = false
    }

    task "nginx" {
      driver = "docker"

      config {
        image = "${var.image_repository}:${var.image_tag}"
        ports = ["http"]
      }

      resources {
        cpu    = 100
        memory = 64
      }
    }
  }
}