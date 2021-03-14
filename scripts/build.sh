#!/bin/sh

rm -r ../build

# prepares web and game
sh prepare.sh 

# build web
cd ..
npm run b:web
cd ./scripts

# Move public to build/public
cp -R ../WEB/public/* ../build/public

# Moving builds into public 
list=$(find ../GAME/build -maxdepth 1 -mindepth 1 -type d -exec basename {} \;)

mkdir -p ../build/public/game
for i in $list; do # Whitespace-safe but not recursive.
  cp -R ../GAME/build/${i}/Build ../build/public/game/$i
done