import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (request, reply) => {
  const { email, password, name, role } = request.body;

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.status(400).send({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role
      }
    });

    return { message: 'User registered successfully', userId: user.id };
  } catch (error) {
    console.error('Registration error:', error);
    return reply.status(500).send({ 
      error: 'Registration failed',
      details: error.message 
    });
  }
};

export const login = async (request, reply) => {
  const { email, password } = request.body;

  try {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(400).send({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return reply.status(400).send({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token, user: { id: user.id, email: user.email, role: user.role } };
  } catch (error) {
    console.error('Login error:', error);
    return reply.status(500).send({ 
      error: 'Login failed',
      details: error.message
    });
  }
};
