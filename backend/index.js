require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Simple logger
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.path);
  next();
});

// API routes
const api = require('./routes/api');
app.use('/api', api);

// Default route
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Crossbloom backend running' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Backend listening on', PORT));

// --- added by CB-STEP-0012-E-01: health & supabase test routes ---
const healthRouter = require('./routes/health');
app.use('/api', healthRouter);
// --- end addition ---
