import { Metadata } from 'next';

// 🚀 PRODUCTION CONFIG
// Internal Docker Network URL (Fast & Secure)
const INTERNAL_API = 'http://pf_backend:3003'; 

const DEFAULT_METADATA: Metadata = {
  title: 'PixelForge | Enterprise Web Solutions',
  description: 'Expert Full-Stack Development, ERP Systems, and Digital Transformation.',
  openGraph: {
    type: 'website',
    siteName: 'PixelForge',
  },
};

export async function getSeoMetadata(path: string): Promise<Metadata> {
  try {
    // ⚡ PRODUCTION MODE: Caching Enabled (60s)
    const res = await fetch(`${INTERNAL_API}/seo/meta?path=${encodeURIComponent(path)}`, { 
        next: { revalidate: 60 } 
    });
    
    if (!res.ok) {
        return DEFAULT_METADATA;
    }

    const data = await res.json();

    return {
      title: data.title,
      description: data.description,
      keywords: data.keywords,
      openGraph: {
        title: data.title,
        description: data.description,
        images: data.ogImage ? [{ url: data.ogImage }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: data.title,
        description: data.description,
        images: data.ogImage ? [data.ogImage] : [],
      },
      robots: {
        index: !data.noIndex,
        follow: !data.noIndex,
      }
    };
  } catch (e) {
    // Silent fail to default in production to avoid crashing the page
    console.error('SEO Fetch Warning:', e);
    return DEFAULT_METADATA;
  }
}