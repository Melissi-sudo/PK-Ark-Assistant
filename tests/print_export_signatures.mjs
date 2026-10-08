import fs from 'fs';
import path from 'path';

const wasmPath = path.resolve('./node_modules/seedmaps-engine-wasm/dist/seed_engine.wasm');
const buf = fs.readFileSync(wasmPath);

let pos = 8;
const sections = {};
while (pos < buf.length) {
  const id = buf[pos++];
  let len = 0, shift = 0;
  while (true) {
    const b = buf[pos++];
    len |= (b & 0x7f) << shift;
    if ((b & 0x80) === 0) break;
    shift += 7;
  }
  sections[id] = buf.subarray(pos, pos + len);
  pos += len;
}

// Section 1: Types
const typeSec = sections[1];
let tpos = 0;
function readVar(bytes, pRef) {
  let res = 0, shift = 0;
  while (true) {
    const b = bytes[pRef.pos++];
    res |= (b & 0x7f) << shift;
    if ((b & 0x80) === 0) break;
    shift += 7;
  }
  return res;
}
const pRef = { pos: 0 };
const numTypes = readVar(typeSec, pRef);
const types = [];
for (let i = 0; i < numTypes; i++) {
  pRef.pos++; // 0x60
  const numParams = readVar(typeSec, pRef);
  const params = [];
  for (let j = 0; j < numParams; j++) params.push(typeSec[pRef.pos++].toString(16));
  const numReturns = readVar(typeSec, pRef);
  const returns = [];
  for (let j = 0; j < numReturns; j++) returns.push(typeSec[pRef.pos++].toString(16));
  types.push({ params, returns });
}

// Section 2: Imports
const importSec = sections[2];
const ipRef = { pos: 0 };
const numImports = readVar(importSec, ipRef);
const importFuncTypes = [];
for (let i = 0; i < numImports; i++) {
  const modLen = readVar(importSec, ipRef);
  ipRef.pos += modLen;
  const fLen = readVar(importSec, ipRef);
  ipRef.pos += fLen;
  const kind = importSec[ipRef.pos++];
  if (kind === 0) {
    importFuncTypes.push(readVar(importSec, ipRef));
  }
}

// Section 3: Function types
const funcSec = sections[3];
const fpRef = { pos: 0 };
const numFuncs = readVar(funcSec, fpRef);
const funcTypes = [...importFuncTypes];
for (let i = 0; i < numFuncs; i++) {
  funcTypes.push(readVar(funcSec, fpRef));
}

// Section 7: Exports
const expSec = sections[7];
const epRef = { pos: 0 };
const numExports = readVar(expSec, epRef);
const allExports = [];
for (let i = 0; i < numExports; i++) {
  const nLen = readVar(expSec, epRef);
  const name = expSec.subarray(epRef.pos, epRef.pos + nLen).toString('utf8');
  epRef.pos += nLen;
  const kind = expSec[epRef.pos++];
  const idx = readVar(expSec, epRef);
  const type = kind === 0 ? types[funcTypes[idx]] : null;
  allExports.push({ name, kind, idx, type });
}

console.log('All exports with signatures:');
for (const e of allExports) {
  if (e.kind === 0) {
    const pStr = e.type.params.join(',');
    const rStr = e.type.returns.join(',');
    console.log(`  export "${e.name}" (func ${e.idx}): (${pStr}) -> (${rStr})`);
  }
}
