export function getAvatarUrl(user: { firstName?: string; lastName?: string; avatarUrl?: string }) {
  if (user?.avatarUrl) {
      let url = user.avatarUrl;
      
      // If the backend returns a relative path (e.g., /uploads/avatar-123.png)
      // Force it to use the full API domain so Next.js doesn't block it
      if (url.startsWith('/')) {
          url = `https://api.pixelforgedeveloper.com${url}`;
      }
      
      // Safe cache-buster
      const cacheBuster = typeof window !== 'undefined' ? `t=${new Date().getTime()}` : '1';
      const separator = url.includes('?') ? '&' : '?';
      
      return `${url}${separator}${cacheBuster}`;
  }
  
  const name = `${user?.firstName || ''}+${user?.lastName || ''}`;
  return `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff&size=128`;
}