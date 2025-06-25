TOOL=~/TOOL

wine "$TOOL/BASIL/basil.exe" --exclude-command "create schema" --exclude-command "set search_path" --postgresql moien.bs moien.bd
