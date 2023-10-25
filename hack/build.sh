#!/usr/bin/env bash

set -euo pipefail

docker build . -t defenseunicorns/doug-translate:0.0.1

mkdir -p pkgs

zarf package create metallb -o pkgs --confirm

zarf package create istio -o pkgs --confirm

zarf package create -o pkgs --confirm

# docker push defenseunicorns/doug-translate:latest
