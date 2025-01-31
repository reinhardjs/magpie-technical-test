import { 
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

export default async function categoryRoutes(fastify, opts) {
  const categorySchema = {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' }
      },
      required: ['name']
    }
  };

  // Add authentication hook to all routes
  fastify.addHook('preHandler', authenticate);

  // Create a new category (Admin/Librarian only)
  fastify.post('/',
    {
      schema: categorySchema,
      preHandler: [
        authorize(['ADMIN', 'LIBRARIAN']),
      ]
    },
    createCategory
  );

  // Get all categories (All authenticated users)
  fastify.get('/',
    { preHandler: authorize(['ADMIN', 'LIBRARIAN', 'MEMBER']) },
    getAllCategories
  );

  // Get category by ID (All authenticated users)
  fastify.get('/:id',
    { preHandler: authorize(['ADMIN', 'LIBRARIAN', 'MEMBER']) },
    getCategoryById
  );

  // Update a category (Admin/Librarian only)
  fastify.put('/:id',
    {
      schema: categorySchema,
      preHandler: [
        authorize(['ADMIN', 'LIBRARIAN'])
      ]
    },
    updateCategory
  );

  // Delete a category (Admin/Librarian only)
  fastify.delete('/:id',
    { preHandler: authorize(['ADMIN', 'LIBRARIAN']) },
    deleteCategory
  );
}
