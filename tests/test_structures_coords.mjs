import createModule from 'seedmaps-engine-wasm';

async function test() {
  const mod = await createModule();
  const s_hi = 1;
  const s_lo = 3097851891; // Seed 7392817491
  const version = 26; // Java 1.21.1
  const ctx = mod._wasm_create(version, 0, s_hi, s_lo);

  const posPtr = mod._malloc(16);

  console.log('Testing structures near (0, 0):');
  // Check Trial Chamber (ID 24)
  for (let rx = -2; rx <= 2; rx++) {
    for (let rz = -2; rz <= 2; rz++) {
      const ok = mod._wasm_structure_pos(24, version, s_hi, s_lo, rx, rz, posPtr);
      if (ok === 1) {
        const x = mod.getValue(posPtr, 'i32');
        const z = mod.getValue(posPtr + 4, 'i32');
        const viable = mod._wasm_ctx_structure_viable(ctx, 24, x, z);
        console.log(`Trial Chamber [${rx}, ${rz}]: (${x}, ${z}), viable=${viable}`);
      }
    }
  }

  // Check Village (ID 5)
  console.log('\nVillages:');
  for (let rx = -2; rx <= 2; rx++) {
    for (let rz = -2; rz <= 2; rz++) {
      const ok = mod._wasm_structure_pos(5, version, s_hi, s_lo, rx, rz, posPtr);
      if (ok === 1) {
        const x = mod.getValue(posPtr, 'i32');
        const z = mod.getValue(posPtr + 4, 'i32');
        const viable = mod._wasm_ctx_structure_viable(ctx, 5, x, z);
        if (viable) {
          console.log(`Village [${rx}, ${rz}]: (${x}, ${z})`);
        }
      }
    }
  }

  // Check Ruined Portal (ID 11)
  console.log('\nRuined Portals:');
  for (let rx = -2; rx <= 2; rx++) {
    for (let rz = -2; rz <= 2; rz++) {
      const ok = mod._wasm_structure_pos(11, version, s_hi, s_lo, rx, rz, posPtr);
      if (ok === 1) {
        const x = mod.getValue(posPtr, 'i32');
        const z = mod.getValue(posPtr + 4, 'i32');
        const viable = mod._wasm_ctx_structure_viable(ctx, 11, x, z);
        console.log(`Ruined Portal [${rx}, ${rz}]: (${x}, ${z}), viable=${viable}`);
      }
    }
  }

  mod._free(posPtr);
  mod._wasm_destroy(ctx);
}

test().catch(console.error);
