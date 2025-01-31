import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createLending = async (request, reply) => {
  const { bookId, memberId } = request.body;
  const createdBy = request.user.id;

  try {
    // Check book availability
    const bookStatus = await prisma.bookStatus.findUnique({
      where: { bookId: parseInt(bookId) }
    });

    if (!bookStatus || bookStatus.availableQty <= 0) {
      return reply.status(400).send({ error: 'Book not available' });
    }

    // Create lending record
    const lending = await prisma.lending.create({
      data: {
        bookId: parseInt(bookId),
        memberId: parseInt(memberId),
        borrowedDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        status: 'ACTIVE',
        createdBy
      }
    });

    // Update book status
    await prisma.bookStatus.update({
      where: { bookId: parseInt(bookId) },
      data: {
        availableQty: { decrement: 1 },
        borrowedQty: { increment: 1 }
      }
    });

    return lending;
  } catch (error) {
    return reply.status(500).send({ error: 'Lending creation failed' });
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
