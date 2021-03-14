#!/bin/sh

# extract name
project_folder_name=`ls ../GAME/project/`

template_target="../GAME/project/${project_folder_name}/Assets/WebGLTemplates/RTC"

# remove this completly
rm -r $template_target/

# create folder if not exist
mkdir -p $template_target 

# copy the html
cp ../Static/template/* $template_target 
