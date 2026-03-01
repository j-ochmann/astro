# Dockerized REST API & PostgreSQL

- Node.js (LTS version)
- TypeScript
- Fastify
- Prisma (ORM)

## Structure

Creates a project folder and the following files in it:

1. **`package.json`**
2. **`tsconfig.json`**
3. **`schema.prisma`**
4. **`Dockerfile`**
5. **`docker-compose.yml`**

## Git, Node.js & npm Inicialization

Open a terminal and type: `cd /path/to/your/workspace`

```bash
...
echo '' > Dockerfile
echo '' > compose.yml
...
cat Dockerfile
cat compose.yml
...
docker compose up -d --build
code .
```
