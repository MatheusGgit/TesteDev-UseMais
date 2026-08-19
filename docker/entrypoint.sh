#!/bin/sh
set -e

mkdir -p "$(dirname "$DB_DATABASE")"
touch "$DB_DATABASE"

php artisan migrate --force
php artisan db:seed --force

exec "$@"
