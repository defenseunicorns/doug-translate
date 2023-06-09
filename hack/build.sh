#!/usr/bin/env bash

set -euo pipefail

docker build . -t defenseunicorns/doug-translate:latest

zarf package create . --confirm

# docker push defenseunicorns/doug-translate:latest
