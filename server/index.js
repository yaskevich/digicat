import fs from 'fs';
// import history from "connect-history-api-fallback"
// import sqlite3 from 'sqlite3'
// import { open } from 'sqlite'
// import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
// import { exit } from 'process';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'catalog.json'), 'utf8'));

const app = express();
app.use(compression());
const port = process.env.PORT || 8080;

app.get('/api/languages', async (req, res) => {
  res.json(data.languages);
});

app.get('/api/projects', async (req, res) => {
  res.json(data.projects);
});

app.get('/api/data', async (req, res) => {
  res.json(data.facets);
});

app.listen(port);
console.log(`Running at Port ${port}`);
