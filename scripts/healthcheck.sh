#!/usr/bin/env bash
set -euo pipefail

URL="${1:-http://localhost:8080}"

echo "Checking application health: $URL"

if ! command -v curl >/dev/null 2>&1; then
    echo "ERROR: curl is not installed or unavailable."
    exit 1
fi

if HTTP_STATUS=$(curl --silent --show-error \
    --output /dev/null \
    --write-out '%{http_code}' \
    --max-time 10 \
    "$URL"); then

    if [[ "$HTTP_STATUS" == "200" ]]; then
        echo "SUCCESS: Application is healthy (HTTP $HTTP_STATUS)."
        exit 0
    else
        echo "ERROR: Application returned HTTP $HTTP_STATUS; expected HTTP 200."
        exit 1
    fi
else
    echo "ERROR: Could not connect to $URL."
    exit 1
fi
