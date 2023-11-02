#!/usr/bin/env bash

set -euo pipefail

zarf package deploy \
    pkgs/zarf-package-doug-translate-amd64-0.0.1.tar.zst \
    --set LEAPFROGAI_BASE_URL="$1" \
    --set DOMAIN="$2" \
    --set SUMMARIZATION_MODEL="$3" \
    -l=debug \
    --confirm
