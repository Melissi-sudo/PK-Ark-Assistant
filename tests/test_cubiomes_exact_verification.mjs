import createModule from 'seedmaps-engine-wasm';

async function test() {
  const mod = await createModule();
  const s_hi = 1;
  const s_lo = 3097851891; // Seed 7392817491
  const ctx = mod._wasm_create(26, 0, s_hi, s_lo);

  console.log('=== TEST 1: SCALE = 1 (1:1 Block scale) ===');
  // At scale 1, (x, z) are block coordinates, y is block coordinate (64)
  // Let's generate a 16x16 block area around spawn (-64, 128)
  const blockX = -64;
  const blockZ = 128;
  const sx = 16;
  const sz = 16;
  const yBlock = 64;

  const buf1 = mod._malloc(sx * sz * 4);
  // generate_biomes(ctx, x, z, sx, sz, scale, y, buf)
  mod._wasm_ctx_generate_biomes(ctx, blockX, blockZ, sx, sz, 1, yBlock, buf1);

  let mismatchesScale1 = 0;
  for (let dz = 0; dz < sz; dz++) {
    for (let dx = 0; dx < sx; dx++) {
      const bx = blockX + dx;
      const bz = blockZ + dz;
      const ref = mod._wasm_ctx_get_biome(ctx, 1, bx, yBlock, bz);
      const grid = mod.getValue(buf1 + (dz * sx + dx) * 4, 'i32');
      if (ref !== grid) mismatchesScale1++;
    }
  }
  console.log(`Scale 1 (16x16 = 256 blocks): mismatches = ${mismatchesScale1} / 256`);

  console.log('\n=== TEST 2: SCALE = 4 (Biome / Quart scale) ===');
  // At scale 4, (x, z) are biome/quart coordinates (block / 4), y is biome y (64 / 4 = 16)
  // Let's generate a 16x16 quart area (64x64 blocks) around spawn
  const qX = blockX >> 2;
  const qZ = blockZ >> 2;
  const qY = 16; // 64 / 4
  const buf4 = mod._malloc(sx * sz * 4);
  mod._wasm_ctx_generate_biomes(ctx, qX, qZ, sx, sz, 4, qY, buf4);

  let mismatchesScale4 = 0;
  for (let dz = 0; dz < sz; dz++) {
    for (let dx = 0; dx < sx; dx++) {
      const currQx = qX + dx;
      const currQz = qZ + dz;
      const ref = mod._wasm_ctx_get_biome(ctx, 4, currQx, qY, currQz);
      const grid = mod.getValue(buf4 + (dz * sx + dx) * 4, 'i32');
      if (ref !== grid) mismatchesScale4++;
    }
  }
  console.log(`Scale 4 (16x16 = 256 samples): mismatches = ${mismatchesScale4} / 256`);

  mod._free(buf1);
  mod._free(buf4);
  mod._wasm_destroy(ctx);
}

test().catch(console.error);
