# Setup

laravel setup with breeze and frontend

=== BACKEND ===

composer create-project laravel/laravel backend
cd backend

composer require laravel/sanctum
composer require mongodb/laravel-mongodb

composer require laravel/breeze --dev
php artisan breeze:install react
npm install
npm run dev

php artisan migrate

// Edit database/migrations/xxxx_create_users_table.php

$table->enum('role', ['admin', 'service_user', 'oic'])->default('service_user');

// create php file sanctum & cors inside config folder

php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

// cors contents:
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];

pip install pdfplumber


=== FRONTEND ===

npx create-react-app frontend
cd frontend
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init
npm install react-router-dom
npm install date-fns
npm install react-datepicker
npm install js-cookie

