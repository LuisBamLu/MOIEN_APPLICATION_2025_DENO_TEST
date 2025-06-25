#!/bin/bash

cd ../
$TOOL/PHYX/phyx --newline --include "CLIENT/src/*.js" --include "SERVER/src/*.js"
$TOOL/PHYX/phyx --newline --media --style --include "CLIENT/src/*.svelte" --include "CLIENT/src/*.styl" --include "ADMIN/src/*.svelte" --include "ADMIN/src/*.styl"
read -p "Press any key to continue..."
