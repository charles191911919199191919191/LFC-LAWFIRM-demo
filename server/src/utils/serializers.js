export function serializeUser(user) {
  if (!user) return null;
  const safeUser = { ...user };
  delete safeUser.passwordHash;
  return {
    ...safeUser,
    role: user.role
      ? {
          id: user.role.id,
          slug: user.role.slug,
          name: user.role.name
        }
      : undefined
  };
}

export function clientUserSelect() {
  return {
    id: true,
    name: true,
    email: true,
    phone: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    role: true,
    lawyerProfile: true
  };
}
