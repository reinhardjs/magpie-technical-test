import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getAllBooks, getBookById, updateBook } from '../../controllers/bookController';
import { prisma } from '../../lib/prisma';

// Mock Prisma
vi.mock('../../lib/prisma', () => ({
  prisma: {
    book: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn()
    }
  }
}));

describe('Book Controller', () => {
  const mockReply = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllBooks', () => {
    it('should return all books with their relations', async () => {
      const mockBooks = [
        {
          id: 1,
          title: 'Test Book',
          author: 'Test Author',
          category: { name: 'Fiction' },
          status: { availableQty: 5 }
        }
      ];

      prisma.book.findMany.mockResolvedValue(mockBooks);

      const result = await getAllBooks({}, mockReply);

      expect(result).toEqual(mockBooks);
      expect(prisma.book.findMany).toHaveBeenCalledWith({
        include: {
          category: true,
          status: true,
          _count: {
            select: { lendings: true }
          }
        }
      });
    });

    it('should handle errors properly', async () => {
      prisma.book.findMany.mockRejectedValue(new Error('Database error'));

      await getAllBooks({}, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({ 
        error: 'Failed to retrieve books' 
      });
    });
  });

  describe('getBookById', () => {
    const mockRequest = {
      params: { id: '1' }
    };

    it('should return a book by id', async () => {
      const mockBook = {
        id: 1,
        title: 'Test Book',
        author: 'Test Author'
      };

      prisma.book.findUnique.mockResolvedValue(mockBook);

      const result = await getBookById(mockRequest, mockReply);

      expect(result).toEqual(mockBook);
    });

    it('should return 404 when book not found', async () => {
      prisma.book.findUnique.mockResolvedValue(null);

      await getBookById(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({ 
        error: 'Book not found' 
      });
    });
  });
}); 