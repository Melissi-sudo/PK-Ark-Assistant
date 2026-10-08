import createModule from 'seedmaps-engine-wasm';
import fs from 'fs';
import path from 'path';
import { BIOME_ID_COLOR_MAP, getBiomeVisual } from '../src/lib/minecraftSeedEngine.ts';

async function run() {
  const wasmPath = path.resolve('./node_modules/seedmaps-engine-wasm/dist/seed_engine.wasm');
  const wasmBinary = fs.readFileSync(wasmPath);
  const Module = await createModule({ wasmBinary });

  const testSeeds = [7392817491n, 12345n, 867530942n, 1948274921n, 0n, -4920194829n];
  const allEncounteredIds = new Set();
  const unknownIds = new Set();

  for (const seed of testSeeds) {
    const u64 = BigInt.asUintN(64, seed);
    const s_hi = Number(u64 >> 32n);
    const s_lo = Number(u64 & 0xffffffffn);
    const ctx = Module._wasm_create(26, 0, s_hi, s_lo);

    // Sample 20,000 points across a 10,000 x 10,000 area
    for (let z = -5000; z <= 5000; z += 100) {
      for (let x = -5000; x <= 5000; x += 100) {
        const id = Module._wasm_ctx_get_biome(ctx, 1, x, 64, z);
        allEncounteredIds.add(id);
        if (!BIOME_ID_COLOR_MAP[id]) {
          unknownIds.add(id);
        }
      }
    }
    Module._wasm_destroy(ctx);
  }

  console.log('Total unique biome IDs encountered in Overworld:', allEncounteredIds.size);
  console.log('List of encountered IDs:', Array.from(allEncounteredIds).sort((a,b)=>a-b));
  console.log('Unknown IDs not in BIOME_ID_COLOR_MAP:', Array.from(unknownIds));
  for (const id of allEncounteredIds) {
    const name = Module.UTF8ToString(Module._wasm_biome_name_ptr(26, id));
    console.log(`  ID ${id}: "${name}" -> inMap: ${!!BIOME_ID_COLOR_MAP[id]}`);
  }
}
run();
