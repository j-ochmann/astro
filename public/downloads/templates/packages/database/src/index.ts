import { PrismaClient } from '@prisma/client';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export * from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const dbUrl = process.env.DATABASE_URL || 
              process.env.DB_MAIN_YML || 
              `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:5432/${process.env.DB_MAIN}?schema=public`;
export const db = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
