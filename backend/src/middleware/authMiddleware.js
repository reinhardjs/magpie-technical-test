import jwt from 'jsonwebtoken';

export const authenticate = async (request, reply) => {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      return reply.status(401).send({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded;
  } catch (error) {
    return reply.status(401).send({ error: 'Invalid token' });
  }
};

export const authorize = (roles = []) => {
  return (request, reply, done) => {
    if (!roles.includes(request.user.role)) {
      return reply.status(403).send({ error: 'Unauthorized access' });
    }
    done();
  };
};
