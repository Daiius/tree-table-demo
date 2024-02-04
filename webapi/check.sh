#!/bin/bash

name=tree-table-demo-webapi-check

docker build -t $name -f Dockerfile.check .

docker run -t --name $name $name

# copy files from check container if necesarry...
# docker cp $name:/check

docker container rm $name
