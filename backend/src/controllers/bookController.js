import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema
const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().min(1, 'ISBN is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  categoryId: z.number().positive('Category is required')
});

export const createBook = async (request, reply) => {
  try {
    const { title, author, isbn, quantity, categoryId } = bookSchema.parse(request.body);
    const createdBy = request.user.id;

    // Check if ISBN already exists
    const existingBook = await prisma.book.findFirst({
      where: { isbn }
    });

    if (existingBook) {
      return reply.status(400).send({ 
        error: 'A book with this ISBN already exists' 
      });
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return reply.status(400).send({ 
        error: 'Selected category does not exist' 
      });
    }

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

    return reply.code(201).send(book);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ 
        error: error.errors[0].message 
      });
    }
    
    request.log.error(error);
    return reply.status(500).send({ 
      error: 'Book creation failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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

export const getBookById = async (request, reply) => {
  const { id } = request.params;
  
  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        status: true,
        _count: {
          select: { lendings: true }
        }
      }
    });

    if (!book) {
      return reply.status(404).send({ error: 'Book not found' });
    }

    return book;
  } catch (error) {
    return reply.status(500).send({ error: 'Failed to retrieve book' });
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

export const deleteBook = async (request, reply) => {
  const { id } = request.params;

  try {
    // Check if book exists and has active lendings
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
      include: {
        lendings: {
          where: { status: 'ACTIVE' }
        },
        status: true
      }
    });

    if (!book) {
      request.log.error(`Book not found with id: ${id}`);
      return reply.status(404).send({ error: 'Book not found' });
    }

    if (book.lendings.length > 0) {
      request.log.error(`Cannot delete book ${id} - has active lendings`);
      return reply.status(400).send({ 
        error: 'Cannot delete book with active lendings' 
      });
    }

    // Delete in correct order due to foreign key constraints
    if (book.status) {
      await prisma.bookStatus.delete({
        where: { bookId: parseInt(id) }
      });
    }

    await prisma.book.delete({
      where: { id: parseInt(id) }
    });

    request.log.info(`Book ${id} deleted successfully`);
    return reply.code(204).send();
  } catch (error) {
    request.log.error({
      msg: 'Book deletion failed',
      error: error.message,
      stack: error.stack,
      bookId: id
    });
    
    return reply.status(500).send({ 
      error: 'Book deletion failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
