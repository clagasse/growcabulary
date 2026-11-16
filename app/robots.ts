import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/curator', '/api/'],
    },
    sitemap: 'https://growcabulary.com/sitemap.xml',
  };
}
