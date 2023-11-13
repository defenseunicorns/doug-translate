#!/usr/bin/env bash

set -euo pipefail

zarf package deploy \
    pkgs/zarf-package-metallb-setup-amd64.tar.zst \
    -l=debug \
    --confirm

ISTIO_VERSION=$(yq .package.create.set.istio_version zarf-config.yaml)

zarf package deploy \
    pkgs/zarf-package-istio-amd64-"$ISTIO_VERSION".tar.zst \
    -l=debug \
    --confirm

zarf package deploy \
    pkgs/zarf-package-doug-translate-amd64-0.1.0.tar.zst \
    --set LEAPFROGAI_BASE_URL="$1" \
    --set DOMAIN="$2" \
    --set SUMMARIZATION_MODEL="$3" \
    -l=debug \
    --confirm
