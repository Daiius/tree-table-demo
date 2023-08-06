#!/bin/bash

set -e
docker build -t tree-table-demo-interface-build -f Dockerfile.build .

docker run --name tree-table-demo-interface-build tree-table-demo-interface-build

docker cp tree-table-demo-interface-build:/build/dist ./dist

docker container rm tree-table-demo-interface-build
