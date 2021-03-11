#!/bin/sh

# extract name
project_folder_name=`ls ../GAME/project/`

template_target="../GAME/project/${project_folder_name}/Assets/WebGLTemplates/RTC"
plugin_target="../GAME/project/${project_folder_name}/Assets/Plugins"
scripts_target="../GAME/project/${project_folder_name}/Assets/Scripts"

# remove this completly
rm -r $template_target/

# create folder if not exist
mkdir -p $template_target 
mkdir -p $plugin_target 
mkdir -p $scripts_target 

# remove the files
rm $plugin_target/RTC.jslib
rm $scripts_target/RTC.cs

# and the metas
rm $plugin_target/RTC.jslib.meta
rm $scripts_target/RTC.cs.meta

# copy the html
cp ../Static/template/* $template_target 

# copy the plugin files
cp ../Static/RTC.jslib $plugin_target

# copy script files
cp ../Static/RTC.cs $scripts_target

