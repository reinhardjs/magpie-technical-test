import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createCategory = async (request, reply) => {
  try {
    const { name } = request.body;
    const category = await prisma.category.create({
      data: { name }
    });
    return reply.code(201).send(category);
  } catch (error) {
    return reply.status(500).send({ error: 'Category creation failed' });
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
  try {
    const { id } = request.params;

    // Check if category has books
    const categoryWithBooks = await prisma.category.findFirst({
      where: {
        id: parseInt(id),
        books: {
          some: {}
        }
      }
    });

    if (categoryWithBooks) {
      return reply.status(400).send({ 
        error: 'Cannot delete category with associated books' 
      });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) }
    });

    return reply.code(204).send();
  } catch (error) {
    return reply.status(500).send({ error: 'Category deletion failed' });
  }
}; 