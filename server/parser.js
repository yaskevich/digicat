import fs from 'fs';

import convert from 'xml-js';

var xml = fs.readFileSync('./catalog_TEI.xml', 'utf8');

var result = convert.xml2json(xml, {compact: true, spaces: 2});
// console.log(result);

// fs.writeFileSync('./data.json', JSON.stringify(result, null, 2) , 'utf-8');
fs.writeFileSync('./data.json', result, 'utf-8');