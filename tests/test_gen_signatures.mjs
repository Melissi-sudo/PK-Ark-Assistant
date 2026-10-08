import createModule from 'seedmaps-engine-wasm';

async function test() {
  const mod = await createModule();
  const s_hi = 1;
  const s_lo = 3097851891; // Seed 7392817491
  const ctx = mod._wasm_create(26, 0, s_hi, s_lo);

  // Area with variety: startBlockX = -256, startBlockZ = 0
  // 4x4 samples with scale 4:
  // x values: -256, -252, -248, -244
  // z values: 0, 4, 8, 12
  console.log('--- REFERENCE getBiomeAt(ctx, scale=4, x, y=64, z) ---');
  const ref = [];
  for (let sz = 0; sz < 4; sz++) {
    const row = [];
    for (let sx = 0; sx < 4; sx++) {
      const bx = -256 + sx * 4;
      const bz = 0 + sz * 4;
      const b = mod._wasm_ctx_get_biome(ctx, 4, bx, 64, bz);
      row.push(b);
    }
    ref.push(row);
    console.log(`z=${sz*4}: [${row.join(', ')}]`);
  }

  // Also reference with scale=1:
  console.log('\n--- REFERENCE getBiomeAt(ctx, scale=1, x, y=64, z) ---');
  for (let sz = 0; sz < 4; sz++) {
    const row = [];
    for (let sx = 0; sx < 4; sx++) {
      const bx = -256 + sx * 4;
      const bz = 0 + sz * 4;
      const b = mod._wasm_ctx_get_biome(ctx, 1, bx, 64, bz);
      row.push(b);
    }
    console.log(`z=${sz*4}: [${row.join(', ')}]`);
  }

  const bufPtr = mod._malloc(16 * 4);

  // Test what coordinates and arguments generate_biomes expects!
  // In Cubiomes:
  // Range r;
  // What are the 8 arguments to _wasm_ctx_generate_biomes?
  // Let's test combinations:
  const configs = [
    // 1: x=-256, z=0, sx=4, sz=4, scale=4, y=64
    { label: 'A: block coords (-256, 0, 4, 4, scale=4, y=64)', args: [-256, 0, 4, 4, 4, 64] },
    // 2: scaled coords (-64, 0, 4, 4, scale=4, y=64)
    { label: 'B: scaled coords (-64, 0, 4, 4, scale=4, y=64)', args: [-64, 0, 4, 4, 4, 64] },
    // 3: scaled coords with scaled y: (-64, 0, 4, 4, scale=4, y=16)
    { label: 'C: scaled coords & y (-64, 0, 4, 4, scale=4, y=16)', args: [-64, 0, 4, 4, 4, 16] },
    // 4: scale first: (scale=4, -256, 0, 4, 4, y=64)
    { label: 'D: scale first block (4, -256, 0, 4, 4, 64)', args: [4, -256, 0, 4, 4, 64] },
    // 5: scale first scaled: (scale=4, -64, 0, 4, 4, y=64)
    { label: 'E: scale first scaled (4, -64, 0, 4, 4, 64)', args: [4, -64, 0, 4, 4, 64] },
    // 6: scale first scaled y16: (4, -64, 0, 4, 4, 16)
    { label: 'F: scale first scaled y16 (4, -64, 0, 4, 4, 16)', args: [4, -64, 0, 4, 4, 16] },
    // 7: (x, z, sx, sz, y=64, sy=1)
    { label: 'G: (x=-256, z=0, sx=4, sz=4, y=64, sy=1)', args: [-256, 0, 4, 4, 64, 1] },
    // 8: (scale=1, -256, 0, 4, 4, 64)
    { label: 'H: scale=1 block (1, -256, 0, 4, 4, 64)', args: [1, -256, 0, 4, 4, 64] },
    // 9: (scale=4, -64, 0, 4, 4, 64)
    { label: 'I: scale=4, x=-64, z=0, sx=4, sz=4, y=64', args: [4, -64, 0, 4, 4, 64] },
    // 10: Cubiomes Range struct order: scale, x, z, sx, sz, y, sy ?
    // Wait, _wasm_ctx_generate_biomes takes: ctx + 7 parameters!
    // ctx is 1st. How many more?
    // Let's check arity: mod._wasm_ctx_generate_biomes.length was 8! So ctx + 7 args!
  ];

  for (const c of configs) {
    const res = mod._wasm_ctx_generate_biomes(ctx, ...c.args, bufPtr);
    const grid = [];
    for (let r = 0; r < 4; r++) {
      const row = [];
      for (let col = 0; col < 4; col++) {
        row.push(mod.getValue(bufPtr + (r * 4 + col) * 4, 'i32'));
      }
      grid.push(row);
    }
    console.log(`\n--- Config ${c.label} (return code: ${res}) ---`);
    for (const r of grid) {
      console.log('  [' + r.join(', ') + ']');
    }
  }

  mod._free(bufPtr);
  mod._wasm_destroy(ctx);
}

test().catch(console.error);
