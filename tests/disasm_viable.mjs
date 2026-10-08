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

// Section 7: exports
const exportSec = sections[7];
let epos = 0;
function readVar(bytes) {
  let res = 0, shift = 0;
  while (true) {
    const b = bytes[epos++];
    res |= (b & 0x7f) << shift;
    if ((b & 0x80) === 0) break;
    shift += 7;
  }
  return res;
}
const numExports = readVar(exportSec);
const exports = {};
for (let i = 0; i < numExports; i++) {
  const nameLen = readVar(exportSec);
  const name = exportSec.subarray(epos, epos + nameLen).toString('utf8');
  epos += nameLen;
  const kind = exportSec[epos++];
  const idx = readVar(exportSec);
  exports[name] = { kind, idx };
}

// Section 2: imports
let ipos = 0;
const importSec = sections[2];
const numImports = readVar(importSec);
let numImportFuncs = 0;
for (let i = 0; i < numImports; i++) {
  const modLen = readVar(importSec);
  ipos += modLen;
  const fieldLen = readVar(importSec);
  ipos += fieldLen;
  const kind = importSec[ipos++];
  if (kind === 0) {
    readVar(importSec);
    numImportFuncs++;
  } else if (kind === 1) ipos += 3;
  else if (kind === 2) ipos += 2;
  else if (kind === 3) ipos += 2;
}

// Section 10: code
const codeSec = sections[10];
let cpos = 0;
function readVarCode() {
  let res = 0, shift = 0;
  while (true) {
    const b = codeSec[cpos++];
    res |= (b & 0x7f) << shift;
    if ((b & 0x80) === 0) break;
    shift += 7;
  }
  return res;
}
const numFuncBodies = readVarCode();
const funcBodies = [];
for (let i = 0; i < numFuncBodies; i++) {
  const size = readVarCode();
  funcBodies.push(codeSec.subarray(cpos, cpos + size));
  cpos += size;
}

// "v" is _wasm_ctx_structure_viable
// "p" is _wasm_structure_viable
for (const name of ['v', 'p', 'o']) {
  const exp = exports[name];
  if (!exp) continue;
  const bodyIdx = exp.idx - numImportFuncs;
  const body = funcBodies[bodyIdx];
  console.log(`\n=== Function ${name} (func index ${exp.idx}, body size ${body.length}) ===`);
  let hex = [];
  for (let i = 0; i < Math.min(body.length, 120); i++) {
    hex.push(body[i].toString(16).padStart(2, '0'));
  }
  console.log(hex.join(' '));
}
