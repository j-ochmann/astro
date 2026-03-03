#!/bin/bash
exec < /dev/tty

read -p "Enter a project name: " PROJECT_NAME
read -p "Enter a user name: " USER_NAME

while true; do
    read -s -p "Enter password for DB: " PASSWORD
    echo ""
    read -s -p "Enter password again: " PASS2
    echo ""

    if [ "$PASSWORD" == "$PASS2" ] && [ ! -z "$PASSWORD" ]; then
        echo "The passwords match, let's continue..."
        break
    else
        echo "Error: Passwords do not match or are empty."
    fi
done

npx create-t3-app@latest "$PROJECT_NAME" \
  --CI \
  --trpc true \
  --tailwind true \
  --betterAuth true\
  --prisma true \
  --appRouter true \
  --dbProvider postgres || { echo "Error: T3-app@latest failed."; exit 1; }

cd "$PROJECT_NAME" || exit

if [ -f .env.example ] && [ ! -f .env ]; then cp .env.example .env; fi

if [ -f .env ]; then
    sed -i "s|:password@|:$PASSWORD@|g" .env
    
    if grep -q "POSTGRES_PASSWORD" .env; then
        sed -i "s/POSTGRES_PASSWORD=password/POSTGRES_PASSWORD=$PASSWORD/g" .env
    else
        echo "POSTGRES_PASSWORD=\"$PASSWORD\"" >> .env
        echo "POSTGRES_USER=\"$USER_NAME\"" >> .env
        echo "POSTGRES_DB=\"$PROJECT_NAME\"" >> .env
    fi
    echo "BETTER_AUTH_SECRET=\"$(openssl rand -base64 32)\"" >> .env
    echo "BETTER_AUTH_URL=\"http://localhost:3000\"" >> .env
fi

# fixed \$schema
cat <<EOF > biome.jsonc
{
	"\$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
	"root": true,
	"files": {
		"includes": [
			"**",
			"!!**/node_modules",
			"!!**/generated",
			"!!**/prisma/generated",
			"!!**/.next",
			"!!**/dist"
		]
	},
	"vcs": {
		"enabled": true,
		"useIgnoreFile": true,
		"clientKind": "git"
	},
	"assist": {
		"enabled": true,
		"actions": {
			"recommended": true,
			"source": {
				"recommended": true,
				"organizeImports": "on",
				"useSortedAttributes": "on"
			}
		}
	},
	"formatter": {
		"enabled": true
	},
	"linter": {
		"enabled": true,
		"rules": {
			"recommended": true,
			"nursery": {
				"useSortedClasses": {
					"level": "warn",
					"fix": "safe",
					"options": {
						"functions": ["clsx", "cva", "cn"]
					}
				}
			}
		}
	},
	"html": {
		"formatter": {
			"enabled": true
		}
	},
	"javascript": {
		"assist": {
			"enabled": true
		},
		"formatter": {
			"enabled": true
		},
		"linter": {
			"enabled": true
		}
	},
	"css": {
		"assist": {
			"enabled": true
		},
		"formatter": {
			"enabled": true
		},
		"linter": {
			"enabled": true
		},
		"parser": {
			"cssModules": true,
			"tailwindDirectives": true
		}
	}
}
EOF

cat <<EOF > src/app/_components/auth-buttons.tsx
"use client";

export function AuthButtons({ session }: { session: any }) {
	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<p className="text-center text-2xl text-white">
				{session && <span>Logged in as {session.user?.name}</span>}
			</p>
			{!session ? (
				<button
					className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
					onClick={() => { /* Zde zavolejte sign-in logiku */ }}
				>
					Sign in with Github
				</button>
			) : (
				<button
					className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
					onClick={() => { /* Here call sign-out logic */ }}
				>
					Sign out
				</button>
			)}
		</div>
	);
}
EOF

cat <<EOF > src/app/page.tsx
import Link from "next/link";
import { LatestPost } from "~/app/_components/post";
import { AuthButtons } from "~/app/_components/auth-buttons";
import { getSession } from "~/server/better-auth/server";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
	const hello = await api.post.hello({ text: "from tRPC" });
	const session = await getSession();

	if (session) {
		void api.post.getLatest.prefetch();
	}

	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
				<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
					<h1 className="font-extrabold text-5xl tracking-tight sm:text-[5rem]">
						Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
					</h1>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
						<Link
							className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
							href="https://create.t3.gg"
							target="_blank"
						>
							<h3 className="font-bold text-2xl">First Steps →</h3>
							<div className="text-lg">
								Just the basics - Everything you need to know to set up your
								database and authentication.
							</div>
						</Link>
						<Link
							className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
							href="https://create.t3.gg"
							target="_blank"
						>
							<h3 className="font-bold text-2xl">Documentation →</h3>
							<div className="text-lg">
								Learn more about Create T3 App, the libraries it uses, and how
								to deploy it.
							</div>
						</Link>
					</div>
					<div className="flex flex-col items-center gap-2">
						<p className="text-2xl text-white">
							{hello ? hello.greeting : "Loading tRPC query..."}
						</p>
						<AuthButtons session={session} />
					</div>

					{session?.user && <LatestPost />}
				</div>
			</main>
		</HydrateClient>
	);
}
EOF

cat <<EOF > next.config.js
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    output: "standalone",
};

export default config;
EOF

cat <<EOF > .dockerignore
node_modules
.next
out
build
dist
.git
EOF

cat <<EOF > Dockerfile
# 1. Instalace závislostí
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Kopírujeme soubory pro instalaci + prisma schéma
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Spustí čistou instalaci (vygeneruje i Prisma klienta)
RUN npm ci

# 2. Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NUTNÉ: Přidejte NEXT_TELEMETRY_DISABLED a SKIP_ENV_VALIDATION
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1

RUN npm run build

# 3. Produkční prostředí
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
EOF

cat <<EOF > compose.yml
services:
  db-test:
    image: postgres:15-alpine
    container_name: ${PROJECT_NAME}-postgres-test
    restart: always
    environment:
      - POSTGRES_USER=${POSTGRES_USER:-postgres}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB:-t3-app}_test
    ports:
      - "5433:5432" # Jiný port pro testování
  db:
    image: postgres:15-alpine
    container_name: ${PROJECT_NAME}-postgres
    restart: always
    environment:
      - POSTGRES_USER=${POSTGRES_USER:-postgres}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB:-t3-app}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: t3-app
    restart: always
    ports:
      - "3000:3000"
    environment:
      # DŮLEŽITÉ: Přepíšeme localhost na název služby "db"
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB:-t3-app}?schema=public
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - BETTER_AUTH_URL=${BETTER_AUTH_URL}
      - NODE_ENV=production
    depends_on:
      - db
volumes:
  postgres_data:
EOF

# Installation
echo "Installing dependencies..."
npm install

cd "$PROJECT_NAME" || exit
# sh ./start-database.sh

npx prisma db push
npm run dev

# T3 Build
docker build -t $PROJECT_NAME-app .

echo "Done! Project $PROJECT_NAME is ready."