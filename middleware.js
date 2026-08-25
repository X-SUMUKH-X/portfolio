/**
 * Vercel Edge Middleware — Markdown Content Negotiation
 *
 * When a request arrives with Accept: text/markdown, serve the
 * llms-full.txt content with:
 *   Content-Type: text/markdown; charset=utf-8
 *   Vary: Accept, Accept-Encoding
 *
 * This satisfies acceptmarkdown.com compliance (#4 in the agentic audit).
 * Only applies to the homepage (/). Other routes pass through unchanged.
 */

export const config = {
  matcher: ['/', '/index.html'],
};

export default async function middleware(req) {
  const accept = req.headers.get('accept') ?? '';

  // Only intercept when markdown is explicitly preferred
  if (!accept.includes('text/markdown')) {
    return; // pass through — next() equivalent in Vercel Edge Middleware
  }

  const url = new URL(req.url);
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
    // If fetch fails, fall through to normal response
    return;
  }
}
