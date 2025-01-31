import { register, login } from '../controllers/authController.js';

export default async function authRoutes(fastify, opts) {

  const registerSchema = {
    tags: ['Auth'],
    summary: 'Register a new user',
    body: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
        name: { type: 'string' },
        role: { type: 'string', enum: ['ADMIN', 'LIBRARIAN', 'MEMBER'] }
      },
      required: ['email', 'password', 'name', 'role']
    },
    response: {
      201: {
        description: 'Successful registration',
        type: 'object',
        properties: {
          message: { type: 'string' },
          userId: { type: 'integer' }
        }
      }
    }
  };

  const loginSchema = {
    tags: ['Auth'],
    summary: 'Login to get access token',
    body: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' }
      },
      required: ['email', 'password']
    },
    response: {
      200: {
        description: 'Successful login',
        type: 'object',
        properties: {
          token: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              email: { type: 'string' },
              role: { type: 'string' }
            }
          }
        }
      }
    }
  };

  fastify.post('/register',
    { schema: registerSchema },
    register
  );

  fastify.post('/login',
    { schema: loginSchema },
    login
  );
}
