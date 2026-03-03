---
title: T3/Fastify Stacks
--- 

```txt
          Android
             |
            REST
             |
SAP --> Fastify API <-- Python/C++ Worker
             |
         PostgreSQL
             |
         Next.js (T3)
             |
          React UI
apps/
  api/        (Fastify)
  web/        (Next.js)
packages/
  core-types/
```

Fastify má smysl pro

- veřejné API
- integrace (Android, SAP)
- mikroservisní mindset
- škálování backendu nezávisle na frontendu
- čistý kontrakt

Nemá smysl

- pro SaaS dashboard
- bez externích klientů
