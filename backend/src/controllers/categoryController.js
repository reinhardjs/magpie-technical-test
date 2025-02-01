import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required')
});

export const createCategory = async (request, reply) => {
  try {
    const { name } = categorySchema.parse(request.body);

    // Check if category name already exists
    const existingCategory = await prisma.category.findFirst({
      where: { name }
    });

    if (existingCategory) {
      request.log.warn(`Duplicate category name attempted: ${name}`);
      return reply.status(400).send({ 
        error: 'A category with this name already exists' 
      });
    }

    const category = await prisma.category.create({
      data: { name }
    });

    request.log.info(`Category created: ${category.id}`);
    return reply.code(201).send(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ 
        error: error.errors[0].message 
      });
    }
    
    request.log.error({
      msg: 'Category creation failed',
      error: error.message,
      stack: error.stack
    });
    
    return reply.status(500).send({ 
      error: 'Category creation failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getAllCategories = async (request, reply) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { books: true }
        }
      }
    });
    return categories;
  } catch (error) {
    return reply.status(500).send({ error: 'Failed to retrieve categories' });
  }
};

export const getCategoryById = async (request, reply) => {
  try {
    const { id } = request.params;
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        books: true
      }
    });

    if (!category) {
      return reply.status(404).send({ error: 'Category not found' });
    }

    return category;
  } catch (error) {
    return reply.status(500).send({ error: 'Failed to retrieve category' });
  }
};

export const updateCategory = async (request, reply) => {
  try {
    const { id } = request.params;
    const { name } = request.body;

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name }
    });

    return category;
  } catch (error) {
    return reply.status(500).send({ error: 'Category update failed' });
  }
};

export const deleteCategory = async (request, reply) => {
  const { id } = request.params;

  try {
    // Check if category exists and has books
    const category = await prisma.category.findFirst({
      where: {
        id: parseInt(id),
        books: {
          some: {}
        }
      }
    });

    if (!category) {
      request.log.error(`Category not found with id: ${id}`);
      return reply.status(404).send({ error: 'Category not found' });
    }

    if (category.books.length > 0) {
      request.log.warn(`Attempted to delete category ${id} with associated books`);
      return reply.status(400).send({ 
        error: 'Cannot delete category with associated books' 
      });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) }
    });

    request.log.info(`Category ${id} deleted successfully`);
    return reply.code(204).send();
  } catch (error) {
    request.log.error({
      msg: 'Category deletion failed',
      error: error.message,
      stack: error.stack,
      categoryId: id
    });
    
    return reply.status(500).send({ 
      error: 'Category deletion failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
