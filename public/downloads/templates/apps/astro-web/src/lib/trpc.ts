import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@repo/trpc';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3005/trpc',
    }),
  ],
});
