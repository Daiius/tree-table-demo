#!/bin/bash

compose_file=docker-compose-test.yml

set -e
docker compose -f $compose_file build
set +e

docker compose -f $compose_file up --exit-code-from=webapi-test

# copy necessary files

docker compose -f $compose_file down

