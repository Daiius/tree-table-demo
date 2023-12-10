#!/bin/bash

set -e 
docker build -t tree-table-demo-interface-test -f Dockerfile.test .


set +e
docker run -t --name tree-table-demo-interface-test tree-table-demo-interface-test
result=$?

docker cp tree-table-demo-interface-test:/test/junit.xml .

docker container rm tree-table-demo-interface-test

exit $result

