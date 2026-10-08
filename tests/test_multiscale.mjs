import createModule from 'seedmaps-engine-wasm';

async function test() {
  const mod = await createModule();
  const ctx = mod._wasm_create(26, 0, 1, 3097851891);
  const buf = mod._malloc(64 * 4);

  // Compare get_biome(ctx, scale, coordX, y, coordZ) vs generate_biomes(ctx, coordX, coordZ, 4, 4, scale, y, buf)
  for (const s of [1, 4, 16, 64, 256]) {
    const yScaled = s === 1 ? 64 : 16;
    const coordX = 10;
    const coordZ = 20;
    const ref = mod._wasm_ctx_get_biome(ctx, s, coordX, yScaled, coordZ);
    mod._wasm_ctx_generate_biomes(ctx, coordX, coordZ, 4, 4, s, yScaled, buf);
    const gen = mod.getValue(buf, 'i32');
    console.log(`Scale ${s}: ref=${ref} vs gen=${gen} (match: ${ref === gen})`);
  }
}

test().catch(console.error);
