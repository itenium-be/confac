#!/bin/bash

# Build the app & start mongo & app containers

# Usage:
# cp .env.sample .env.pongit.prod
# sh ./deploy.sh .env.pongit.prod
# sh ./deploy.sh .env.pongit.test

echo "Using env: $1"

# .env file juggling because Synology docker version does not yet support:
# docker-compose up --env-file $1
if [ -f .env ]
then
  rm .env
fi
cp $1 .env


echo "What to do?"
echo "f) build & deploy"
echo "d) just deploy"
read -n1 -s -r -p $'Press f or d to continue\n' key

if [ "$key" = 'f' ]; then
    echo "full build it is"
    cd build
    docker build --quiet . | tail -n1 | xargs -I{} docker run --rm -v $(pwd)/../../:/confac {}

    cd ..
    docker-compose up -d --build

elif [ "$key" = 'd' ]; then
    echo "just deploying then?"
    docker-compose up -d
fi


echo "That could've worked"
