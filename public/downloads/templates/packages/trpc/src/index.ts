import { initTRPC } from '@trpc/server';
import { db } from '@repo/database';

const t = initTRPC.create();
export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  getUsers: publicProcedure.query(async () => {
    return await db.user.findMany();
  }),
});
export type AppRouter = typeof appRouter;
