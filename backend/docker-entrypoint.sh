#!/bin/sh
set -e

# Run Prisma migrations
npx prisma migrate deploy

# Start the app
exec node dist/app.js
