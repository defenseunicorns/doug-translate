#!/usr/bin/env bash

set -euo pipefail

curl -sL https://istio-release.storage.googleapis.com/charts/index.yaml | yq '.entries | keys'
