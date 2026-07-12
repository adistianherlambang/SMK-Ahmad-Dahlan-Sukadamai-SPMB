<?php

// Create directory for compiled views on Vercel's read-only filesystem
$viewPath = '/tmp/storage/framework/views';
if (!is_dir($viewPath)) {
    mkdir($viewPath, 0755, true);
}

// Set environment variables for Vercel serverless environment
putenv("VIEW_COMPILED_PATH={$viewPath}");
putenv('LOG_CHANNEL=stderr');

// Forward Vercel requests to normal index.php
require __DIR__ . '/../public/index.php';
