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
  const ctx = Module._wasm_create(version, 0, s_hi, s_lo);

  const posPtr = Module._malloc(16);

  console.log('=== STRUCTURE VERIFICATION AUDIT ===');
  const structureTypes = [
    { id: 1, name: 'desert_pyramid' },
    { id: 2, name: 'jungle_pyramid' },
    { id: 3, name: 'swamp_hut' },
    { id: 4, name: 'igloo' },
    { id: 5, name: 'village' },
    { id: 6, name: 'ocean_ruin' },
    { id: 7, name: 'shipwreck' },
    { id: 8, name: 'monument' },
    { id: 9, name: 'mansion' },
    { id: 10, name: 'pillager_outpost' },
    { id: 11, name: 'ruined_portal' },
    { id: 12, name: 'ruined_portal_nether' },
    { id: 13, name: 'ancient_city' },
    { id: 18, name: 'fortress' },
    { id: 19, name: 'bastion_remnant' },
    { id: 20, name: 'end_city' },
    { id: 23, name: 'trail_ruins' },
    { id: 24, name: 'trial_chambers' }
  ];

  for (const st of structureTypes) {
    // Check 1: Does _wasm_structure_pos work?
    const ok = Module._wasm_structure_pos(st.id, version, s_hi, s_lo, 0, 0, posPtr);
    const x = Module.getValue(posPtr, 'i32');
    const z = Module.getValue(posPtr + 4, 'i32');
    const regSize = Module._wasm_structure_region_size(st.id, version);

    // Check 2: Does _wasm_ctx_structure_viable work with block coords?
    // Let's test across 25 regions to see if viability actually discriminates (returns 1 sometimes, 0 other times)
    let totalTested = 0;
    let viableCount = 0;
    for (let rx = -2; rx <= 2; rx++) {
      for (let rz = -2; rz <= 2; rz++) {
        const sOk = Module._wasm_structure_pos(st.id, version, s_hi, s_lo, rx, rz, posPtr);
        if (sOk === 1) {
          totalTested++;
          const sx = Module.getValue(posPtr, 'i32');
          const sz = Module.getValue(posPtr + 4, 'i32');
          const v = Module._wasm_ctx_structure_viable(ctx, st.id, sx, sz);
          if (v === 1) viableCount++;
        }
      }
    }

    const ratio = totalTested > 0 ? (viableCount / totalTested).toFixed(2) : 'N/A';
    console.log(`Structure ${st.id} (${st.name}): regSize=${regSize}, tested=${totalTested}, viable=${viableCount} (${ratio})`);
  }

  Module._free(posPtr);
  Module._wasm_destroy(ctx);
}
run();
