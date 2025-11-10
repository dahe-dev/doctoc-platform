export const cleanDisplayName = (
  displayName: string | null | undefined,
): string => {
  if (!displayName) return 'Usuario';

  const pipeIndex = displayName.indexOf('|pid:');
  if (pipeIndex !== -1) {
    return displayName.substring(0, pipeIndex).trim();
  }

  return displayName.trim();
};

export const extractUserId = (
  displayName: string | null | undefined,
): string | null => {
  if (!displayName) return null;

  const pipeIndex = displayName.indexOf('|pid:');
  if (pipeIndex !== -1) {
    return displayName.substring(pipeIndex + 5).trim();
  }

  return null;
};

export const getUserInitials = (name: string): string => {
  if (!name) return 'U';

  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};
