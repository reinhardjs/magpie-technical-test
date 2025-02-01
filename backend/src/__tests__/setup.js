import { beforeAll, afterAll } from 'vitest';
import { prisma } from '../lib/prisma';

beforeAll(async () => {
  // Setup test database
  await prisma.$connect();
});

afterAll(async () => {
  // Cleanup
  await prisma.$disconnect();
}); 