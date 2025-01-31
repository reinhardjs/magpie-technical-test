import { getPopularBooks, getLendingTrends } from '../controllers/analyticsController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

export default async function analyticsRoutes(fastify, opts) {
  // Add authentication hook to all routes
  fastify.addHook('preHandler', authenticate);

  // Get popular books (Admin/Librarian only)
  fastify.get('/popular-books',
    { preHandler: authorize(['ADMIN', 'LIBRARIAN']) },
    getPopularBooks
  );

  // Get lending trends (Admin/Librarian only)
  fastify.get('/lending-trends',
    { preHandler: authorize(['ADMIN', 'LIBRARIAN']) },
    getLendingTrends
  );
}
