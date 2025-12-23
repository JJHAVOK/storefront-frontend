import { MetadataRoute } from 'next';

// 🚀 Use Internal Network for Speed
const INTERNAL_API = 'http://pf_backend:3003';
const EXTERNAL_URL = 'https://pixelforgedeveloper.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Routes (The main pages we know exist)
  const routes = [
    '',
    '/about',
    '/services',
    '/solutions',
    '/projects',
    '/store',
    '/contact',
    '/support',
    '/knowledge-base',
  ].map((route) => ({
    url: `${EXTERNAL_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Dynamic Products (Fetch from DB)
  let products = [];
  try {
    const res = await fetch(`${INTERNAL_API}/ecommerce/products`, { next: { revalidate: 3600 } });
    if (res.ok) {
        const data = await res.json();
        // Assuming products have a 'slug' or 'id'. Using ID for now based on your API.
        // Ideally, we add a 'slug' field to products later for cleaner URLs.
        products = data.map((product: any) => ({
            url: `${EXTERNAL_URL}/store/${product.id}`,
            lastModified: new Date(product.updatedAt || new Date()),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        }));
    }
  } catch (e) {
    console.error('Failed to generate product sitemap', e);
  }

  // 3. Dynamic Knowledge Base Articles
  let articles = [];
  try {
    const res = await fetch(`${INTERNAL_API}/knowledge-base/articles`, { next: { revalidate: 3600 } });
    if (res.ok) {
        const data = await res.json();
        articles = data.map((article: any) => ({
            url: `${EXTERNAL_URL}/knowledge-base/${article.slug}`,
            lastModified: new Date(article.updatedAt || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));
    }
  } catch (e) {
    // Silent fail if endpoint doesn't exist yet
  }

  return [...routes, ...products, ...articles];
}
