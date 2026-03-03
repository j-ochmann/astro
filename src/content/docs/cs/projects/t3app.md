---
title: 'T3 Stack (Extended)'
sidebar:
  label: T3 Stack
  order: 10
translation_status: original
---
## Rychlá instalace [t3.sh](/downloads/t3.sh)

```bash
bash <(curl -sSL http://localhost:4321/downloads/t3.sh)
```

[**Create T3 App**](https://create.t3.gg/) CLI generuje konfiguraci pro Next.js, TypeScript, Tailwind CSS, tRPC, BetterAuth, Prisma, PostgreSQL, Biome, Zod, atd.

```bash
   ___ ___ ___   __ _____ ___   _____ ____    __   ___ ___
  / __| _ \ __| /  \_   _| __| |_   _|__ /   /  \ | _ \ _ \
 | (__|   / _| / /\ \| | | _|    | |  |_ \  / /\ \|  _/  _/
  \___|_|_\___|_/‾‾\_\_| |___|   |_| |___/ /_/‾‾\_\_| |_|
◇  What will your project be called?                   [...]
◇  Will you be using TypeScript or JavaScript?         [TypeScript]
◇  Will you be using Tailwind CSS for styling?         [Yes]
◇  Would you like to use tRPC?                         [Yes]
◇  What authentication provider would you like to use? [BetterAuth]
◇  What database ORM would you like to use? Prisma     [Yes]
◇  Would you like to use Next.js App Router?           [Yes]
◇  What database provider would you like to use?       [PostgreSQL]
◇  Would you like to use ESLint and Prettier or Biome  
│    for linting and formatting?                        [Biome]
◇  Should we initialize a Git repository and stage the changes?
◇  Should we run 'npm install' for you?                [Yes]
◆  What import alias would you like to use?            [~/]
```

## 📦 Skladba Stacku

**Next.js** / **TypeScript** / **Tailwind CSS** / **tRPC** / **BetterAuth** / **Prisma** / **PostgreSQL** / **Biome**

Jádrem je **Next.js** s App Routerem a **TypeScriptem** pro maximální typovou kontrolu.

- **tRPC** API zajišťuje automatické sdílení typů mezi serverem a klientem bez generování kódu.
- **PostgreSQL** je robustní databáze s **Prisma ORM** pro snadnou manipulaci s daty.
- **BetterAuth** je moderní flexibilní řešení autentizace.
- **Tailwind CSS** pro rychlé stylování **UI** pomocí utility tříd.
- **Biome** zajišťuje bleskurychlý linting a formátování (náhrada za **ESLint/Prettier**).
- **Zod** zajišťuje validaci dat ve schématech i formulářích.

## 🛠️ Co je třeba dořešit

- **Inngest** pro spouštění úloh na pozadí
- **Health-check:** skript `app/api/health/route.ts`
- **zod-prisma-types** plugin do schema.prisma
- **File Storage:** S3 kompatibilní úložiště (AWS S3, R2, UploadThing) pro ukládání souborů.
- **Resend**+**React Email** pro verifikaci účtů a notifikace.
- **Sentry** pro sledování chyb
- **PostHog** pro analytiku chování uživatelů bez cookies lišty.

>Tip: **Redis 90%** projektů nepotřebuje, pokud neplánujete složité fronty nebo masivní real-time chat. **PostgreSQL** a **Inngest** jej nahradí.

## Instalace T3

```bash
npm create t3-app@latest
```

## Chyby

1. Biome má zakáz použití čárky. Lintovat **generated** je chyba configu.
2. formuláře v tlačítcích

```bash
Generating Prisma client...
Successfully generated Prisma client!
Formatting project with biome...
⠙ Running format command
Aborting installation...
Error: Command failed with exit code 1: npm run check:unsafe
generated/prisma/query_engine_bg.js:125:78 lint/complexity/noCommaOperator ━━━━━━━━━━━━━━━━━━━━━━━━━

  ! The comma operator is disallowed.
  
    123 │ function y() {
    124 │   return (
  > 125 │     (A === null || A.byteLength === 0) && (A = new Uint8Array(_.memory.buffer)),
```

### Opravy

- V **biome.jsonc** za `"root": true,` přidejte:

  ```jsonc
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
  ```

- V **src/app/page.tsx** nahraďte tlačítka:

  ```tsx
  import Link from "next/link";

  import { LatestPost } from "~/app/_components/post";
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
                href="https://create.t3.gg/en/usage/first-steps"
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
                href="https://create.t3.gg/en/introduction"
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

              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-center text-2xl text-white">
                  {session && <span>Logged in as {session.user?.name}</span>}
                </p>
                {!session ? (
                  <form>
                    <button
                      className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20" // ← přidat toto
                      onClick={() => {
                        /* něco */
                      }}
                      type="button"
                    >
                      Sign in with Github
                    </button>
                  </form>
                ) : (
                  <form>
                    <button
                      className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20" // ← přidat toto
                      onClick={() => {
                        /* něco */
                      }}
                      type="button"
                    >
                      Sign out
                    </button>
                  </form>
                )}
              </div>
            </div>

            {session?.user && <LatestPost />}
          </div>
        </main>
      </HydrateClient>
    );
  }
  ```

- V terminálu zadejte:

  ```bash
  cd t3app
  npm run check:unsafe
  ```
