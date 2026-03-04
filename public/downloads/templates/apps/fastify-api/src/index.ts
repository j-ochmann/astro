import path from "node:path";
import cors from "@fastify/cors";
import { appRouter } from "@repo/trpc";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import dotenv from "dotenv";
import Fastify from "fastify";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const server = Fastify({ logger: true });

server.get('/', async () => {
  return { status: 'OK', message: 'Fasnextro API is running' };
});

async function start() {
  await server.register(cors, { origin: true });

  await server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      createContext: () => ({}),
    },
  });

  try {
    const port = Number(process.env.PORT) || 3005;
    await server.listen({ port, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
  if (err && typeof err === 'object' && 'code' in err && err.code === 'EADDRINUSE') {
      console.log('Port 3005 obsazen, zkouším 3006...');
      await server.listen({ port: 3006, host: '0.0.0.0' });
    } else {
      process.exit(1);
    }
  }
}

start();