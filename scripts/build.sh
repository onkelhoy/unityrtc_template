#!/bin/sh

# prepares web and game
sh prepare.sh 

# build web
cd ..
npm run b:web
cd ./scripts

# Moving builds into public 
list=$(find ../GAME/build -maxdepth 1 -mindepth 1 -type d -exec basename {} \;)


for i in $list; do # Whitespace-safe but not recursive.
  cp -R ../GAME/build/${i}/Build ../product/public/$i
done