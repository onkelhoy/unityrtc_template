#!/bin/sh

# extract name
project_folder_name=`ls ../GAME/`

template_target="../GAME/${project_folder_name}/Assets/WebRTCTemplate/"
plugin_target="../GAME/${project_folder_name}/Assets/Plugins/"
scripts_target="../GAME/${project_folder_name}/Assets/Scripts/"

# create folder if not exist
mkdir -p $template_target 
mkdir -p $plugin_target 
mkdir -p $scripts_target 

# remove the files
rm -r $template_target/index.html
rm -r $plugin_target/RTC.jslib
rm -r $scripts_target/RTC.cs

# and the metas
rm -r $template_target/index.html.meta
rm -r $plugin_target/RTC.jslib.meta
rm -r $scripts_target/RTC.cs.meta

# copy the html
cp ../Template/index.html $template_target 

# copy the plugin files
cp ../Template/RTC.jslib $plugin_target

# copy script files
cp ../Template/RTC.cs $scripts_target

