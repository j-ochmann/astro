---
title: Monorepo
sidebar:
  label: Monorepo
  order: 0
translation_status: original
---

## Soubor [fasnextro.sh](/downloads/fasnextro.sh)

```bash
bash <(curl -sSL http://localhost:4321/downloads/fasnextro.sh)
```

```bash
cd fasnextro
docker compose down -v
cd ..
sudo rm -rf fasnextro
clear
ls -la
```

monorepo.sh 925,3MB

Úprava Next.js (`apps/next-app/package.json`)
Hned po inicializaci Next.js ve skriptu (za řádek s `rm -rf apps/next-app/.git`) přidejte tento blok.

```bash
# Propojení Next.js s tRPC a databází
# Přidáme závislosti přímo do package.json
cat <<EOF > apps/next-app/package.json
{
  "name": "next-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "@repo/trpc": "workspace:*",
    "@repo/database": "workspace:*",
    "@trpc/client": "latest",
    "@trpc/server": "latest",
    "@trpc/react-query": "latest",
    "@tanstack/react-query": "latest"
  },
  "devDependencies": {
    "typescript": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "postcss": "latest",
    "tailwindcss": "latest"
  }
}
EOF
```

Úprava Astra (`apps/astro-web/package.json`)
Astro potřebuje totéž:

```bash
# Propojení Astro s tRPC
cat <<EOF > apps/astro-web/package.json
{
  "name": "astro-web",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "latest",
    "@astrojs/starlight": "latest",
    "sharp": "latest",
    "@repo/trpc": "workspace:*",
    "@repo/database": "workspace:*",
    "@trpc/client": "latest"
  }
}
EOF
```

## Soubor [monorepo.sh](/downloads/monorepo.sh)

```bash
bash <(curl -sSL http://localhost:4321/downloads/monorepo.sh)
```
