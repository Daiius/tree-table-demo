#!/bin/bash

set -e
docker build -t tree-table-demo-interface-build -f Dockerfile.build .
set +e

docker run -t --name tree-table-demo-interface-build tree-table-demo-interface-build
result=$?

docker cp tree-table-demo-interface-build:/build/dist .

docker container rm tree-table-demo-interface-build

exit $result
