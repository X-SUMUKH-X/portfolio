/**
 * Sumukh Singh Portfolio — Info API
 * Route: GET /api/v1/info
 * Returns structured JSON describing the portfolio.
 * Includes rate-limit headers (RFC draft), versioning, and problem+json errors.
 */

export const config = { runtime: 'edge' };

const BASE = 'https://sumukh-portfolio-seven.vercel.app';
const API_VERSION = '1';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
};

const RATE_LIMIT_HEADERS = {
  'RateLimit-Limit': '60',
  'RateLimit-Remaining': '59',
  'RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 60),
  'RateLimit-Policy': '60;w=60',
  'X-API-Version': API_VERSION,
  'Sunset': 'Sat, 25 Aug 2029 00:00:00 GMT',
  'Deprecation': 'false',
};

function problem(status, title, detail, extra = {}) {
  return new Response(
    JSON.stringify({ type: `${BASE}/developers#errors`, title, status, detail, ...extra }),
    {
      status,
      headers: {
        ...CORS,
        ...RATE_LIMIT_HEADERS,
        'Content-Type': 'application/problem+json; charset=utf-8',
        'X-API-Version': API_VERSION,
      },
    }
  );
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  if (req.method !== 'GET') {
    return problem(405, 'Method Not Allowed', `${req.method} is not supported. Use GET.`, { allowed: ['GET'] });
  }

  const url = new URL(req.url);
  const format = url.searchParams.get('format') ?? 'full';
  const allowed = ['full', 'summary', 'contact', 'work', 'services'];
  if (!allowed.includes(format)) {
    return problem(400, 'Bad Request', `Invalid format. Allowed: ${allowed.join(', ')}.`, { allowed });
  }

  const portfolio = {
    _meta: {
      name: 'Sumukh Singh Portfolio',
      version: API_VERSION,
      description: 'Structured portfolio data for Sumukh Singh — Creative Strategist & Content Marketer',
      apiBase: `${BASE}/api/v1`,
      docs: `${BASE}/developers`,
      schema: `${BASE}/openapi.json`,
      mcp: `${BASE}/api/mcp`,
      llms: `${BASE}/llms.txt`,
    },
    person: {
      name: 'Sumukh Singh',
      role: 'Creative Strategist & Content Marketer',
      location: 'Delhi, India',
      email: 'sumukh.workk@gmail.com',
      website: BASE,
      github: 'https://github.com/X-SUMUKH-X',
      availability: 'Open to freelance and consulting engagements',
      summary: 'Works where data, creative, and attention meet. Builds campaigns, content systems, and short-form creative for startups, founders, and growing teams.',
    },
    skills: [
      'Creative Strategy', 'Campaign Systems', 'Viral Short-Form Video',
      'Brand Positioning', 'Marketing Analytics', 'Website Development',
      'Content Marketing', 'AI Workflows',
    ],
    selectedWork: [
      { id: '01', project: 'Fokus App Short-Form System', category: 'short-form', result: '2.1M views in 24 hours', description: 'Hook-first scripts and content system for a productivity app targeting Gen Z.' },
      { id: '02', project: 'Swiggy Instamart Campaign', category: 'campaign', result: '2.1M organic views', description: 'Viral short-form campaign making Swiggy Instamart culturally relevant beyond grocery delivery.' },
      { id: '03', project: 'Slack × Swiggy HQ', category: 'brand', result: 'Brand partnership creative direction', description: 'Positioned Slack as the operational backbone of Swiggy internal culture.' },
      { id: '04', project: 'Josh Talks AI Redesign', category: 'ux', result: 'Editorial UX redesign', description: 'Landing page redesign to feel authoritative and editorially credible.' },
      { id: '05', project: 'Launchverse Product Launch', category: 'launch', result: 'Multi-brand launch strategy and execution', description: 'Coordinated multi-brand product launch across social, content, and distribution channels.' },
      { id: '06', project: 'Blinkit Metrics Dashboard', category: 'analytics', result: '₹1.2M in sales data analyzed', description: 'Power BI dashboard structured around decision-relevant metrics.' },
    ],
    services: [
      { id: '01', name: 'Branding', description: 'Visual identity, messaging, positioning frameworks and playbooks.' },
      { id: '02', name: 'Website Development', description: 'Clean, fast, responsive websites and landing pages.' },
      { id: '03', name: 'Social Media', description: 'Short-form ideas, hooks, scripts and social-first content systems.' },
      { id: '04', name: 'Content Marketing', description: 'Essays, case studies, newsletters and editorial content backed by search strategy.' },
      { id: '05', name: 'Campaign Strategy', description: 'End-to-end campaign thinking: positioning, messaging, creative direction and execution.' },
      { id: '06', name: 'Growth Consulting', description: 'Data-backed recommendations for startups and growing teams.' },
    ],
    contact: {
      email: 'sumukh.workk@gmail.com',
      preferredMethod: 'Email',
      note: 'Best for campaign strategy, content systems, short-form video, websites, and growth consulting engagements.',
    },
  };

  const subsets = {
    summary: { _meta: portfolio._meta, person: portfolio.person },
    contact: { _meta: portfolio._meta, contact: portfolio.contact },
    work: { _meta: portfolio._meta, selectedWork: portfolio.selectedWork },
    services: { _meta: portfolio._meta, services: portfolio.services },
    full: portfolio,
  };

  return new Response(JSON.stringify(subsets[format], null, 2), {
    status: 200,
    headers: {
      ...CORS,
      ...RATE_LIMIT_HEADERS,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'Vary': 'Accept, Accept-Encoding',
    },
  });
}
