#!/bin/bash
set -euo pipefail

npx parcel build --dist-dir=prod_dist_root_domain --public-url=/ --no-optimize ./src/index.html
docker build -f nginx_release_root_domain.dockerfile --tag interval_stopwatch:1.0.0-root --build-arg SSH_PUB_KEY="$(cat ~/.ssh/id_rsa.pub)" . 
docker tag interval_stopwatch:1.0.0-root tomaszkostur/hardwired:interval_stopwatch_root_domain
docker push tomaszkostur/hardwired:interval_stopwatch_root_domain

# certbot --nginx -d $DOMAIN --non-interactive --agree-tos --register-unsafely-without-email;