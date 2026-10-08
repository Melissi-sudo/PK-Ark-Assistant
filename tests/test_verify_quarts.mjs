import createModule from 'seedmaps-engine-wasm';

async function test() {
  const mod = await createModule();
  const s_hi = 1;
  const s_lo = 3097851891;
  const ctx = mod._wasm_create(26, 0, s_hi, s_lo);

  // Test 100 random block coordinates:
  // Does getBiomeAt(ctx, 4, blockX, 64, blockZ) == getBiomeAt(ctx, 1, blockX >> 2, 16, blockZ >> 2)?
  let mm = 0;
  for (let i = 0; i < 100; i++) {
    const bx = Math.floor((Math.random() - 0.5) * 10000);
    const bz = Math.floor((Math.random() - 0.5) * 10000);
    const b1 = mod._wasm_ctx_get_biome(ctx, 4, bx, 64, bz);
    const b2 = mod._wasm_ctx_get_biome(ctx, 1, bx >> 2, 16, bz >> 2);
    if (b1 !== b2) mm++;
  }
  console.log(`Scale 4 (block) vs Scale 1 (quart >> 2): mismatches = ${mm} / 100`);

  // Now test generate_biomes with quart coords (scale=1, y=16):
  // Compare 4096 samples (64x64 tile = 256x256 blocks)
  const tileX = -1;
  const tileZ = 2;
  const tileBlocks = 256;
  const startBlockX = tileX * tileBlocks;
  const startBlockZ = tileZ * tileBlocks;
  const startQx = startBlockX >> 2;
  const startQz = startBlockZ >> 2;
  const samples = 64; // 256 / 4

  const bufPtr = mod._malloc(samples * samples * 4);
  const status = mod._wasm_ctx_generate_biomes(ctx, startQx, startQz, samples, samples, 1, 16, bufPtr);
  console.log('generate_biomes status:', status);

  let gridMismatches = 0;
  for (let r = 0; r < samples; r++) {
    for (let c = 0; c < samples; c++) {
      const qx = startQx + c;
      const qz = startQz + r;
      const bx = qx * 4;
      const bz = qz * 4;
      const ref = mod._wasm_ctx_get_biome(ctx, 4, bx, 64, bz);
      const grid = mod.getValue(bufPtr + (r * samples + c) * 4, 'i32');
      if (ref !== grid) {
        gridMismatches++;
      }
    }
  }
  console.log(`Entire 64x64 tile (4096 samples): mismatches vs getBiomeAt = ${gridMismatches} / 4096`);

  mod._free(bufPtr);
  mod._wasm_destroy(ctx);
}

test().catch(console.error);
