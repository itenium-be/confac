#!/bin/bash

# Build backend
cd ../backend

rm -rf -- ./public

npm install
npm run build

rm -rf -- ./node_modules
npm install --production




# Build frontend
cd ../frontend

set CI=true

rm -rf -- ./build
npm install
npm run build


# Merge to deploy/dist
cd ../deploy
rm -rf -- ./dist
mkdir dist


mv ../backend/public/** ./dist
mkdir ./dist/node_modules
mv ../backend/node_modules/** ./dist/node_modules


mkdir ./dist/public
mv ../frontend/build/** ./dist/public
