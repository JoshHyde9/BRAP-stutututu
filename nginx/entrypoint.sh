#!/bin/sh
until nginx -t 2>/dev/null; do
  sleep 1
done
exec "$@"