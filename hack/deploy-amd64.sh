#!/usr/bin/env bash

set -euo pipefail

zarf package deploy \
    zarf-package-doug-translate-amd64-0.0.1.tar.zst \
    --set LEAPFROGAI_BASE_URL="$1" \
    -l=debug \
    --confirm
