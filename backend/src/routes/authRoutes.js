import { register, login } from '../controllers/authController.js';

export default async function authRoutes(fastify, opts) {

  const registerSchema = {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
        name: { type: 'string' },
        role: { type: 'string', enum: ['ADMIN', 'LIBRARIAN', 'MEMBER'] }
      },
      required: ['email', 'password', 'name', 'role']
    }
  };

  const loginSchema = {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' }
      },
      required: ['email', 'password']
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
