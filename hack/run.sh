#!/usr/bin/env bash

set -euo pipefail

docker run \
    -p 3000:3000 \
    --name doug-translate \
    --rm \
    --env LEAPFROGAI_BASE_URL="$1" \
    defenseunicorns/doug-translate:latest
