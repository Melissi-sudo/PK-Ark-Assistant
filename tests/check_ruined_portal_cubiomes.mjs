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

  // Let's test _wasm_structure_pos for Ruined Portal across 10 regions
  const posPtr = Module._malloc(16);
  console.log('Ruined Portal candidates for seed 7392817491 in Overworld:');
  for (let rx = -2; rx <= 2; rx++) {
    for (let rz = -2; rz <= 2; rz++) {
      const ok = Module._wasm_structure_pos(11, version, s_hi, s_lo, rx, rz, posPtr);
      const x = Module.getValue(posPtr, 'i32');
      const z = Module.getValue(posPtr + 4, 'i32');
      console.log(`Region (${rx}, ${rz}): ok=${ok}, block (${x}, ${z}), chunk (${x >> 4}, ${z >> 4})`);
    }
  }

  Module._free(posPtr);
}
run();
