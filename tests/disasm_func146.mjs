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

const codeSec = sections[10];
let cpos = 0;
function readVar() {
  let res = 0, shift = 0;
  while (true) {
    const b = codeSec[cpos++];
    res |= (b & 0x7f) << shift;
    if ((b & 0x80) === 0) break;
    shift += 7;
  }
  return res;
}
const numFuncBodies = readVar();
const funcBodies = [];
for (let i = 0; i < numFuncBodies; i++) {
  const size = readVar();
  funcBodies.push(codeSec.subarray(cpos, cpos + size));
  cpos += size;
}

// numImports = 3, so func 146 is funcBodies[146 - 3] = funcBodies[143]
// func 152 is funcBodies[152 - 3] = funcBodies[149]
const f146 = funcBodies[143];
const f152 = funcBodies[149];

console.log('f146 ("v") len:', f146.length);
console.log('f152 ("p") len:', f152.length);

function printOpcodes(bytes) {
  const hex = [];
  for (let i = 0; i < bytes.length; i++) {
    hex.push(bytes[i].toString(16).padStart(2, '0'));
  }
  return hex.join(' ');
}

console.log('f146 hex:\n', printOpcodes(f146));
console.log('f152 hex:\n', printOpcodes(f152));
