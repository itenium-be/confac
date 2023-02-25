#!/bin/bash

echo "Using env: $1"

# if [ ! -f $1 ]
# then
#   rm .env
#   cp $1 .env
# fi


cd build
docker build --quiet . | tail -n1 | xargs -I{} docker run --rm -v $(pwd)/../../:/confac {}

cd ..
docker-compose up -d --build

echo "That could've worked"
