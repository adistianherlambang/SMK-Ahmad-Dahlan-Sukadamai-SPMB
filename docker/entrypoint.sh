#!/bin/bash
set -e

echo "🚀 Starting Laravel Application..."

# Wait for MySQL to be ready
if [ -n "$DB_HOST" ] && [ "$DB_HOST" != "127.0.0.1" ]; then
    echo "⏳ Waiting for database ($DB_HOST:${DB_PORT:-3306})..."
    timeout 60 sh -c "until nc -z \"$DB_HOST\" \"${DB_PORT:-3306}\" 2>/dev/null; do sleep 2; done"
    echo "✅ Database is ready!"
fi

# Create required directories
mkdir -p /var/log/supervisor
mkdir -p storage/framework/{sessions,views,cache}
mkdir -p storage/logs
mkdir -p bootstrap/cache

# Set permissions
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Run Laravel startup commands
echo "🔧 Running artisan commands..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "🗃️  Running migrations..."
    php artisan migrate --force

    # Seed hanya jika tabel users kosong (fresh database)
    USER_COUNT=$(php artisan tinker --execute="echo App\Models\User::count();" 2>/dev/null | tail -1)
    if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
        echo "🌱 Seeding database (fresh install)..."
        php artisan db:seed --force
    fi
fi

echo "✅ Laravel is ready! Starting services..."

exec "$@"
