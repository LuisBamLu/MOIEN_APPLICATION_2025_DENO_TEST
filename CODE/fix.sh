TOOL=~/TOOL

wine "$TOOL/PHYX/phyx.exe" --newline --include "ADMIN/src//*.js" --include "ADMIN/src//*.ts" --include "CLIENT/src//*.js" --include "CLIENT/src//*.ts" --include "SERVER/src//*.js" --include "SERVER/src//*.ts"
wine "$TOOL/PHYX/phyx.exe" --newline --media --style --include "ADMIN/src//*.svelte" --include "ADMIN/src//*.styl" --include "CLIENT/src//*.svelte" --include "CLIENT/src//*.styl"
wine "$TOOL/FLEX/flex.exe" fix.flex
