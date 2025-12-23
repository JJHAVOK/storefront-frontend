import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://pixelforgedeveloper.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account/', '/checkout/', '/auth/'], // Keep bots out of private areas
    },
    sitemap: `${baseUrl}/sitemap.xml`, // Points Google to the map
  };
}
