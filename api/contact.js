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
      error: { code: 'method_not_allowed', message: 'Use GET method', resolution: 'Send GET request to /api/v1/contact' },
      code: 'method_not_allowed', message: 'Use GET method', resolution: 'Send GET request to /api/v1/contact'
    }), { status: 405, headers: { ...CORS, ...RATE_LIMIT_HEADERS, 'Content-Type': 'application/problem+json; charset=utf-8' } });
  }

  return new Response(JSON.stringify({
    contact: {
      name: 'Sumukh Singh',
      role: 'Creative Strategist & Content Marketer',
      email: 'sumukh.workk@gmail.com',
      website: BASE,
      location: 'Delhi, India',
      preferredMethod: 'Email',
      availability: 'Open to freelance and consulting engagements',
      note: 'Available for campaign strategy, content systems, short-form video, websites, and growth consulting.'
    },
    _meta: { apiBase: `${BASE}/api/v1`, docs: `${BASE}/developers` }
  }, null, 2), {
    status: 200,
    headers: { ...CORS, ...RATE_LIMIT_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Vary': 'Accept, Accept-Encoding' }
  });
}
