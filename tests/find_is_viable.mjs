import fs from 'fs';
import path from 'path';

const wasmPath = path.resolve('./node_modules/seedmaps-engine-wasm/dist/seed_engine.wasm');
const buf = fs.readFileSync(wasmPath);

// Find the string "isViableFeatureBiome" in the data section
const target = Buffer.from('isViableFeatureBiome');
const idx = buf.indexOf(target);
console.log('Offset of "isViableFeatureBiome":', idx);

// In WASM, data sections are loaded into memory at a specific base address
// Let's parse section 11 (data) to find the memory offset of this string
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
  sections[id] = { pos, len, buf: buf.subarray(pos, pos + len) };
  pos += len;
}

const dataSec = sections[11].buf;
console.log('Data section length:', dataSec.length);

// Let's search all code bodies in section 10 for references to this or isViable
const codeSec = sections[10].buf;
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
console.log('Total functions in code section:', numFuncBodies);
const funcBodies = [];
for (let i = 0; i < numFuncBodies; i++) {
  const size = readVar();
  funcBodies.push({ idx: i + 3, body: codeSec.subarray(cpos, cpos + size) });
  cpos += size;
}

// Check which function calls or contains references to structure viability
for (let i = 0; i < funcBodies.length; i++) {
  const f = funcBodies[i];
  // check if body contains the string offset or printf
  // Let's search for function bodies that have structure type checks
  if (f.body.length > 500 && f.body.length < 5000) {
    // print some info
  }
}
console.log('Done scanning functions');
