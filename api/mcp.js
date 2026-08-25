/**
 * Sumukh Singh Portfolio — MCP Server (Model Context Protocol 2025-03-26)
 * Route: GET|POST /api/mcp
 * Implements JSON-RPC 2.0 over HTTP per the MCP spec.
 */

const BASE = 'https://sumukh-portfolio-seven.vercel.app';
const SERVER_NAME = 'Sumukh Singh Portfolio';
const SERVER_VERSION = '1.0.0';
const PROTOCOL_VERSION = '2025-03-26';

const RESOURCES = [
  { uri: `${BASE}/llms.txt`, name: 'Portfolio Index (llms.txt)', description: 'Machine-readable index of all portfolio resources, work, and services.', mimeType: 'text/plain' },
  { uri: `${BASE}/llms-full.txt`, name: 'Portfolio Extended Index', description: 'Full portfolio index with complete case study descriptions.', mimeType: 'text/plain' },
  { uri: `${BASE}/openapi.json`, name: 'OpenAPI 3.1.0 Specification', description: 'OpenAPI spec for the Sumukh Singh Portfolio API.', mimeType: 'application/json' },
  { uri: `${BASE}/`, name: 'Portfolio Homepage', description: 'Sumukh Singh — Creative Strategist & Content Marketer, Delhi, India.', mimeType: 'text/html' },
  { uri: `${BASE}/sitemap.xml`, name: 'XML Sitemap', description: 'Complete sitemap of all public portfolio pages.', mimeType: 'application/xml' },
];

const TOOLS = [
  {
    name: 'get_portfolio_overview',
    description: "Get a structured overview of Sumukh Singh's portfolio — name, role, skills, selected work, services, and contact.",
    inputSchema: { type: 'object', properties: {}, required: [], additionalProperties: false },
  },
  {
    name: 'get_contact_info',
    description: 'Get contact details for Sumukh Singh to initiate a project inquiry.',
    inputSchema: { type: 'object', properties: {}, required: [], additionalProperties: false },
  },
  {
    name: 'get_selected_work',
    description: 'Get case studies from Sumukh Singh portfolio, optionally filtered by category.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Filter by category', enum: ['campaign','short-form','analytics','brand','ux','launch'] },
      },
      required: [],
      additionalProperties: false,
    },
  },
  {
    name: 'get_services',
    description: 'Get the list of services Sumukh Singh offers with descriptions.',
    inputSchema: { type: 'object', properties: {}, required: [], additionalProperties: false },
  },
];

function toolGetPortfolioOverview() {
  return {
    name: 'Sumukh Singh', role: 'Creative Strategist & Content Marketer', location: 'Delhi, India',
    email: 'sumukh.workk@gmail.com', website: BASE,
    summary: 'Sumukh Singh works where data, creative, and attention meet — building campaigns, content systems, and short-form creative for startups, founders, and growing teams.',
    skills: ['Creative Strategy','Campaign Systems','Viral Short-Form Video','Brand Positioning','Marketing Analytics','Website Development','Content Marketing','AI Workflows'],
    selectedWork: [
      { project: 'Swiggy Instamart Campaign', category: 'campaign', result: '2.1M views in 24 hours' },
      { project: 'Fokus App Short-Form System', category: 'short-form', result: '2.1M views in 24 hours' },
      { project: 'Blinkit Metrics Dashboard', category: 'analytics', result: '₹1.2M in sales data analyzed' },
      { project: 'Slack × Swiggy HQ', category: 'brand', result: 'Brand partnership creative direction' },
      { project: 'Josh Talks AI Redesign', category: 'ux', result: 'Editorial UX redesign' },
      { project: 'Launchverse Product Launch', category: 'launch', result: 'Multi-brand launch strategy' },
    ],
    services: ['Branding','Website Development','Social Media','Content Marketing','Campaign Strategy','Growth Consulting'],
    availability: 'Open to freelance and consulting engagements.',
  };
}

function toolGetContactInfo() {
  return { name: 'Sumukh Singh', email: 'sumukh.workk@gmail.com', website: BASE, location: 'Delhi, India', preferredContact: 'Email', note: 'Available for campaign strategy, content systems, short-form video, website development, and growth consulting.' };
}

function toolGetSelectedWork(params) {
  const work = [
    { project: 'Swiggy Instamart Campaign', category: 'campaign', result: '2.1M views in 24 hours', description: 'Viral short-form campaign making Swiggy Instamart culturally relevant beyond grocery delivery.' },
    { project: 'Fokus App Short-Form System', category: 'short-form', result: '2.1M views in 24 hours', description: 'Hook-first scripts and content system for a productivity app targeting Gen Z.' },
    { project: 'Blinkit Metrics Dashboard', category: 'analytics', result: '₹1.2M analyzed', description: 'Power BI dashboard structured around decision-relevant metrics.' },
    { project: 'Slack × Swiggy HQ', category: 'brand', result: 'Brand partnership creative', description: 'Positioned Slack as the operational backbone of Swiggy internal culture.' },
    { project: 'Josh Talks AI Redesign', category: 'ux', result: 'Editorial UX redesign', description: 'Landing page redesign to feel authoritative and editorially credible.' },
    { project: 'Launchverse Product Launch', category: 'launch', result: 'Multi-brand launch', description: 'Multi-brand product launch across social, content, and distribution channels.' },
  ];
  return params && params.category ? work.filter(w => w.category === params.category) : work;
}

