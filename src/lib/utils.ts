export function getAvatarUrl(user: { firstName?: string; lastName?: string; avatarUrl?: string }) {
  if (user?.avatarUrl) {
      if (user.avatarUrl.startsWith('/')) {
          return `https://api.pixelforgedeveloper.com${user.avatarUrl}`;
      }
      return user.avatarUrl;
  }
  const name = `${user?.firstName || ''}+${user?.lastName || ''}`;
  return `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff&size=128`;
}