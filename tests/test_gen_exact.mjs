import createModule from 'seedmaps-engine-wasm';

async function test() {
  const mod = await createModule();
  const s_hi = 1;
  const s_lo = 3097851891; // Seed 7392817491
  const ctx = mod._wasm_create(26, 0, s_hi, s_lo);

  // Let's test a non-trivial region:
  // Let's test 10x10 grid with startBlockX = -64, startBlockZ = 128 (around spawn)
  const startX = -64;
  const startZ = 128;
  const cols = 10;
  const rows = 10;
  const scale = 4;
  const y = 64;

  const bufPtr = mod._malloc(cols * rows * 4);
  const status = mod._wasm_ctx_generate_biomes(ctx, startX, startZ, cols, rows, scale, y, bufPtr);
  console.log('Status:', status);

  let mismatches = 0;
  for (let r = 0; r < rows; r++) {
    const rowRef = [];
    const rowGrid = [];
    for (let c = 0; c < cols; c++) {
      // In grid, what are the coordinates of cell (c, r)?
      // Does (c, r) correspond to block (startX + c*scale, startZ + r*scale)
      // or (startX + r*scale, startZ + c*scale)?
      const bx = startX + c * scale;
      const bz = startZ + r * scale;
      const refBiome = mod._wasm_ctx_get_biome(ctx, scale, bx, y, bz);
      const gridBiome = mod.getValue(bufPtr + (r * cols + c) * 4, 'i32');
      rowRef.push(refBiome);
      rowGrid.push(gridBiome);
      if (refBiome !== gridBiome) {
        mismatches++;
      }
    }
    console.log(`row ${r}: grid=[${rowGrid.join(', ')}] ref=[${rowRef.join(', ')}]`);
  }

  console.log(`Total mismatches out of 100: ${mismatches}`);

  mod._free(bufPtr);
  mod._wasm_destroy(ctx);
}

test().catch(console.error);
