/**
 * Vercel Edge Middleware — Markdown Content Negotiation & Agent-Friendly Error Handling
 */

export const config = {
  matcher: ['/((?!_next|assets|.*\\..*).*)', '/', '/api/:path*'],
};

export default async function middleware(req) {
  const url = new URL(req.url);
  const accept = req.headers.get('accept') ?? '';

  // 1. If requesting markdown on homepage
  if ((url.pathname === '/' || url.pathname === '/index.html') && accept.includes('text/markdown')) {
    const mdUrl = new URL('/llms-full.txt', url.origin);
    try {
      const mdRes = await fetch(mdUrl.toString());
      const text = await mdRes.text();
      return new Response(text, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Vary': 'Accept, Accept-Encoding',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch {
      return;
    }
  }

  // 2. If requesting markdown on an unknown non-API route
  const knownRoutes = ['/', '/about', '/contact', '/privacy', '/developers', '/docs', '/api', '/creative-strategy', '/slack-swiggy-hq'];
  const isApi = url.pathname.startsWith('/api');
  
  if (!isApi && !knownRoutes.includes(url.pathname) && accept.includes('text/markdown')) {
    const md404 = `# 404 — Not Found

The requested resource \`${url.pathname}\` was not found.

## Recovery Links
- Homepage: ${url.origin}/
- Portfolio Index (llms.txt): ${url.origin}/llms.txt
- Developer Portal: ${url.origin}/developers
- OpenAPI 3.1 Spec: ${url.origin}/openapi.json
- Sitemap: ${url.origin}/sitemap.xml
- Contact: sumukh.workk@gmail.com
`;
    return new Response(md404, {
      status: 404,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Vary': 'Accept, Accept-Encoding',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  return;
}
