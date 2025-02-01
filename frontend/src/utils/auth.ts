export type UserRole = 'ADMIN' | 'LIBRARIAN' | 'MEMBER';

export const getUserRole = (): UserRole | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).role : null;
};

export const canManageLibrary = (): boolean => {
  const role = getUserRole();
  console.log("ROLE:", role)
  return ['ADMIN', 'LIBRARIAN'].includes(role as string);
};
