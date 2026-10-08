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
  const netherCtx = Module._wasm_create(version, -1, s_hi, s_lo);
  const endCtx = Module._wasm_create(version, 1, s_hi, s_lo);

  const posPtr = Module._malloc(16);

  console.log('=== NETHER STRUCTURES ===');
  for (const st of [{ id: 18, name: 'fortress' }, { id: 19, name: 'bastion_remnant' }]) {
    let viableCount = 0;
    for (let rx = -2; rx <= 2; rx++) {
      for (let rz = -2; rz <= 2; rz++) {
        const ok = Module._wasm_structure_pos(st.id, version, s_hi, s_lo, rx, rz, posPtr);
        if (ok === 1) {
          const x = Module.getValue(posPtr, 'i32');
          const z = Module.getValue(posPtr + 4, 'i32');
          const v = Module._wasm_ctx_structure_viable(netherCtx, st.id, x, z);
          if (v === 1) viableCount++;
        }
      }
    }
    console.log(`${st.name}: viable ${viableCount} / 25`);
  }

  console.log('=== END STRUCTURES ===');
  let endCityViable = 0;
  for (let rx = -5; rx <= 5; rx++) {
    for (let rz = -5; rz <= 5; rz++) {
      const ok = Module._wasm_structure_pos(20, version, s_hi, s_lo, rx, rz, posPtr);
      if (ok === 1) {
        const x = Module.getValue(posPtr, 'i32');
        const z = Module.getValue(posPtr + 4, 'i32');
        const v = Module._wasm_ctx_structure_viable(endCtx, 20, x, z);
        if (v === 1) endCityViable++;
      }
    }
  }
  console.log(`end_city: viable ${endCityViable} / 121`);

  Module._free(posPtr);
  Module._wasm_destroy(netherCtx);
  Module._wasm_destroy(endCtx);
}
run();
