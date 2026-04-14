#!/bin/bash

# Run ./deploy.sh to display instructions

# Workings:
# deploy/Dockerfile multi-stage build: builds backend+frontend, creates runtime image
# ./docker-compose.yml spins up mongo & confac app containers

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
TAG=$(date +%Y-%m-%d)
echo "TAG=$TAG" >> .env


# ---------------------------------------------------------------------------
# Migrations: bring mongo up, check for pending migrations, offer to run them
# in a throwaway bun container joined to confacnet. No host runtime needed
# beyond docker itself.
# ---------------------------------------------------------------------------
echo ""
echo -e "\033[1;34m== Checking for pending database migrations ==\033[0m"

docker-compose up -d mongo

CONFACNET=$(docker network ls --filter name=confacnet --format '{{.Name}}' | head -1)
if [ -z "$CONFACNET" ]; then
  echo -e "\033[0;31mCould not find confacnet network — docker-compose up failed?\033[0m"
  exit 1
fi

run_migrate() {
  docker run --rm \
    --network "$CONFACNET" \
    --env-file .env \
    -e MONGO_HOST=mongo \
    -e MONGO_PORT=27017 \
    -v "$(pwd):/deploy" \
    -v confac-migrate-node_modules:/deploy/node_modules \
    -w /deploy \
    oven/bun:1.3.11 \
    sh -c "bun install --frozen-lockfile >/dev/null 2>&1 && bun run $1"
}

# Retry: first attempt may be slow because bun install populates the named
# volume and mongo may still be starting up.
STATUS_OUTPUT=""
for attempt in 1 2 3 4 5; do
  if STATUS_OUTPUT=$(run_migrate status 2>&1); then
    break
  fi
  sleep 3
done

if ! echo "$STATUS_OUTPUT" | grep -q -E 'PENDING|Filename'; then
  echo -e "\033[0;31mmigrate-mongo status failed:\033[0m"
  echo "$STATUS_OUTPUT"
  read -n1 -s -r -p $'Continue anyway? [y/N] ' contkey
  echo
  if [ "$contkey" != "y" ] && [ "$contkey" != "Y" ]; then
    exit 1
  fi
else
  PENDING=$(echo "$STATUS_OUTPUT" | grep -c 'PENDING' || true)
  if [ "$PENDING" -gt 0 ]; then
    echo -e "\033[1;33m$PENDING pending migration(s):\033[0m"
    echo "$STATUS_OUTPUT" | grep 'PENDING'
    read -n1 -s -r -p $'Run them now? [y/N] ' migkey
    echo
    if [ "$migkey" = "y" ] || [ "$migkey" = "Y" ]; then
      run_migrate up
    else
      echo "Skipping migrations."
    fi
  else
    echo -e "\033[0;32mNo pending migrations.\033[0m"
  fi
fi


echo ""
echo "What to do?"
echo "f) build & deploy"
echo "d) just deploy"
read -n1 -s -r -p $'Press f or d to continue\n' key

if [ "$key" = 'f' ]; then
  echo "full build it is"

  # Multi-stage Dockerfile handles the build
  docker-compose up -d --build

  # Max one version per day
  git tag -f v$TAG
  git push origin v$TAG --force

elif [ "$key" = 'd' ]; then
  # Fast startup when there are no code changes
  echo "just deploying then?"
  docker-compose up -d
fi


echo "That could've worked"
