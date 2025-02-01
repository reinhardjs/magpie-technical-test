import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const lendingSchema = z.object({
  bookId: z.number().positive('Book ID is required'),
  memberId: z.number().positive('Member ID is required')
});

export const createLending = async (request, reply) => {
  try {
    const { bookId, memberId } = lendingSchema.parse(request.body);
    const createdBy = request.user.id;

    // Check book availability
    const bookStatus = await prisma.bookStatus.findUnique({
      where: { bookId: parseInt(bookId) },
      include: { book: true }
    });

    if (!bookStatus || bookStatus.availableQty <= 0) {
      request.log.warn(`Attempted to lend unavailable book: ${bookId}`);
      return reply.status(400).send({ error: 'Book not available for lending' });
    }

    // Check member exists and is active
    const member = await prisma.member.findUnique({
      where: { id: parseInt(memberId) }
    });

    if (!member || member.status !== 'ACTIVE') {
      request.log.warn(`Attempted to lend to inactive/nonexistent member: ${memberId}`);
      return reply.status(400).send({ error: 'Member is not active or does not exist' });
    }

    const lending = await prisma.$transaction(async (prisma) => {
      const lending = await prisma.lending.create({
        data: {
          bookId: parseInt(bookId),
          memberId: parseInt(memberId),
          borrowedDate: new Date(),
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          status: 'ACTIVE',
          createdBy
        }
      });

      await prisma.bookStatus.update({
        where: { bookId: parseInt(bookId) },
        data: {
          availableQty: { decrement: 1 },
          borrowedQty: { increment: 1 }
        }
      });

      return lending;
    });

    request.log.info(`Lending created: ${lending.id}`);
    return reply.code(201).send(lending);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ 
        error: error.errors[0].message 
      });
    }
    
    request.log.error({
      msg: 'Lending creation failed',
      error: error.message,
      stack: error.stack
    });
    
    return reply.status(500).send({ 
      error: 'Lending creation failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const returnBook = async (request, reply) => {
  const { id } = request.params;

  try {
    const lending = await prisma.lending.update({
      where: { id: parseInt(id) },
      data: {
        returnDate: new Date(),
        status: 'RETURNED'
      }
    });

    // Update book status
    await prisma.bookStatus.update({
      where: { bookId: lending.bookId },
      data: {
        availableQty: { increment: 1 },
        borrowedQty: { decrement: 1 }
      }
    });

    return lending;
  } catch (error) {
    return reply.status(500).send({ error: 'Book return failed' });
  }
};

export const getAllLendings = async (request, reply) => {
  try {
    const lendings = await prisma.lending.findMany({
      include: {
        book: true,
        member: true,
        creator: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    return lendings;
  } catch (error) {
    return reply.status(500).send({ error: 'Failed to retrieve lendings' });
  }
};

export const getLendingById = async (request, reply) => {
  try {
    const { id } = request.params;
    const lending = await prisma.lending.findUnique({
      where: { id: parseInt(id) },
      include: {
        book: true,
        member: true,
        creator: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!lending) {
      return reply.status(404).send({ error: 'Lending record not found' });
    }

    return lending;
  } catch (error) {
    return reply.status(500).send({ error: 'Failed to retrieve lending record' });
  }
};

export const updateLending = async (request, reply) => {
  try {
    const { id } = request.params;
    const { dueDate } = request.body;

    const lending = await prisma.lending.update({
      where: { id: parseInt(id) },
      data: {
        dueDate: new Date(dueDate)
      }
    });

    return lending;
  } catch (error) {
    return reply.status(500).send({ error: 'Lending update failed' });
  }
};
