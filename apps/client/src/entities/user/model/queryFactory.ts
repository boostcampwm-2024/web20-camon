export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  profileImage: () => [...userKeys.all, 'profile-image'] as const,
};
