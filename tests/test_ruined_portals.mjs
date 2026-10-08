import createModule from 'seedmaps-engine-wasm';

async function test() {
  const mod = await createModule();
  const s_hi = 1;
  const s_lo = 3097851891; // Seed 7392817491
  const ctx = mod._wasm_create(26, 0, s_hi, s_lo);

  const posPtr = mod._malloc(16);

  console.log('--- Testing Ruined Portal (typeId = 11) ---');
  // In Cubiomes, what is the region size for ruined_portal?
  // Let's check _wasm_structure_region_size(11):
  const regSize = mod._wasm_structure_region_size(11);
  console.log('Ruined portal region size in WASM:', regSize);

  // In Minecraft Java:
  // Ruined portal spacing = 40, separation = 15, salt = 34222645 (or 40/15)
  // Region size is 40 chunks! (40 * 16 = 640 blocks)
  // Let's check regions -2 to 2:
  for (let rx = -2; rx <= 2; rx++) {
    for (let rz = -2; rz <= 2; rz++) {
      const status = mod._wasm_structure_pos(11, 26, s_hi, s_lo, rx, rz, posPtr);
      if (status === 1) {
        const x = mod.getValue(posPtr, 'i32');
        const z = mod.getValue(posPtr + 4, 'i32');
        const viable = mod._wasm_ctx_structure_viable(ctx, 11, x, z);
        const biome = mod._wasm_ctx_get_biome(ctx, 1, x, 64, z);
        console.log(`Region (${rx}, ${rz}): candidate (${x}, ${z}), chunk (${x>>4}, ${z>>4}), viable=${viable}, biome=${biome}`);
      }
    }
  }

  // Also check other structures:
  console.log('\n--- Checking Region sizes for all structures ---');
  for (let id = 1; id <= 24; id++) {
    const namePtr = mod._wasm_structure_name_ptr(id);
    const nameLen = mod._wasm_structure_name_length(id);
    const name = new TextDecoder().decode(new Uint8Array(mod.HEAPU8.buffer, namePtr, nameLen));
    const rSize = mod._wasm_structure_region_size(id);
    console.log(`ID ${id}: ${name}, regionSize = ${rSize}`);
  }

  mod._free(posPtr);
  mod._wasm_destroy(ctx);
}

test().catch(console.error);
