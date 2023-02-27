#!/bin/bash

echo "Start building confac"

node -v
npm -v


# Build backend
echo "Building backend"
cd ./backend

rm -rf -- ./public

npm install
npm run build


# Build frontend
echo "Building frontend"
cd ../frontend

set CI=true

rm -rf -- ./build
npm install
npm run build


# Merge to deploy/dist
echo "Merge frontend & backend"
cd ../deploy
rm -rf -- ./dist
mkdir dist


mv ../backend/public/** ./dist
mkdir ./dist/node_modules
mv ../backend/node_modules/** ./dist/node_modules


mkdir ./dist/public
mv ../frontend/build/** ./dist/public



echo "Build done!"
echo "Files placed in deploy/dist"
