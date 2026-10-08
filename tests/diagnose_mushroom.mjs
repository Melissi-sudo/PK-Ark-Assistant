import createModule from 'seedmaps-engine-wasm';
import fs from 'fs';
import path from 'path';

async function run() {
  const wasmPath = path.resolve('./node_modules/seedmaps-engine-wasm/dist/seed_engine.wasm');
  const wasmBinary = fs.readFileSync(wasmPath);
  const Module = await createModule({ wasmBinary });

  // Let's test known seeds:
  // e.g. seed = 12345n, seed = 7392817491n, seed = 867530942n
  // Let's test across all versions: 22 (1.18), 24 (1.19), 25 (1.20), 26 (1.21.1), 27 (1.21.3), 28 (1.21 WD)
  const testSeeds = [7392817491n, 12345n, 867530942n, 1948274921n];

  console.log('=== INVESTIGATION: MUSHROOM FIELDS & BIOME ACCURACY ===');

  for (const seed of testSeeds) {
    const u64 = BigInt.asUintN(64, seed);
    const s_hi = Number(u64 >> 32n);
    const s_lo = Number(u64 & 0xffffffffn);

    console.log(`\n------------------ SEED: ${seed} ------------------`);

    // Let's test versions 25 (1.20), 26 (1.21.1), 28 (1.21 WD)
    for (const ver of [26, 25, 22]) {
      const verName = Module.UTF8ToString(Module._wasm_mc_name_ptr(ver));
      const ctx = Module._wasm_create(ver, 0, s_hi, s_lo);

      // Search for Mushroom Fields (ID 14) within -2000 to +2000 blocks
      // Let's query on a grid of step 64 blocks (16 quarts)
      const mushroomLocations = [];
      for (let z = -2000; z <= 2000; z += 64) {
        for (let x = -2000; x <= 2000; x += 64) {
          const b1 = Module._wasm_ctx_get_biome(ctx, 1, x, 64, z);
          if (b1 === 14) {
            mushroomLocations.push({ x, z, b1 });
          }
        }
      }

      console.log(`[Version ${verName} (${ver})] Found ${mushroomLocations.length} Mushroom Fields points at block Y=64:`);
      if (mushroomLocations.length > 0) {
        for (const loc of mushroomLocations.slice(0, 5)) {
          // Compare with get_biome at different scales and Y levels
          const bScale1_Y64 = Module._wasm_ctx_get_biome(ctx, 1, loc.x, 64, loc.z);
          const bScale4_Y16 = Module._wasm_ctx_get_biome(ctx, 4, loc.x >> 2, 16, loc.z >> 2);
          const bScale4_Y64 = Module._wasm_ctx_get_biome(ctx, 4, loc.x >> 2, 64, loc.z >> 2);
          const bScale1_Y320 = Module._wasm_ctx_get_biome(ctx, 1, loc.x, 320, loc.z);
          const bScale1_YNeg64 = Module._wasm_ctx_get_biome(ctx, 1, loc.x, -64, loc.z);

          // Compare with generate_biomes
          const buf = Module._malloc(4);
          Module._wasm_ctx_generate_biomes(ctx, loc.x >> 2, loc.z >> 2, 1, 1, 4, 16, buf);
          const genVal = Module.getValue(buf, 'i32');
          Module._free(buf);

          console.log(`  Point (${loc.x}, ${loc.z}):`);
          console.log(`    get_biome scale=1 Y=64:   ID ${bScale1_Y64} (${Module.UTF8ToString(Module._wasm_biome_name_ptr(ver, bScale1_Y64))})`);
          console.log(`    get_biome scale=4 Y=16:   ID ${bScale4_Y16} (${Module.UTF8ToString(Module._wasm_biome_name_ptr(ver, bScale4_Y16))})`);
          console.log(`    get_biome scale=4 Y=64:   ID ${bScale4_Y64} (${Module.UTF8ToString(Module._wasm_biome_name_ptr(ver, bScale4_Y64))})`);
          console.log(`    generate_biomes scale=4:  ID ${genVal} (${Module.UTF8ToString(Module._wasm_biome_name_ptr(ver, genVal))})`);
          console.log(`    get_biome scale=1 Y=-64:  ID ${bScale1_YNeg64} (${Module.UTF8ToString(Module._wasm_biome_name_ptr(ver, bScale1_YNeg64))})`);
        }
      }

      Module._wasm_destroy(ctx);
    }
  }
}
run();
