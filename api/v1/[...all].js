/**
 * Vercel Serverless Function Catch-All for /api/v1/*
 */

export const config = { runtime: 'edge' };

const BASE = 'https://sumukh-portfolio-seven.vercel.app';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

  const url = new URL(req.url);

  const errorBody = {
    error: {
      code: 'api_endpoint_not_found',
      message: `The API v1 endpoint '${url.pathname}' does not exist on this server.`,
      resolution: 'Check the available endpoints in the developer documentation or OpenAPI spec.',
      resolution_hints: [
        `Portfolio info: ${BASE}/api/v1/info`,
        `Selected work: ${BASE}/api/v1/work`,
        `Services: ${BASE}/api/v1/services`,
        `Contact: ${BASE}/api/v1/contact`,
        `Developer portal: ${BASE}/developers`,
        `OpenAPI 3.1: ${BASE}/openapi.json`
      ]
    },
    code: 'api_endpoint_not_found',
    message: `The API v1 endpoint '${url.pathname}' does not exist on this server.`,
    resolution: 'Check the available endpoints in the developer documentation or OpenAPI spec.',
    type: `${BASE}/developers#errors`,
    title: 'API Endpoint Not Found',
    status: 404,
    detail: `The requested API route '${url.pathname}' is not defined.`,
    instance: url.pathname
  };

  return new Response(JSON.stringify(errorBody, null, 2), {
    status: 404,
    headers: {
      ...CORS,
      ...RATE_LIMIT_HEADERS,
      'Content-Type': 'application/problem+json; charset=utf-8',
    }
  });
}
