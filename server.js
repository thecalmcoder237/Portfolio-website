import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import open from 'open';
import app from './lib/app.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.AUDIT_PORT || 3001;

// Serve static portfolio — only for local dev; Vercel serves static via filesystem
app.use(express.static(join(__dirname, 'public')));

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Audit backend + site running at ${url}`);
  open(url).catch(() => console.log('Open in browser:', url));
});
