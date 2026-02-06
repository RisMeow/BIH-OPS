#!/bin/sh
set -e

# Regenerate Prisma Client to ensure compatibility


# Run migrations
echo "Pushing database schema..."
npx prisma db push

# Start the application
echo "Starting application..."
exec node server.js
