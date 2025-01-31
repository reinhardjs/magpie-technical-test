import { 
  createBook, 
  getAllBooks, 
  updateBook,
} from '../controllers/bookController.js';

import { authenticate, authorize } from '../middleware/authMiddleware.js';

export default async function bookRoutes(fastify, opts) {

  const bookSchema = {
    body: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        author: { type: 'string' },
        isbn: { type: 'string' },
        quantity: { type: 'number', minimum: 1 },
        categoryId: { type: 'number' }
      },
      required: ['title', 'author', 'isbn', 'quantity', 'categoryId']
    }
  };

  // Add authentication hook to all routes
  fastify.addHook('preHandler', authenticate);

  // Create a new book (Admin/Librarian only)
  fastify.post('/', 
    { 
      schema: bookSchema, 
      preHandler: [
        authorize(['ADMIN', 'LIBRARIAN'])
      ] 
    }, 
    createBook
  );

  // Get all books (All authenticated users)
  fastify.get('/', 
    { preHandler: authorize(['ADMIN', 'LIBRARIAN', 'MEMBER']) }, 
    getAllBooks
  );

  // Update a book (Admin/Librarian only)
  fastify.put('/:id', 
    { 
      schema: bookSchema, 
      preHandler: [
        authorize(['ADMIN', 'LIBRARIAN'])
      ] 
    }, 
    updateBook
  );
}