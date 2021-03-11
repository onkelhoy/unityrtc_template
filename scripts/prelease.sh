#!/bin/sh

# extract name
build=`ls ../GAME/build/`

# move build to correct folder
cp -R ../GAME/build/${build}/ ../product/public