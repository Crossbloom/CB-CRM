const fetch = require('node-fetch');
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE) {
  // we throw later if used without env, but you can log here
  // console.warn('Supabase env missing');
}

function buildUrl(table, params) {
  const base = `${SUPABASE_URL}/rest/v1/${table}`;
  if (!params || Object.keys(params).length === 0) return base + '?select=*';
  const u = new URL(base);
  // Add select=* first
  u.searchParams.append('select', '*');
  // params: { key: value } -> key=eq.value
  for (const [k,v] of Object.entries(params)) {
    // use eq operator
    u.searchParams.append(k, `eq.${v}`);
  }
  return u.toString();
}

// Insert rows into Supabase table
async function supabaseInsert(table, payload) {
  if (!SUPABASE_URL || !SERVICE) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: SERVICE,
      Authorization: `Bearer ${SERVICE}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
}

// Select rows from Supabase table with simple equality filters
async function supabaseSelect(table, params = {}) {
  if (!SUPABASE_URL || !SERVICE) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
  const url = buildUrl(table, params);
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: SERVICE,
      Authorization: `Bearer ${SERVICE}`,
      Accept: 'application/json'
    }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
}

module.exports = { supabaseInsert, supabaseSelect };
