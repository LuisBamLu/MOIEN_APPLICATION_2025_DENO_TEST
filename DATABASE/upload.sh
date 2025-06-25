TOOL=~/TOOL

ENV_FILE="../CODE/SERVER/.env"

source "$ENV_FILE"

wine "$TOOL/CYCLONE/cyclone.exe" --driver postgresql --host $MOIEN_DATABASE_HOST --port 5432 --user postgres --password $MOIEN_DATABASE_PASSWORD moien.sql