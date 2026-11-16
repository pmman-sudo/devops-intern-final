#!/usr/bin/env bash
set -euo pipefail

echo "======================================"
echo "         SYSTEM INFORMATION"
echo "======================================"

echo
echo "Current User:"
id -un

echo "Effective UID:"
id -u

echo
echo "Hostname:"
hostname

echo "Kernel Information:"
uname -srmo

echo
echo "Current Date (ISO 8601):"
date -Is

echo
echo "Disk Usage:"
df -h /

echo
echo "Memory Usage:"
free -h

echo
echo "Docker Daemon Status:"
if command -v docker >/dev/null 2>&1; then
    if docker info --format '{{.ServerVersion}}' >/dev/null 2>&1; then
        echo "Docker daemon is running."
        docker info --format 'Docker Server Version: {{.ServerVersion}}'
    else
        echo "Docker CLI is installed, but the daemon is unavailable."
    fi
else
    echo "Docker CLI is not installed."
fi

echo
echo "======================================"
echo "       SYSTEM CHECK COMPLETED"
echo "======================================"
