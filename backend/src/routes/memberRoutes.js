import { 
  createMember, 
  getAllMembers, 
  getMemberById, 
  updateMember, 
  deleteMember 
} from '../controllers/memberController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

export default async function memberRoutes(fastify, opts) {

  const memberSchema = {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' },
        status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] }
      },
      required: ['name', 'email', 'status']
    }
  };

  // Add authentication hook to all routes
  fastify.addHook('preHandler', authenticate);

  // Create a new member (Admin/Librarian only)
  fastify.post('/',
    {
      schema: memberSchema,
      preHandler: [
        authorize(['ADMIN', 'LIBRARIAN'])
      ]
    },
    createMember
  );

  // Get all members (Admin/Librarian only)
  fastify.get('/',
    { preHandler: authorize(['ADMIN', 'LIBRARIAN']) },
    getAllMembers
  );

  // Get member by ID (Admin/Librarian only)
  fastify.get('/:id',
    { preHandler: authorize(['ADMIN', 'LIBRARIAN']) },
    getMemberById
  );

  // Update a member (Admin/Librarian only)
  fastify.put('/:id',
    {
      schema: memberSchema,
      preHandler: [
        authorize(['ADMIN', 'LIBRARIAN'])
      ]
    },
    updateMember
  );

  // Delete a member (Admin/Librarian only)
  fastify.delete('/:id',
    { preHandler: authorize(['ADMIN', 'LIBRARIAN']) },
    deleteMember
  );
}
