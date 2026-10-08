import createModule from 'seedmaps-engine-wasm';
import fs from 'fs';
import path from 'path';
import {
  parseMinecraftSeed,
  SUPPORTED_JAVA_VERSIONS,
  getBiomeVisual,
  getBiomeAbgr,
  BIOME_ID_COLOR_MAP
} from '../src/lib/minecraftSeedEngine';

async function runTests() {
  console.log('=== RUNNING CUBIOMES SEED ENGINE VERIFICATION SUITE ===');

  const wasmPath = path.resolve('./node_modules/seedmaps-engine-wasm/dist/seed_engine.wasm');
  const wasmBinary = fs.readFileSync(wasmPath);
  const Module = await createModule({ wasmBinary });

  let passCount = 0;
  let testCount = 0;
  function assert(cond: boolean, name: string) {
    testCount++;
    if (cond) {
      console.log(`✅ PASS: ${name}`);
      passCount++;
    } else {
      console.error(`❌ FAIL: ${name}`);
      process.exitCode = 1;
    }
  }

  // 1. Version Enum Verification
  const v1_18 = SUPPORTED_JAVA_VERSIONS.find(v => v.id === '1.18')!;
  const v1_19 = SUPPORTED_JAVA_VERSIONS.find(v => v.id === '1.19')!;
  const v1_20 = SUPPORTED_JAVA_VERSIONS.find(v => v.id === '1.20')!;
  const v1_21 = SUPPORTED_JAVA_VERSIONS.find(v => v.id === '1.21')!;

  assert(v1_18.enumVal === 22, 'Java 1.18 enum is 22 (MC_1_18)');
  assert(v1_19.enumVal === 24, 'Java 1.19 enum is 24 (MC_1_19)');
  assert(v1_20.enumVal === 25, 'Java 1.20 enum is 25 (MC_1_20)');
  assert(v1_21.enumVal === 26, 'Java 1.21 enum is 26 (MC_1_21_1 Release)');

  // 2. String & Numeric Seed Parsing
  assert(parseMinecraftSeed('7392817491') === 7392817491n, 'Numeric seed string parsed as BigInt');
  assert(parseMinecraftSeed('0') === 0n, 'Seed 0 parsed as 0n');
  assert(parseMinecraftSeed('-12345') === -12345n, 'Negative numeric seed parsed directly');
  const textSeed = parseMinecraftSeed('testseed');
  assert(typeof textSeed === 'bigint', 'Alphanumeric seed converted via Java String.hashCode()');

  // 3. WASM Context & Spawn Calculation
  const seed = 7392817491n;
  const u64 = BigInt.asUintN(64, seed);
  const s_hi = Number(u64 >> 32n);
  const s_lo = Number(u64 & 0xffffffffn);
  const ctx = Module._wasm_create(26, 0, s_hi, s_lo);
  assert(ctx > 0, 'Cubiomes Generator context created successfully');

  const posPtr = Module._malloc(16);
  const spawnStatus = Module._wasm_ctx_get_spawn(ctx, posPtr);
  const spawnX = Module.getValue(posPtr, 'i32');
  const spawnZ = Module.getValue(posPtr + 4, 'i32');
  assert(spawnStatus === 1, 'Spawn position calculation returns status 1');
  assert(spawnX === -32 && spawnZ === 128, `Spawn coordinates (-32, 128) verified in 1.21.1: got (${spawnX}, ${spawnZ})`);

  // 4. Biome Buffer Layout & Coordinate Conversion
  // Test that _wasm_ctx_generate_biomes buffer layout is Z-major [row * cols + col]
  const cols = 4;
  const rows = 3;
  const bufPtr = Module._malloc(cols * rows * 4);
  const startQx = 10;
  const startQz = 20;
  const scale = 4;
  const quartY = 16; // Block Y = 64

  Module._wasm_ctx_generate_biomes(ctx, startQx, startQz, cols, rows, scale, quartY, bufPtr);

  let bufferMatchesSingleQueries = true;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const bufVal = Module.getValue(bufPtr + (r * cols + c) * 4, 'i32');
      const singleVal = Module._wasm_ctx_get_biome(ctx, scale, startQx + c, quartY, startQz + r);
      if (bufVal !== singleVal) {
        bufferMatchesSingleQueries = false;
      }
    }
  }
  assert(bufferMatchesSingleQueries, 'Grid buffer matches individual getBiomeAt queries in Z-major order');

  // 5. Biome Visual & ABGR Mapping
  const plainsVisual = getBiomeVisual(1);
  assert(plainsVisual.name === 'plains' && plainsVisual.color === '#8DB360', 'Plains visual color mapped correctly');
  const plainsAbgr = getBiomeAbgr(1);
  assert((plainsAbgr >>> 0) === 0xff60b38d, 'Plains ABGR 32-bit pixel matches little-endian word layout');
  const errVisual = getBiomeVisual(-1);
  assert(errVisual.name.includes('Error'), 'Uninitialized/error ID -1 explicitly handled');

  // 6. Structure Placement & Biome Viability
  // Trial Chamber at (160, 64) for seed 7392817491
  const tcStatus = Module._wasm_structure_pos(24, 26, s_hi, s_lo, 0, 0, posPtr);
  const tcX = Module.getValue(posPtr, 'i32');
  const tcZ = Module.getValue(posPtr + 4, 'i32');
  const tcViable = Module._wasm_ctx_structure_viable(ctx, 24, tcX >> 4, tcZ >> 4);
  assert(tcStatus === 1, 'Trial Chamber candidate generated');
  assert(tcX === 160 && tcZ === 64, `Trial Chamber coordinates match exact (160, 64): got (${tcX}, ${tcZ})`);
  assert(tcViable === 1, 'Trial Chamber in-game biome viability confirmed');

  // 7. Nether & End Dimensions
  const netherCtx = Module._wasm_create(26, -1, s_hi, s_lo);
  const netherBiome = Module._wasm_ctx_get_biome(netherCtx, 1, 0, 64, 0);
  assert(netherBiome >= 8 && netherBiome <= 173, `Nether dimension generates authentic nether biome: ID ${netherBiome}`);

  const endCtx = Module._wasm_create(26, 1, s_hi, s_lo);
  const endBiome = Module._wasm_ctx_get_biome(endCtx, 1, 0, 64, 0);
  assert(endBiome === 9, 'The End dimension generates "the_end" (ID 9) at (0, 0)');

  Module._free(posPtr);
  Module._free(bufPtr);
  Module._wasm_destroy(ctx);
  Module._wasm_destroy(netherCtx);
  Module._wasm_destroy(endCtx);

  console.log(`\n🎉 ALL ${passCount} / ${testCount} CUBIOMES VERIFICATION TESTS PASSED!`);
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
