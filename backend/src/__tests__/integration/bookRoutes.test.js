import { build } from '../../app';
import { prisma } from '../../lib/prisma';
import { createToken } from '../../utils/jwt';

describe('Book Routes Integration', () => {
  let app;
  let adminToken;
  let memberToken;

  beforeAll(async () => {
    app = await build();
    adminToken = createToken({ id: 1, role: 'ADMIN' });
    memberToken = createToken({ id: 2, role: 'MEMBER' });
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.book.deleteMany();
  });

  describe('GET /api/books', () => {
    it('should allow MEMBER to get all books', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/books',
        headers: {
          Authorization: `Bearer ${memberToken}`
        }
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toBeInstanceOf(Array);
    });

    it('should return 401 without token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/books'
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /api/books', () => {
    const newBook = {
      title: 'Test Book',
      author: 'Test Author',
      isbn: '1234567890',
      quantity: 5,
      categoryId: 1
    };

    it('should allow ADMIN to create a book', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/books',
        headers: {
          Authorization: `Bearer ${adminToken}`
        },
        payload: newBook
      });

      expect(response.statusCode).toBe(201);
      expect(JSON.parse(response.payload)).toMatchObject({
        title: newBook.title,
        author: newBook.author
      });
    });

    it('should not allow MEMBER to create a book', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/books',
        headers: {
          Authorization: `Bearer ${memberToken}`
        },
        payload: newBook
      });

      expect(response.statusCode).toBe(403);
    });
  });
}); 