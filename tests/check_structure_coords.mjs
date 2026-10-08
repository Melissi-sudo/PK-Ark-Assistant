import createModule from 'seedmaps-engine-wasm';
import fs from 'fs';
import path from 'path';

async function run() {
  const wasmPath = path.resolve('./node_modules/seedmaps-engine-wasm/dist/seed_engine.wasm');
  const wasmBinary = fs.readFileSync(wasmPath);
  const Module = await createModule({ wasmBinary });

  const seed = 7392817491n;
  const u64 = BigInt.asUintN(64, seed);
  const s_hi = Number(u64 >> 32n);
  const s_lo = Number(u64 & 0xffffffffn);
  const version = 26; // 1.21.1
  const posPtr = Module._malloc(16);

  console.log('Checking _wasm_structure_pos return values for region (0, 0):');

  for (const structId of [5, 11, 13, 24]) {
    const namePtr = Module._wasm_structure_name_ptr(structId);
    const name = Module.UTF8ToString(namePtr);
    const ok = Module._wasm_structure_pos(structId, version, s_hi, s_lo, 0, 0, posPtr);
    const val0 = Module.getValue(posPtr, 'i32');
    const val1 = Module.getValue(posPtr + 4, 'i32');
    console.log(`Structure ${structId} (${name}): ok=${ok}, posPtr=[${val0}, ${val1}]`);
  }

  Module._free(posPtr);
}
run();
