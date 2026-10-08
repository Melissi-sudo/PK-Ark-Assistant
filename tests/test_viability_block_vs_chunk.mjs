import createModule from 'seedmaps-engine-wasm';
import fs from 'fs';
import path from 'path';

async function run() {
  const wasmPath = path.resolve('./node_modules/seedmaps-engine-wasm/dist/seed_engine.wasm');
  const wasmBinary = fs.readFileSync(wasmPath);
  const Module = await createModule({ wasmBinary });

  const seed = 7392817491n;
  const u64 = BigInt.asUintN(64, seed);
  const s_hi = Number(u64 >> 32n);
  const s_lo = Number(u64 & 0xffffffffn);
  const version = 26; // 1.21.1
  const ctx = Module._wasm_create(version, 0, s_hi, s_lo);

  const posPtr = Module._malloc(16);

  console.log('=== TESTING STRUCTURE VIABILITY: BLOCK VS CHUNK COORDS ===');

  // Let's test several structures in region (0, 0)
  for (const sId of [5, 11, 13, 24]) {
    const sName = Module.UTF8ToString(Module._wasm_structure_name_ptr(sId));
    Module._wasm_structure_pos(sId, version, s_hi, s_lo, 0, 0, posPtr);
    const x = Module.getValue(posPtr, 'i32');
    const z = Module.getValue(posPtr + 4, 'i32');

    // Test with block coords (x, z)
    const viableBlock = Module._wasm_ctx_structure_viable(ctx, sId, x, z);
    // Test with chunk coords (x >> 4, z >> 4)
    const viableChunk = Module._wasm_ctx_structure_viable(ctx, sId, x >> 4, z >> 4);

    const biomeAtBlock = Module._wasm_ctx_get_biome(ctx, 1, x, 64, z);
    const biomeAtChunkAsBlock = Module._wasm_ctx_get_biome(ctx, 1, x >> 4, 64, z >> 4);

    console.log(`\nStructure ${sId} (${sName}) at block (${x}, ${z}):`);
    console.log(`  Biome at block (${x}, ${z}): ID ${biomeAtBlock} (${Module.UTF8ToString(Module._wasm_biome_name_ptr(version, biomeAtBlock))})`);
    console.log(`  Biome at chunk-as-block (${x >> 4}, ${z >> 4}): ID ${biomeAtChunkAsBlock} (${Module.UTF8ToString(Module._wasm_biome_name_ptr(version, biomeAtChunkAsBlock))})`);
    console.log(`  Viability when passing BLOCK (${x}, ${z}): ${viableBlock}`);
    console.log(`  Viability when passing CHUNK (${x >> 4}, ${z >> 4}): ${viableChunk}`);
  }

  Module._free(posPtr);
  Module._wasm_destroy(ctx);
}
run();
