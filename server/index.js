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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(compression());
const port = process.env.PORT || 8080;
const dataRaw = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));
const data = dataRaw.teiCorpus.TEI;

// https://git.uni-wuppertal.de/api/v4/projects/749
// const idLngMap = Object.fromEntries(data.map((x) => [x._attributes['xml:id'], x.text.body.desc.filter((y) => y._attributes.type === 'language')?.[0]?._attributes?.ana.split(' ')]));
// const obj = Object.fromEntries(array.map(item => [item.key, item.value]));

const info = {
  material: {}, era: {}, subject: {}, language: {},
};

const index = {};

/* eslint-disable-next-line no-restricted-syntax */
for (const item of data) {
  const id = item._attributes['xml:id'];
  const obj = {};
  /* eslint-disable no-restricted-syntax, no-unused-expressions */
  for (const unit of item.text.body.desc) {
    const { type } = unit._attributes;
    if (['language', 'era', 'subject'].includes(type)) {
      const vals = unit._attributes?.ana.split(' ');
      obj[type] = vals;
      for (const val of vals) {
        info[type]?.[val] ? info[type][val].push(id) : info[type][val] = [id];
      }
    } else if (['material',].includes(type)) {
      const val = unit._attributes?.ana;
      info[type]?.[val] ? info[type][val].push(id) : info[type][val] = [id];
      obj[type] = val;
    }
  }
  const title = item.text.body.bibl.title._text.toString().replace(/[\t\n\s]+/g, ' ').replaceAll(' - ', ' – ').trim();
  if (item.text.body.bibl?.ref?._text) {
    const url = item.text.body.bibl.ref._text.toString();
    index.url = url;
  }
  obj.title = title;
  obj.id = id;

  index[id] = obj;
}
// console.log(info);

// app.get('/api/size', async (req, res) => {
//   res.json({ size: data.length });
// });

app.get('/api/projects', async (req, res) => {
  // res.json(data.map((x) => ({ id: x._attributes['xml:id'], title: x.text.body.bibl.title._text.toString().replace(/[\t\n\s]+/g, ' ').replaceAll(' - ', ' – ').trim() })));
  res.json(index);
});

app.get('/api/data', async (req, res) => {
  res.json(info);
});

app.listen(port);
console.log(`Running at Port ${port}`);
