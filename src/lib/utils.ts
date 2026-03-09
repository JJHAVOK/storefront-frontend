export function getAvatarUrl(user: { firstName?: string; lastName?: string; avatarUrl?: string }) {
  if (user?.avatarUrl) {
      let url = user.avatarUrl;
      
      // Force it to use the API domain if the backend returns a relative path
      if (url.startsWith('/')) {
          url = `https://api.pixelforgedeveloper.com${url}`;
      }
      
      // Removed the cache-buster ?t= so Nginx/CloudPanel doesn't block the file request
      return url;
  }
  
  const name = `${user?.firstName || ''}+${user?.lastName || ''}`;
  return `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff&size=128`;
}