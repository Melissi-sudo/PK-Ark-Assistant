import createModule from 'seedmaps-engine-wasm';

async function test() {
  const mod = await createModule();
  const ctx = mod._wasm_create(26, 0, 1, 3097851891);

  // Measure time for 25 tiles of 64x64 samples at scale 4, 16, 64
  for (const s of [4, 16, 64]) {
    const t0 = performance.now();
    const buf = mod._malloc(64 * 64 * 4);
    for (let i = 0; i < 25; i++) {
      mod._wasm_ctx_generate_biomes(ctx, i * 64, 0, 64, 64, s, 16, buf);
    }
    mod._free(buf);
    const t1 = performance.now();
    console.log(`25 tiles at scale ${s}: ${(t1 - t0).toFixed(2)} ms (avg per tile: ${((t1 - t0)/25).toFixed(3)} ms)`);
  }
}

test().catch(console.error);
