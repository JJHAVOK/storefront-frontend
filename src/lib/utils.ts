export function getAvatarUrl(user: { firstName?: string; lastName?: string; avatarUrl?: string }) {
  if (user?.avatarUrl) return user.avatarUrl;
  
  const name = `${user?.firstName || ''}+${user?.lastName || ''}`;
  // Fixed color: 0D8ABC (Blue), Text: FFF (White), Size: 128
  return `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff&size=128`;
}
