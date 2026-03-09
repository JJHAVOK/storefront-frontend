export function getAvatarUrl(user: { firstName?: string; lastName?: string; avatarUrl?: string }) {
  if (user?.avatarUrl) {
      // 🚀 CACHE BUSTER: Forces the browser to load the new image immediately after upload
      // We check for 'window' to prevent SSR hydration errors in Next.js
      const cacheBuster = typeof window !== 'undefined' ? `?t=${new Date().getTime()}` : '';
      
      // If the URL already has a '?', append with '&', otherwise use '?'
      const separator = user.avatarUrl.includes('?') ? '&' : '?';
      return `${user.avatarUrl}${separator}t=${typeof window !== 'undefined' ? new Date().getTime() : '1'}`;
  }
  
  const name = `${user?.firstName || ''}+${user?.lastName || ''}`;
  return `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff&size=128`;
}