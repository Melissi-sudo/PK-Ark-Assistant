import createModule from 'seedmaps-engine-wasm';
import fs from 'fs';
import path from 'path';

async function run() {
  const wasmPath = path.resolve('./node_modules/seedmaps-engine-wasm/dist/seed_engine.wasm');
  const wasmBinary = fs.readFileSync(wasmPath);
  const Module = await createModule({ wasmBinary });

  console.log('=== STRUCTURE REGION SIZES IN WASM ===');
  for (let id = 0; id < 25; id++) {
    const namePtr = Module._wasm_structure_name_ptr(id);
    const name = namePtr ? Module.UTF8ToString(namePtr) : 'null';
    const reg26 = Module._wasm_structure_region_size(id, 26);
    const reg26_rev = Module._wasm_structure_region_size(26, id);
    console.log(`Structure ${id} ("${name}"): reg(id, 26)=${reg26}, reg(26, id)=${reg26_rev}`);
  }
}
run();
