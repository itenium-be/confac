#!/bin/bash

# Run ./migrate.sh to display instructions

echo -e "\033[0;32m===================="
echo "= MONGO MIGRATIONS ="
printf "====================\033[0m\n"
echo -e "\033[1;37mRun the mongo migrations\033[0m"

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
    echo "./migrate.sh .env.sample"
  else
    echo "$envs" | sed 's/\(.*\)/.\/migrate.sh \1/g'
  fi
  echo -e "\033[0m"

  exit 0
fi


echo "Using env: $1"

if [ -f .env ]
then
  rm .env
fi
cp $1 .env

npm install
npm run up

echo "That could've worked"
