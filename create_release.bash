#!/bin/bash
set -e  # Exit on any error
rm -rf ./dist
npx parcel build ./src/index.html # WATNING: for some reason this doesn't work. use npx parcel ./src/index.html # instead
docker image build --file ./nginx_release.dockerfile --tag interval_stopwatch:latest .
docker run --rm -p 8080:80 interval_stopwatch:latest  