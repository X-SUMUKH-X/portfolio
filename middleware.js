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

  // 2. Known valid routes
  const knownRoutes = [
    '/', '/index', '/about', '/contact', '/privacy', '/developers',
    '/docs', '/api-docs', '/api', '/creative-strategy', '/slack-swiggy-hq',
    '/api/v1/info', '/api/v1/work', '/api/v1/services', '/api/v1/contact',
    '/api/info', '/api/work', '/api/services', '/api/contact', '/api/mcp',
    '/api/v1', '/.well-known/mcp'
  ];

  const isKnown = knownRoutes.includes(url.pathname);
  const isApi = url.pathname.startsWith('/api') || url.pathname.startsWith('/.well-known');

  // 3. If requesting an unknown API route, return structured JSON error
  if (isApi && !isKnown) {
    const jsonError = {
      error: {
        code: 'not_found',
        message: `The requested API endpoint '${url.pathname}' was not found.`,
        resolution: 'Check the available endpoints at /developers or /openapi.json.',
        resolution_hints: [
          `Discover public endpoints at ${url.origin}/developers`,
          `Inspect the OpenAPI specification at ${url.origin}/openapi.json`,
          `Call GET ${url.origin}/api/v1/info for portfolio data`
        ]
      },
      code: 'not_found',
      message: `The requested API endpoint '${url.pathname}' was not found.`,
      resolution: 'Check the available endpoints at /developers or /openapi.json.',
      resolution_hints: [
        `Discover public endpoints at ${url.origin}/developers`,
        `Inspect the OpenAPI specification at ${url.origin}/openapi.json`,
        `Call GET ${url.origin}/api/v1/info for portfolio data`
      ],
      type: `${url.origin}/developers#errors`,
      title: 'API Endpoint Not Found',
      status: 404,
      detail: `The route ${url.pathname} is not a registered API endpoint.`,
      instance: url.pathname
    };

    return new Response(JSON.stringify(jsonError, null, 2), {
      status: 404,
      headers: {
        'Content-Type': 'application/problem+json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'X-API-Version': '1',
        'RateLimit-Limit': '60',
        'RateLimit-Remaining': '59',
        'RateLimit-Reset': '60',
        'RateLimit-Policy': '60;w=60',
        'RateLimit': 'limit=60, remaining=59, reset=60'
      }
    });
  }

  // 4. If an agent requests application/json on any unknown route
  if (!isKnown && (accept.includes('application/json') || accept.includes('application/problem+json'))) {
    const jsonError = {
      error: {
        code: 'resource_not_found',
        message: `The requested resource '${url.pathname}' does not exist.`,
        resolution: 'Refer to /openapi.json or /llms.txt for available paths.',
        resolution_hints: [
          `See sitemap at ${url.origin}/sitemap.xml`,
          `See index at ${url.origin}/llms.txt`
        ]
      },
      code: 'resource_not_found',
      message: `The requested resource '${url.pathname}' does not exist.`,
      resolution: 'Refer to /openapi.json or /llms.txt for available paths.',
      type: `${url.origin}/developers#errors`,
      title: 'Resource Not Found',
      status: 404,
      detail: `Path ${url.pathname} does not exist.`,
      instance: url.pathname
    };

    return new Response(JSON.stringify(jsonError, null, 2), {
      status: 404,
      headers: {
        'Content-Type': 'application/problem+json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Vary': 'Accept, Accept-Encoding'
      }
    });
  }

  // 5. If requesting markdown on an unknown route
  if (!isKnown && accept.includes('text/markdown')) {
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
