#!/bin/bash

set -e
docker build -t tree-table-demo-intreface-check -f Dockerfile.check .
set +e

docker run --rm -t --name tree-table-demo-interface-check tree-table-demo-intreface-check

