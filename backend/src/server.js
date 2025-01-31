import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import lendingRoutes from './routes/lendingRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

// Swagger configuration
fastify.register(swagger, {
  swagger: {
    info: {
      title: 'Digital Library API',
      version: '1.0.0',
      description: 'API documentation for Digital Library Management System'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  },
  exposeRoute: true
});

// CORS
fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

// Routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(bookRoutes, { prefix: '/api/books' });
fastify.register(memberRoutes, { prefix: '/api/members' });
fastify.register(lendingRoutes, { prefix: '/api/lendings' });
fastify.register(analyticsRoutes, { prefix: '/api/analytics' });

// Global error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  reply.status(error.statusCode || 500).send({
    error: 'Internal Server Error',
    message: error.message
  });
});

// Server startup
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info('Server listening on port 3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