function toolGetServices() {
  return [
    { id:'01', name:'Branding', description:'Visual identity, messaging, positioning frameworks and playbooks.' },
    { id:'02', name:'Website Development', description:'Clean, fast, responsive websites and landing pages.' },
    { id:'03', name:'Social Media', description:'Short-form ideas, hooks, scripts and social-first content systems.' },
    { id:'04', name:'Content Marketing', description:'Essays, case studies, newsletters and editorial content backed by search strategy.' },
    { id:'05', name:'Campaign Strategy', description:'End-to-end campaign thinking: positioning, messaging, creative direction and execution.' },
    { id:'06', name:'Growth Consulting', description:'Data-backed recommendations for startups and growing teams.' },
  ];
}

function jsonrpcOk(id, result) { return { jsonrpc:'2.0', id, result }; }
function jsonrpcErr(id, code, message, data) { return { jsonrpc:'2.0', id, error: { code, message, ...(data ? { data } : {}) } }; }
const E = { PARSE:-32700, INVALID_REQ:-32600, NOT_FOUND:-32601, INVALID_PARAMS:-32602, INTERNAL:-32603 };

function handleRpc(body) {
  const { jsonrpc, id, method, params } = body;
  if (jsonrpc !== '2.0') return jsonrpcErr(id??null, E.INVALID_REQ, 'jsonrpc must be "2.0"');
  if (!method) return jsonrpcErr(id??null, E.INVALID_REQ, 'method is required');
  if (id === undefined || id === null) return null; // notification — no response

  switch (method) {
    case 'initialize':
      return jsonrpcOk(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { resources:{ subscribe:false, listChanged:false }, tools:{ listChanged:false } },
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
        instructions: `MCP server for Sumukh Singh Portfolio. Call resources/list to browse assets or use tools to get structured portfolio data.`,
      });
    case 'ping': return jsonrpcOk(id, {});
    case 'resources/list': return jsonrpcOk(id, { resources: RESOURCES });
    case 'resources/read': {
      const uri = params?.uri;
      if (!uri) return jsonrpcErr(id, E.INVALID_PARAMS, 'uri is required');
      const r = RESOURCES.find(x => x.uri === uri);
      if (!r) return jsonrpcErr(id, E.INVALID_PARAMS, `Resource not found: ${uri}`, { available: RESOURCES.map(x=>x.uri) });
      const texts = {
        [`${BASE}/llms.txt`]: `# Sumukh Singh Portfolio\n> Creative Strategist & Content Marketer, Delhi, India\nContact: sumukh.workk@gmail.com\nMore: ${BASE}/llms.txt`,
        [`${BASE}/llms-full.txt`]: `# Sumukh Singh Portfolio — Extended Index\nFull case study descriptions available at: ${BASE}/llms-full.txt`,
        [`${BASE}/openapi.json`]: `OpenAPI 3.1.0 spec for Sumukh Singh Portfolio API. Main endpoint: GET ${BASE}/api/v1/info`,
        [`${BASE}/`]: `Sumukh Singh — Creative Strategist & Content Marketer, Delhi, India.\nEmail: sumukh.workk@gmail.com\n${BASE}`,
        [`${BASE}/sitemap.xml`]: `XML sitemap: ${BASE}/sitemap.xml`,
      };
      return jsonrpcOk(id, { contents:[{ uri, mimeType: r.mimeType, text: texts[uri] ?? `Resource: ${uri}` }] });
    }
    case 'tools/list': return jsonrpcOk(id, { tools: TOOLS });
    case 'tools/call': {
      const name = params?.name;
      const args = params?.arguments ?? {};
      if (!name) return jsonrpcErr(id, E.INVALID_PARAMS, 'name is required');
      const fns = { get_portfolio_overview: toolGetPortfolioOverview, get_contact_info: toolGetContactInfo, get_selected_work: ()=>toolGetSelectedWork(args), get_services: toolGetServices };
      if (!fns[name]) return jsonrpcErr(id, E.NOT_FOUND, `Unknown tool: ${name}`, { available: TOOLS.map(t=>t.name) });
      return jsonrpcOk(id, { content:[{ type:'text', text: JSON.stringify(fns[name](), null, 2) }], isError:false });
    }
    default: return jsonrpcErr(id, E.NOT_FOUND, `Method not found: ${method}`);
  }
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, MCP-Protocol-Version',
  'Access-Control-Max-Age': '86400',
};

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status:204, headers: CORS });

  if (req.method === 'GET') {
    const manifest = { mcpVersion: PROTOCOL_VERSION, name: SERVER_NAME, vendor:'Sumukh Singh', homepage: BASE, contact:'sumukh.workk@gmail.com', transport:'streamable-http', url:`${BASE}/api/mcp`, resources: RESOURCES, tools: TOOLS };
    return new Response(JSON.stringify(manifest,null,2), { status:200, headers:{ ...CORS, 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'public, max-age=3600' } });
  }

  if (req.method === 'POST') {
    let body;
    try { body = await req.json(); } catch {
      return new Response(JSON.stringify(jsonrpcErr(null, E.PARSE, 'Invalid JSON body')), { status:400, headers:{ ...CORS, 'Content-Type':'application/json; charset=utf-8' } });
    }
    const isBatch = Array.isArray(body);
    const results = (isBatch ? body : [body]).map(handleRpc).filter(r => r !== null);
    const out = isBatch ? results : (results[0] ?? null);
    if (out === null) return new Response(null, { status:204, headers: CORS });
    return new Response(JSON.stringify(out), { status:200, headers:{ ...CORS, 'Content-Type':'application/json; charset=utf-8', 'MCP-Protocol-Version': PROTOCOL_VERSION } });
  }

  const problem = { type:`${BASE}/developers#errors`, title:'Method Not Allowed', status:405, detail:`${req.method} is not supported. Use GET (manifest) or POST (JSON-RPC).` };
  return new Response(JSON.stringify(problem), { status:405, headers:{ ...CORS, 'Content-Type':'application/problem+json; charset=utf-8', 'Allow':'GET, POST, OPTIONS' } });
}
