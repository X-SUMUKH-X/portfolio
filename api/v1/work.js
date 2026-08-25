export const config = { runtime: 'edge' };

const BASE = 'https://sumukh-portfolio-seven.vercel.app';
const API_VERSION = '1';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, X-API-Version',
};

const RATE_LIMIT_HEADERS = {
  'RateLimit-Limit': '60',
  'RateLimit-Remaining': '59',
  'RateLimit-Reset': '60',
  'RateLimit-Policy': '60;w=60',
  'RateLimit': 'limit=60, remaining=59, reset=60',
  'X-RateLimit-Limit': '60',
  'X-RateLimit-Remaining': '59',
  'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 60),
  'X-API-Version': API_VERSION,
  'Sunset': 'Sat, 25 Aug 2029 00:00:00 GMT',
  'Deprecation': '@1882310400',
  'Link': `<${BASE}/developers#deprecation>; rel="deprecation", <${BASE}/developers#sunset>; rel="sunset"`,
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({
      error: { code: 'method_not_allowed', message: 'Use GET method', resolution: 'Send GET request to /api/v1/work' },
      code: 'method_not_allowed', message: 'Use GET method', resolution: 'Send GET request to /api/v1/work'
    }), { status: 405, headers: { ...CORS, ...RATE_LIMIT_HEADERS, 'Content-Type': 'application/problem+json; charset=utf-8' } });
  }

  const url = new URL(req.url);
  const category = url.searchParams.get('category');

  const work = [
    { id: '01', project: 'Fokus App Short-Form System', category: 'short-form', result: '2.1M views in 24 hours', description: 'Hook-first scripts and content system for a productivity app targeting Gen Z.' },
    { id: '02', project: 'Swiggy Instamart Campaign', category: 'campaign', result: '2.1M organic views', description: 'Viral short-form campaign making Swiggy Instamart culturally relevant beyond grocery delivery.' },
    { id: '03', project: 'Slack × Swiggy HQ', category: 'brand', result: 'Brand partnership creative direction', description: 'Positioned Slack as the operational backbone of Swiggy internal culture.' },
    { id: '04', project: 'Josh Talks AI Redesign', category: 'ux', result: 'Editorial UX redesign', description: 'Landing page redesign to feel authoritative and editorially credible.' },
    { id: '05', project: 'Launchverse Product Launch', category: 'launch', result: 'Multi-brand launch strategy and execution', description: 'Coordinated multi-brand product launch across social, content, and distribution channels.' },
    { id: '06', project: 'Blinkit Metrics Dashboard', category: 'analytics', result: '₹1.2M in sales data analyzed', description: 'Power BI dashboard structured around decision-relevant metrics.' },
  ];

  const items = category ? work.filter(w => w.category === category) : work;

  return new Response(JSON.stringify({
    selectedWork: items,
    total: items.length,
    _meta: { apiBase: `${BASE}/api/v1`, docs: `${BASE}/developers` }
  }, null, 2), {
    status: 200,
    headers: { ...CORS, ...RATE_LIMIT_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Vary': 'Accept, Accept-Encoding' }
  });
}
