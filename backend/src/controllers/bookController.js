import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createBook = async (request, reply) => {
  const { title, author, isbn, quantity, categoryId } = request.body;
  const createdBy = request.user.id;

  try {
    const book = await prisma.book.create({
      data: {
        title,
        author,
        isbn,
        quantity,
        categoryId,
        createdBy,
        status: {
          create: {
            availableQty: quantity,
            borrowedQty: 0
          }
        }
      }
    });

    return book;
  } catch (error) {
    return reply.status(500).send({ error: 'Book creation failed' });
  }
};

export const getAllBooks = async (request, reply) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        category: true,
        status: true,
        _count: {
          select: { lendings: true }
        }
      }
    });
    return books;
  } catch (error) {
    return reply.status(500).send({ error: 'Failed to retrieve books' });
  }
};

export const updateBook = async (request, reply) => {
  const { id } = request.params;
  const { title, author, isbn, quantity, categoryId } = request.body;

  try {
    const book = await prisma.book.update({
      where: { id: parseInt(id) },
      data: { title, author, isbn, quantity, categoryId }
    });

    return book;
  } catch (error) {
    return reply.status(500).send({ error: 'Book update failed' });
  }
};
