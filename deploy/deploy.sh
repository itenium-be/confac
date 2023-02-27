#!/bin/bash

echo -e "\033[0;32m================="
echo "= CONFAC DEPLOY ="
printf "=================\033[0m\n"
echo -e "\033[1;37mBuild the app & start mongo & app containers\033[0m"

if [ "$1" = "" ]
then
  echo ""
  echo "Setup new environment:"
  echo "cp .env.sample .env.prod"
  echo ""

  echo -e "\033[1;34mCurrent posibilities:\033[1;37m"
  envs=$(ls -a .env* | sed '/\.env\(\.sample\)\?$/d')

  if [ "$envs" = "" ]
  then
    echo "./deploy.sh .env.sample"
  else
    echo "$envs" | sed 's/\(.*\)/.\/deploy.sh \1/g'
  fi
  echo -e "\033[0m"

  exit 0
fi


echo "Using env: $1"

# .env file juggling because Synology docker version does not yet support:
# docker-compose up --env-file $1
if [ -f .env ]
then
  rm .env
fi
cp $1 .env

# Add tag to confac-app image
echo "TAG=$(date +%Y-%m-%d)" >> .env

# if [ -f build/.env ]
# then
#   rm build/.env
# fi
# cp .env build/.env


echo "What to do?"
echo "f) build & deploy"
echo "d) just deploy"
read -n1 -s -r -p $'Press f or d to continue\n' key

if [ "$key" = 'f' ]; then
    echo "full build it is"

    # Assembling deploy/dist running in a temp node container
    cd build
    docker build --quiet . | tail -n1 | xargs -I{} docker run -e  --rm -v $(pwd)/../../:/confac {}

    # Spin up mongo & app containers
    cd ..
    docker-compose up -d --build

elif [ "$key" = 'd' ]; then
    # Fast startup when there are no code changes
    echo "just deploying then?"
    docker-compose up -d
fi


echo "That could've worked"
