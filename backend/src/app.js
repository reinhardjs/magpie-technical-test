import Fastify from 'fastify';
import cors from '@fastify/cors';
import { prisma } from './lib/prisma.js';
import bookRoutes from './routes/bookRoutes.js';
import { authenticate } from './middleware/authMiddleware.js';

export async function build() {
  const app = Fastify({
    logger: true,
    trustProxy: true
  });

  // Register CORS
  await app.register(cors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  });

  // Add global authentication hook
  app.addHook('preHandler', authenticate);

  // Register routes
  await app.register(bookRoutes, { prefix: '/api/books' });

  return app;
} 
