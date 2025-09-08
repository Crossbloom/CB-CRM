const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

// Health endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Supabase connectivity test - lightweight select (no secrets printed)
router.get('/supatest', async (req, res) => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: 'supabase env missing' });
    }
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    // safe small query: count users
    const { count, error } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ supabase_ok: true, users_count: count });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
