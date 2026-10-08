import createModule from 'seedmaps-engine-wasm';

async function test() {
  const mod = await createModule();
  const ctx = mod._wasm_create(26, 0, 1, 3097851891); // 1.21.1, seed 7392817491

  console.log('Comparing scale=1 at (bx, 64, bz) vs scale=4 at (bx>>2, 16, bz>>2):');
  let match = 0;
  let total = 0;
  for (let bz = -500; bz <= 500; bz += 16) {
    for (let bx = -500; bx <= 500; bx += 16) {
      const bScale1 = mod._wasm_ctx_get_biome(ctx, 1, bx, 64, bz);
      const bScale4 = mod._wasm_ctx_get_biome(ctx, 4, bx >> 2, 16, bz >> 2);
      if (bScale1 === bScale4) match++;
      total++;
    }
  }
  console.log(`Matched: ${match} / ${total} (${(match/total*100).toFixed(1)}%)`);

  // What about voronoi zoom in Minecraft Java?
  // In Minecraft Java, scale=1 applies the 4x Voronoi zoom filter on top of the 4x4 quart multi-noise grid!
  // In Minecraft 1.18+, multi-noise is sampled at quart resolution (scale=4).
  // Then at block level (scale=1), Minecraft's client/server interpolates using Voronoi noise!
  // Let's check how close the boundaries are:
}

test().catch(console.error);
