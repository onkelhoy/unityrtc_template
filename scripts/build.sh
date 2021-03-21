#!/bin/sh

# build web
cd ..
npm run b:web

cp -R ./WEB/public/* ./build/public
