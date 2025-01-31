export const getPopularBooks = async (request, reply) => {
  try {
    const popularBooks = await prisma.book.findMany({
      include: {
        _count: {
          select: { lendings: true }
        }
      },
      orderBy: {
        lendings: {
          _count: 'desc'
        }
      },
      take: 10
    });

    return popularBooks;
  } catch (error) {
    return reply.status(500).send({ error: 'Failed to retrieve popular books' });
  }
};

export const getLendingTrends = async (request, reply) => {
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    const lendingTrends = await prisma.lending.groupBy({
      by: ['borrowedDate'],
      _count: { id: true },
      orderBy: { borrowedDate: 'asc' },
      where: {
        borrowedDate: { gte: startDate }
      }
    });

    return lendingTrends;
  } catch (error) {
    return reply.status(500).send({ error: 'Failed to retrieve lending trends' });
  }
};
