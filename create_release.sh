#!/bin/bash
set -euo pipefail
# WARNING: I needed to add --no-optimize flag. I get errors on optimization.
npx parcel build --dist-dir=prod_dist --public-url=/interval_stopwatch --no-optimize ./src/index.html # --no-scope-hoist --no-content-hash --no-cache 
docker compose -f ./nginx_release_composefile.yaml build
docker compose -f ./nginx_release_composefile.yaml up

