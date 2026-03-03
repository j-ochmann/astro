#!/bin/bash

# Ukončí skript při jakékoli chybě
set -e

sudo npm install -g pnpm

cat << 'EOF' > .env
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=dockerized_db
COMPOSE_URL=postgresql://user:password@db:5432/dockerized_db?schema=public
DATABASE_URL=postgresql://user:password@localhost:5432/dockerized_db?schema=public
EOF

cat << 'EOF' > .env
# .env pro api-server
DATABASE_URL="postgresql://user:password@postgres-db:5432/main_db"
PORT=3000
# DŮLEŽITÉ: Fastify musí v Dockeru naslouchat na 0.0.0.0
API_HOST="0.0.0.0"
EOF

cat << 'EOF' > .env
# .env pro next-app
# Pro volání z prohlížeče (musí mít prefix NEXT_PUBLIC_)
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Pro volání ze serveru (např. v getServerSideProps nebo Server Components)
# Tato adresa funguje jen uvnitř Docker sítě
INTERNAL_API_URL="http://api-server:3000"
EOF

cat << 'EOF' > .env
# .env pro astro-web
# Veřejné proměnné pro klientské skripty
PUBLIC_API_URL="http://localhost:3000"

# Interní proměnné pro SSR (Astro komponenty běžící na serveru)
INTERNAL_API_URL="http://api-server:3000"
EOF

cat << 'EOF' > compose.yml
services:
  postgres-db:
    container_name: postgres-db
    # ...
  api-server:
    container_name: api-server
    depends_on:
      - postgres-db
    # ...
  next-app:
    container_name: next-app
    depends_on:
      - api-server    
    # ...
  astro-web:
    container_name: astro-web
    depends_on:
      - api-server
    # ...
EOF

