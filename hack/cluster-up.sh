#!/usr/bin/env bash

set -euo pipefail

k3d cluster create --api-port 6550 \
    -p '9080:80@loadbalancer' \
    -p '9443:443@loadbalancer' \
    --agents 2 \
    --k3s-arg '--disable=traefik@server:*'
