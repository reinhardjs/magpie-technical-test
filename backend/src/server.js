import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import lendingRoutes from './routes/lendingRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

// Swagger configuration
fastify.register(swagger, {
  openapi: {
    info: {
      title: 'Digital Library API',
      description: 'API documentation for Digital Library Management System',
      version: '1.0.0',
      contact: {
        name: 'API Support',
        email: 'support@library.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Books', description: 'Book management endpoints' },
      { name: 'Members', description: 'Member management endpoints' },
      { name: 'Lendings', description: 'Book lending management endpoints' },
      { name: 'Categories', description: 'Book category management endpoints' },
      { name: 'Analytics', description: 'Library analytics endpoints' }
    ]
  },
  hideUntagged: true,
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
fastify.register(categoryRoutes, { prefix: '/api/categories' });
fastify.register(analyticsRoutes, { prefix: '/api/analytics' });

// Add route schemas
const routeSchemas = {
  auth: {
    register: {
      tags: ['Auth'],
      summary: 'Register a new user',
      body: {
        type: 'object',
        required: ['email', 'password', 'name', 'role'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          name: { type: 'string' },
          role: { type: 'string', enum: ['ADMIN', 'LIBRARIAN', 'MEMBER'] }
        }
      },
      response: {
        200: {
          description: 'Successful registration',
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' }
              }
            }
          }
        }
      }
    },
    login: {
      tags: ['Auth'],
      summary: 'Login user',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      }
    }
  },
  books: {
    create: {
      tags: ['Books'],
      summary: 'Create a new book',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['title', 'author', 'isbn', 'quantity', 'categoryId'],
        properties: {
          title: { type: 'string' },
          author: { type: 'string' },
          isbn: { type: 'string' },
          quantity: { type: 'number', minimum: 1 },
          categoryId: { type: 'number' }
        }
      }
    }
  },
  members: {
    create: {
      tags: ['Members'],
      summary: 'Create a new member',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['name', 'email', 'status'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] }
        }
      }
    }
  },
  lendings: {
    create: {
      tags: ['Lendings'],
      summary: 'Create a new lending record',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['bookId', 'memberId'],
        properties: {
          bookId: { type: 'number' },
          memberId: { type: 'number' },
          dueDate: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  categories: {
    create: {
      tags: ['Categories'],
      summary: 'Create a new category',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' }
        }
      }
    }
  },
  analytics: {
    popularBooks: {
      tags: ['Analytics'],
      summary: 'Get popular books statistics',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              title: { type: 'string' },
              author: { type: 'string' },
              _count: {
                type: 'object',
                properties: {
                  lendings: { type: 'number' }
                }
              }
            }
          }
        }
      }
    }
  }
};

// Make schemas available globally
fastify.decorate('schemas', routeSchemas);

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
