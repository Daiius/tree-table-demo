#!/bin/bash
set -e
docker compose build
set +e

docker compose up

docker compose down

