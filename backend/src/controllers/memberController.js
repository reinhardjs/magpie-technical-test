import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create a new member
export const createMember = async (request, reply) => {
  try {
    const { name, email, phone, status } = request.body;
    const userId = request.user.id;

    const member = await prisma.member.create({
      data: {
        name,
        email,
        phone,
        status,
        joinedDate: new Date(),
        userId
      }
    });

    return reply.code(201).send(member);
  } catch (error) {
    return reply.status(500).send({ error: 'Member creation failed' });
  }
};

// Get all members
export const getAllMembers = async (request, reply) => {
  try {
    const members = await prisma.member.findMany({
      include: {
        lendings: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    return members;
  } catch (error) {
    return reply.status(500).send({ error: 'Failed to retrieve members' });
  }
};

// Get member by ID
export const getMemberById = async (request, reply) => {
  try {
    const { id } = request.params;
    const member = await prisma.member.findUnique({
      where: { id: parseInt(id) },
      include: {
        lendings: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!member) {
      return reply.status(404).send({ error: 'Member not found' });
    }

    return member;
  } catch (error) {
    return reply.status(500).send({ error: 'Failed to retrieve member' });
  }
};

// Update member
export const updateMember = async (request, reply) => {
  try {
    const { id } = request.params;
    const { name, email, phone, status } = request.body;

    const member = await prisma.member.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phone,
        status
      }
    });

    return member;
  } catch (error) {
    return reply.status(500).send({ error: 'Member update failed' });
  }
};

// Delete member
export const deleteMember = async (request, reply) => {
  try {
    const { id } = request.params;

    // Check for active lendings
    const activeLendings = await prisma.lending.findFirst({
      where: {
        memberId: parseInt(id),
        status: 'ACTIVE'
      }
    });

    if (activeLendings) {
      return reply.status(400).send({ 
        error: 'Cannot delete member with active lendings' 
      });
    }

    await prisma.member.delete({
      where: { id: parseInt(id) }
    });

    return reply.code(204).send();
  } catch (error) {
    return reply.status(500).send({ error: 'Member deletion failed' });
  }
};
