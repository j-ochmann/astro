---
title: 'Dockerized REST API & PostgreSQL'
sidebar:
  label: REST & SQL
  order: 1
translation_status: original
---

## 1. Lokální vývojové prostředí

Než to pošlete na server, musíte to rozběhat u sebe:

- **Node.js (LTS verze):** Nainstalujte si Node.js (ideálně verzi 20+).
- **Editor:** Visual Studio Code je průmyslový standard pro TypeScript.
- **Postman nebo Insomnia:** Nástroje pro testování vašich API endpointů (posílání GET/POST požadavků).

## 2. Technologie pro API (Knihovny)

V profesionálním světě TypeScriptu nepište vše od nuly. Doporučuji tento moderní „stack“:

- **Fastify:** Extrémně rychlý a moderní framework pro Node.js (nástupce Express.js).
- **Prisma (ORM):** To je ten nejdůležitější kousek. Prisma vám vygeneruje TypeScriptové typy přímo z vaší databáze. Už nikdy nebudete muset hádat, jaké sloupce máte v tabulce.
- **Zod:** Knihovna pro validaci dat, která přicházejí od uživatele (např. kontrola, zda je e-mail skutečně e-mail).

## 3. Struktura projektu (Co vytvořit v PC)

Vytvořte si složku pro svůj projekt a v ní tyto soubory:

1. **`package.json`** seznam knihoven
2. **`tsconfig.json`** nastavení TypeScriptu
3. **`schema.prisma`** Zde definujete své tabulky (např. User, Post).
4. **`Dockerfile`** Recept na zabalení tohoto API.
5. **`docker-compose.yml`** Spojí vaše API s Postgres kontejnerem.

## 4. Propojení s Nginx Proxy Managerem

Aby bylo API vidět na vaší doméně (např. api.moje-domena.cz):

V Nginx Proxy Manageru vytvoříte nový Proxy Host.

- **Domain Names:** api.moje-domena.cz
- **Forward IP:** Název vašeho API kontejneru (pokud jsou ve stejné Docker síti) nebo lokální IP serveru.
- **Forward Port:** Port, na kterém poběží vaše API (např. 3000).

## Inicializace projektu

1. Nainstalujte Node.js a npm.

Otevřete terminál v prázdné složce, kde chcete mít svůj projekt a zdadejte:

```shell
# Vytvoření souboru package.json
npm init -y

# Instalace TypeScriptu a vývojových nástrojů
npm install typescript ts-node nodemon @types/node --save-dev

# Inicializace konfigurace TypeScriptu (vytvoří tsconfig.json)
npx tsc --init
```
