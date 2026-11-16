# Loki, Promtail and Grafana Monitoring Setup

## 1. Overview

This project uses Grafana Loki, Promtail and Grafana to collect, store and inspect NGINX access logs from the application deployed by HashiCorp Nomad.

### Monitoring architecture

1. Nomad runs the NGINX application in a Docker container.
2. NGINX writes access logs to the Nomad allocation log.
3. A copy of the allocation log is made available in `monitoring/nomad-logs/`.
4. Promtail reads the log file, extracts HTTP request information and sends log entries to Loki.
5. Grafana queries Loki and displays the collected logs.

## 2. Components and versions

| Component | Image / version | Purpose |
|---|---|---|
| Loki | grafana/loki:3.5.7 | Log storage and querying |
| Promtail | grafana/promtail:3.5.7 | Log collection and processing |
| Grafana | grafana/grafana:12.2.1 | Log visualization |

The monitoring stack runs through Docker Compose.

## 3. Prerequisites

- Docker Desktop with its WSL2 integration enabled.
- Ubuntu WSL2.
- A running Nomad and Consul development environment.
- The application deployed through Nomad.
- The Nomad allocation log copied into `monitoring/nomad-logs/nginx.stdout.0`.

Run commands in PowerShell from the repository root unless otherwise stated.

## 4. Start the monitoring stack

Validate the Compose configuration:

```powershell
docker compose -f .\monitoring\docker-compose.yaml config --quiet
```

Start Loki, Promtail and Grafana:

```powershell
docker compose -f .\monitoring\docker-compose.yaml up -d
```

Check container status:

```powershell
docker compose -f .\monitoring\docker-compose.yaml ps
```

View service logs when troubleshooting:

```powershell
docker compose -f .\monitoring\docker-compose.yaml logs loki
docker compose -f .\monitoring\docker-compose.yaml logs promtail
docker compose -f .\monitoring\docker-compose.yaml logs grafana
```

## 5. Verify Loki and Promtail

Loki exposes its HTTP API on port 3100.

Check readiness:

```powershell
curl.exe -i http://localhost:3100/ready
```

List labels received by Loki:

```powershell
curl.exe -s http://localhost:3100/loki/api/v1/labels
```

The observed labels included:

- `job`
- `container`
- `filename`
- `method`
- `status`
- `nomad_alloc_id`

The `method` and `status` labels are extracted from NGINX access log entries by Promtail's regular-expression pipeline.

## 6. LogQL queries

Open Grafana at:

http://localhost:3000

Configure the Loki data source with:

- Data source type: Loki
- URL: `http://loki:3100`

Save and test the data source.

Open **Explore**, select Loki, and run these queries.

### All application logs

```logql
{job="nomad-nginx"}
```

### Successful HTTP responses

```logql
{job="nomad-nginx", status="200"}
```

### Not-found HTTP responses

```logql
{job="nomad-nginx", status="404"}
```

### Filter requests by method

```logql
{job="nomad-nginx", method="GET"}
```

## 7. Verification results

The test requests were made against the Nomad-deployed NGINX application.

| Request | Expected result | Observed result |
|---|---:|---:|
| GET `/` | HTTP 200 | HTTP 200 |
| GET `/this-page-does-not-exist` | HTTP 404 | HTTP 404 |

The Loki query `{job="nomad-nginx"}` returned seven log entries:

- Four HTTP 200 responses.
- Three HTTP 404 responses.

The query `{job="nomad-nginx", status="404"}` returned the three expected not-found entries.

Grafana Explore was used to confirm that the HTTP 404 entries could be filtered and inspected.

## 8. WSL2 log collection limitation

During implementation, the Nomad allocation log was available inside the Ubuntu WSL2 filesystem, but the Docker Desktop monitoring containers could not directly access the relevant WSL `/tmp` path through the attempted bind mount.

The workaround was to copy the allocation log into the project directory:

`monitoring/nomad-logs/nginx.stdout.0`

Promtail then reads this project-shared file through a read-only bind mount.

**Important limitation:** This is a log snapshot, not a continuous live stream from the Nomad allocation. Requests made after the snapshot was copied will not automatically appear in Loki. To collect newer entries, refresh the copied file from the current Nomad allocation log and restart Promtail as appropriate.

This approach demonstrates log parsing, labeling, ingestion, storage and querying, while retaining the WSL2 filesystem limitation as a documented improvement area.

## 9. Screenshots

The repository includes the following implementation evidence:

- `docs/screenshots/docker-compose-recreate-and-nginx-log-inspection.png`
- `docs/screenshots/grafana-404-logs.png`

The Grafana screenshot demonstrates the HTTP 404 LogQL filter and returned log entries.

## 10. Security and operational notes

The Compose configuration uses a local demonstration Grafana administrator credential. It is intended only for local development and must be replaced with a securely managed secret before deployment in a shared or production environment.

The monitoring stack uses local Docker volumes for Loki data, Promtail positions and Grafana data.

Stop the monitoring stack with:

```powershell
docker compose -f .\monitoring\docker-compose.yaml down
```

This command preserves named volumes. To remove the stored monitoring data as well, use `down -v` only when that data is no longer needed.