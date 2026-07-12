<?php

// Create directory for compiled views on Vercel's read-only filesystem
$viewPath = '/tmp/storage/framework/views';
if (!is_dir($viewPath)) {
    mkdir($viewPath, 0755, true);
}

// Set environment variables for Vercel serverless environment
putenv("VIEW_COMPILED_PATH={$viewPath}");
putenv('LOG_CHANNEL=stderr');
putenv('APP_CONFIG_CACHE=/tmp/config.php');
putenv('APP_EVENTS_CACHE=/tmp/events.php');
putenv('APP_PACKAGES_CACHE=/tmp/packages.php');
putenv('APP_ROUTES_CACHE=/tmp/routes.php');
putenv('APP_SERVICES_CACHE=/tmp/services.php');

// Forward Vercel requests to normal index.ph
require __DIR__ . '/../public/index.php';
