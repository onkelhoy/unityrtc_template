#!/bin/sh

# prepares web and game
sh prepare.sh 

# build web
cd ..
npm run b:web
cd ./scripts

# Moving build into public 
#   extract name
build=`ls ../GAME/build/`

#   move build to correct folder
cp -R ../GAME/build/${build}/ ../product/public
