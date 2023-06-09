#!/usr/bin/env bash

set -euo pipefail

zarf connect \
    doug-translate \
    --local-port 3000
