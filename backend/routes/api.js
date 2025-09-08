const express = require('express');
const router = express.Router();
const { supabaseInsert, supabaseSelect } = require('../lib/supabase');

// POST /api/signup
router.post('/signup', async (req, res) => {
  try {
    const { auth_uid, email, full_name } = req.body;
    if (!auth_uid || !email) return res.status(400).json({ error: 'auth_uid and email required' });
    const payload = [{ auth_uid, email, full_name }];
    const rows = await supabaseInsert('users', payload);
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('signup error', String(err));
    return res.status(500).json({ error: 'internal_error', detail: String(err) });
  }
});

// POST /api/contacts  (create a contact)
// body: { full_name, email, phone, account_id }
router.post('/contacts', async (req, res) => {
  try {
    const { full_name, email, phone, account_id } = req.body;
    if (!full_name) return res.status(400).json({ error: 'full_name required' });
    const payload = [{ full_name, email, phone, account_id }];
    const rows = await supabaseInsert('contacts', payload);
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('contacts.create error', String(err));
    return res.status(500).json({ error: 'internal_error', detail: String(err) });
  }
});

// GET /api/contacts  (list contacts)
// optional query: ?account_id=<uuid>
router.get('/contacts', async (req, res) => {
  try {
    const { account_id } = req.query;
    const params = {};
    if (account_id) params.account_id = account_id;
    const rows = await supabaseSelect('contacts', params);
    return res.json(rows);
  } catch (err) {
    console.error('contacts.list error', String(err));
    return res.status(500).json({ error: 'internal_error', detail: String(err) });
  }
});

module.exports = router;
