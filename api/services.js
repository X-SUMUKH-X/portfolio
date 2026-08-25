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
      error: { code: 'method_not_allowed', message: 'Use GET method', resolution: 'Send GET request to /api/v1/services' },
      code: 'method_not_allowed', message: 'Use GET method', resolution: 'Send GET request to /api/v1/services'
    }), { status: 405, headers: { ...CORS, ...RATE_LIMIT_HEADERS, 'Content-Type': 'application/problem+json; charset=utf-8' } });
  }

  const services = [
    { id: '01', name: 'Branding', description: 'Visual identity, messaging, positioning frameworks and playbooks.' },
    { id: '02', name: 'Website Development', description: 'Clean, fast, responsive websites and landing pages.' },
    { id: '03', name: 'Social Media', description: 'Short-form ideas, hooks, scripts and social-first content systems.' },
    { id: '04', name: 'Content Marketing', description: 'Essays, case studies, newsletters and editorial content backed by search strategy.' },
    { id: '05', name: 'Campaign Strategy', description: 'End-to-end campaign thinking: positioning, messaging, creative direction and execution.' },
    { id: '06', name: 'Growth Consulting', description: 'Data-backed recommendations for startups and growing teams.' },
  ];

  return new Response(JSON.stringify({
    services,
    total: services.length,
    _meta: { apiBase: `${BASE}/api/v1`, docs: `${BASE}/developers` }
  }, null, 2), {
    status: 200,
    headers: { ...CORS, ...RATE_LIMIT_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Vary': 'Accept, Accept-Encoding' }
  });
}
