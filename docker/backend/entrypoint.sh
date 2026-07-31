#!/bin/sh
set -e

echo "==> Running Database Migrations..."
python manage.py migrate --noinput

echo "==> Collecting Static Files..."
python manage.py collectstatic --noinput --clear || true

echo "==> Starting Gunicorn Application Server..."
exec "$@"
