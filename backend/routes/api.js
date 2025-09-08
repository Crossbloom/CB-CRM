// ~/CB-CRM/backend/routes/api.js
// Central router: health, signup, contacts, accounts (minimal, safe)
const express = require('express');
const router = express.Router();
const { supabaseInsert, supabaseSelect } = require('../lib/supabase');

// --- Health
router.get('/health', (req, res) => {
  return res.json({ status: 'ok', time: new Date().toISOString() });
});

// --- Signup: POST /api/signup
// body: { auth_uid, email, full_name }
// inserts a user row
router.post('/signup', async (req, res) => {
  try {
    const { auth_uid, email, full_name } = req.body || {};
    if (!auth_uid || !email) {
      return res.status(400).json({ error: 'auth_uid and email required' });
    }

    const payload = {
      auth_uid,
      email,
      full_name: full_name || null,
      created_at: new Date().toISOString()
    };

    const created = await supabaseInsert('users', payload);
    return res.status(201).json(created);
  } catch (err) {
    console.error('POST /signup error', err && (err.message || err));
    return res.status(500).json({ error: 'internal_error' });
  }
});

// --- Create Contact: POST /api/contacts
// body: { owner_id, full_name, email, phone, account_id }
router.post('/contacts', async (req, res) => {
  try {
    const { owner_id, full_name, email, phone, account_id } = req.body || {};
    if (!owner_id || !full_name) {
      return res.status(400).json({ error: 'owner_id and full_name required' });
    }

    const payload = {
      owner_id,
      full_name,
      email: email || null,
      phone: phone || null,
      account_id: account_id || null,
      created_at: new Date().toISOString()
    };

    const created = await supabaseInsert('contacts', payload);
    return res.status(201).json(created);
  } catch (err) {
    console.error('POST /contacts error', err && (err.message || err));
    return res.status(500).json({ error: 'internal_error' });
  }
});

// --- List Contacts: GET /api/contacts?owner_id=<uuid>&account_id=<uuid optional>
router.get('/contacts', async (req, res) => {
  try {
    const { owner_id, account_id } = req.query || {};
    if (!owner_id) return res.status(400).json({ error: 'owner_id query param required' });

    // if account_id present, filter by both owner_id and account_id
    const filters = { owner_id };
    if (account_id) filters.account_id = account_id;

    const rows = await supabaseSelect('contacts', filters);
    return res.json(rows);
  } catch (err) {
    console.error('GET /contacts error', err && (err.message || err));
    return res.status(500).json({ error: 'internal_error' });
  }
});

// --- Create Account: POST /api/accounts
// body: { owner_id, name, industry, website }
router.post('/accounts', async (req, res) => {
  try {
    const { owner_id, name, industry, website } = req.body || {};
    if (!owner_id || !name) return res.status(400).json({ error: 'owner_id and name required' });

    const payload = {
      owner_id,
      name,
      industry: industry || null,
      website: website || null,
      created_at: new Date().toISOString()
    };

    const created = await supabaseInsert('accounts', payload);
    return res.status(201).json(created);
  } catch (err) {
    console.error('POST /accounts error', err && (err.message || err));
    return res.status(500).json({ error: 'internal_error' });
  }
});

// --- List Accounts: GET /api/accounts?owner_id=<uuid>
router.get('/accounts', async (req, res) => {
  try {
    const { owner_id } = req.query || {};
    if (!owner_id) return res.status(400).json({ error: 'owner_id query param required' });

    const rows = await supabaseSelect('accounts', { owner_id });
    return res.json(rows);
  } catch (err) {
    console.error('GET /accounts error', err && (err.message || err));
    return res.status(500).json({ error: 'internal_error' });
  }
});

module.exports = router;

