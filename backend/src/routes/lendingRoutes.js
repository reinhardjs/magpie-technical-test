import { 
  createLending, 
  getAllLendings, 
  getLendingById, 
  returnBook, 
  updateLending 
} from '../controllers/lendingController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

export default async function lendingRoutes(fastify, opts) {

  const lendingSchema = {
    body: {
      type: 'object',
      properties: {
        bookId: { type: 'number' },
        memberId: { type: 'number' },
        dueDate: { type: 'string', format: 'date-time' }
      },
      required: ['bookId', 'memberId']
    }
  };

  // Add authentication hook to all routes
  fastify.addHook('preHandler', authenticate);

  // Create a new lending record (Admin/Librarian only)
  fastify.post('/',
    {
      schema: lendingSchema,
      preHandler: [
        authorize(['ADMIN', 'LIBRARIAN'])
      ]
    },
    createLending
  );

  // Get all lending records (Admin/Librarian only)
  fastify.get('/',
    { preHandler: authorize(['ADMIN', 'LIBRARIAN']) },
    getAllLendings
  );

  // Get lending record by ID (Admin/Librarian only)
  fastify.get('/:id',
    { preHandler: authorize(['ADMIN', 'LIBRARIAN']) },
    getLendingById
  );

  // Return a book (Admin/Librarian only)
  fastify.put('/:id/return',
    { preHandler: authorize(['ADMIN', 'LIBRARIAN']) },
    returnBook
  );

  // Update a lending record (Admin/Librarian only)
  fastify.put('/:id',
    {
      schema: lendingSchema,
      preHandler: [
        authorize(['ADMIN', 'LIBRARIAN'])
      ]
    },
    updateLending
  );
}
