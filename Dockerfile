# syntax=docker/dockerfile:1

FROM php:8.3-cli AS build

RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip libsqlite3-dev ca-certificates curl gnupg \
    && docker-php-ext-install pdo pdo_sqlite \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN cp .env.example .env \
    && echo "DB_DATABASE=/app/storage/database/database.sqlite" >> .env \
    && php artisan key:generate --force \
    && php artisan package:discover --ansi \
    && npm run build \
    && composer dump-autoload --optimize --no-dev \
    && rm -rf node_modules tests

FROM php:8.3-cli AS runtime

RUN apt-get update && apt-get install -y --no-install-recommends \
        libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /app /app

RUN chmod -R a+rwX storage bootstrap/cache

COPY docker/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

ENV DB_DATABASE=/app/storage/database/database.sqlite

EXPOSE 8000

ENTRYPOINT ["entrypoint"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
