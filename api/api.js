/**
 * Sumukh Singh Portfolio — API Root Index
 * Route: GET /api
 */

export const config = { runtime: 'edge' };

const BASE = 'https://sumukh-portfolio-seven.vercel.app';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, X-API-Version, MCP-Protocol-Version',
};

const RATE_LIMIT_HEADERS = {
  'RateLimit-Limit': '60',
  'RateLimit-Remaining': '59',
  'RateLimit-Reset': '60',
  'RateLimit-Policy': '60;w=60',
  'RateLimit': 'limit=60, remaining=59, reset=60',
  'X-RateLimit-Limit': '60',
  'X-RateLimit-Remaining': '59',
  'X-RateLimit-Reset': '60',
  'X-API-Version': '1',
  'Sunset': 'Sat, 25 Aug 2029 00:00:00 GMT',
  'Deprecation': '@1882310400',
  'Link': `<${BASE}/developers#deprecation>; rel="deprecation", <${BASE}/developers#sunset>; rel="sunset"`,
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({
      error: {
        code: 'method_not_allowed',
        message: 'HTTP Method Not Allowed. Use GET.',
        resolution: 'Send a GET request to /api or /api/v1/info.',
        resolution_hints: [`Send GET request to ${BASE}/api/v1/info`]
      },
      code: 'method_not_allowed',
      message: 'HTTP Method Not Allowed. Use GET.',
      resolution: 'Send a GET request to /api or /api/v1/info.',
      type: `${BASE}/developers#errors`,
      title: 'Method Not Allowed',
      status: 405,
      detail: `HTTP ${req.method} is not supported on this endpoint.`
    }, null, 2), {
      status: 405,
      headers: { ...CORS, ...RATE_LIMIT_HEADERS, 'Content-Type': 'application/problem+json; charset=utf-8' }
    });
  }

  const index = {
    name: 'Sumukh Singh Portfolio API',
    version: '1.0.0',
    description: 'Public API surface on Vercel for Sumukh Singh Portfolio',
    endpoints: {
      info: `${BASE}/api/v1/info`,
      work: `${BASE}/api/v1/work`,
      services: `${BASE}/api/v1/services`,
      contact: `${BASE}/api/v1/contact`,
      mcp: `${BASE}/api/mcp`
    },
    documentation: `${BASE}/developers`,
    openapi: `${BASE}/openapi.json`,
    llms: `${BASE}/llms.txt`,
    mcpManifest: `${BASE}/.well-known/mcp`
  };

  return new Response(JSON.stringify(index, null, 2), {
    status: 200,
    headers: {
      ...CORS,
      ...RATE_LIMIT_HEADERS,
      'Content-Type': 'application/json; charset=utf-8',
      'Vary': 'Accept, Accept-Encoding'
    }
  });
}
