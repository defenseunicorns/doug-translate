#!/usr/bin/env bash

set -euo pipefail

docker build . -t ghcr.io/defenseunicorns/doug-translate:0.1.0

mkdir -p pkgs

zarf package create -o pkgs --confirm

# docker push ghcr.io/defenseunicorns/doug-translate:latest
