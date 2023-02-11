import fs from 'fs';
import path from 'path';
import convert from 'xml-js';
import langs from 'langs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let repo;
let raw;

const bLoad = process.argv.filter((x) => x === '--deploy')?.length;
const bWrite = process.argv.filter((x) => x === '--write')?.length;

const dataPath = path.join(__dirname, 'data');
fs.mkdirSync(dataPath, { recursive: true });

if (bLoad) {
  // download JSON of repository info
  const infoUrl = 'https://git.uni-wuppertal.de/api/v4/projects/749';
  const infoResp = await fetch(infoUrl);
  repo = await infoResp.json();
  if (bWrite) {
    fs.writeFileSync(path.join(dataPath, 'catalog-info.json'), JSON.stringify(repo), 'utf-8');
  }

  // download XML file of the catalog
  const xmlUrl = 'https://git.uni-wuppertal.de/dhsfu/sde-catalog/-/raw/master/catalog_TEI.xml?inline=false';
  const xmlResp = await fetch(xmlUrl);
  const xml = await xmlResp.text();
  if (bWrite) {
    fs.writeFileSync(path.join(dataPath, 'catalog_TEI.xml'), xml, 'utf-8');
  }
  // const xml = fs.readFileSync(path.join(__dirname, 'data', 'catalog_TEI.xml'), 'utf8');
  raw = convert.xml2json(xml, { compact: true, spaces: 2 });
  if (bWrite) {
    fs.writeFileSync(path.join(dataPath, 'catalog-raw.json'), raw, 'utf-8');
  }
} else {
  // or read downloaded files
  const repoText = fs.readFileSync(path.join(dataPath, 'catalog-info.json'), 'utf8');
  repo = JSON.parse(repoText);
  raw = fs.readFileSync(path.join(dataPath, 'catalog-raw.json'), 'utf8');
}

const dataRaw = JSON.parse(raw);
const data = dataRaw.teiCorpus.TEI;

const facets = {
  material: {}, era: {}, subject: {}, language: {},
};

const info = {
  material: {
    charters: [
      'Charters',
      'medieval and early modern deeds, including cartularies (which are not single manuscript therefore)',
    ],
    single_manuscript: ['Single Manuscript', 'include also multi volume series; author manuscripts under single works'],
    collection_of_texts: ['Collection of Texts', 'different texts by different authors'],
    papers: ['Papers', 'documents related to a person or other entity or topic; a Nachlass'],
    diary: ['Diaries', 'note: diaries are not single manuscripts'],
    collected_works: ['Collected Works', 'all works by a specific author'],
    single_work: ['Single Work', 'a specific work with all its expressions, editions, manuscripts'],
    serial_documents: [
      'Serial Documents',
      'documents of/with similar content and/or form (e.g. entries, records etc.)',
    ],
    letters: ['Letters', 'correspondence documents'],
    inscriptions: ['Inscriptions', 'epigraphic documents'],
  },
  era: {
    ancient: ['Antiquity'],
    early_ma: ['Early MA'],
    high_ma: ['High MA'],
    late_ma: ['Late MA'],
    early_m: ['Early Modern'],
    modern: ['Modern'],
  },
  subject: {
    history: ['History'],
    literature: ['Literature'],
    history_science: ['History of Science'],
    philosophy: ['Theology & Philosophy'],
    music: ['Music'],
    history_art: ['History of Art'],
  },
};

const projects = {};

const addToFacets = (category, leaf, value) => {
  /* eslint-disable-next-line no-param-reassign, no-unused-expressions */
  facets[category]?.[leaf] ? facets[category][leaf].push(value) : facets[category][leaf] = [value];
};

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
        addToFacets(type, val, id);
      }
    } else if (['material',].includes(type)) {
      // Collected works may contain other material like papers or letters. Single manuscripts may also be multi volume manuscripts or series of manuscripts. Find some more information behind the info buttons on the web page.
      const val = unit._attributes?.ana;
      addToFacets(type, val, id);
      obj[type]?.length ? obj[type].push(val) : obj[type] = [val];
    }
  }
  const title = item.text.body.bibl.title._text.toString().replace(/[\t\n\s]+/g, ' ').replaceAll(' - ', ' – ').trim();

  const edition = item.text.body.bibl.edition._text.toString();

  const description = item.text.body.p._text;

  if (item.text.body.bibl?.ref?._text) {
    const url = item.text.body.bibl.ref._text.toString();
    obj.url = url;
  }
  obj.title = title;
  obj.id = id;
  obj.edition = edition;
  obj.description = description;

  projects[id] = obj;
}
// console.log(info);

const languages = Object.fromEntries(Object.keys(facets.language).map((x) => [x, langs.where('1', x) || 'ERROR!']));
// console.log(languages);

const setLabel = (parent, unit) => {
  let res = '';
  if (parent === 'language') {
    if (languages?.[unit]?.name) {
      res = `${languages[unit].name} / ${languages[unit].local}`;
    }
  } else if (info?.[parent]?.[unit]?.[0]) {
    res = info?.[parent]?.[unit]?.[0];
  }
  if (!res) {
    res = `!!! ${unit}`;
  }
  return `${res} (${facets[parent][unit].length})`;
};

const choices = Object.keys(facets).map((x) => ({
  label: x,
  items: Object.keys(facets[x]).map((y) => ({
    code: y,
    parent: x,
    num: facets[x][y].length,
    label: setLabel(x, y),
  })),
}));

fs.writeFileSync(path.join(dataPath, 'catalog.json'), JSON.stringify({
  gitlab: repo, languages, projects, facets, choices, info,
}, null, 2), 'utf-8');
