#!/usr/bin/env bash

set -euo pipefail

docker build . -t defenseunicorns/doug-translate:latest

mkdir -p pkgs

zarf package create istio -o pkgs --confirm

zarf package create -o pkgs --confirm

# docker push defenseunicorns/doug-translate:latest
