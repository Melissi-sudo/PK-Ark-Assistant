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

  console.log('Function arity check:');
  console.log('_wasm_structure_pos length:', Module._wasm_structure_pos.length);
  console.log('_wasm_structure_viable length:', Module._wasm_structure_viable.length);
  console.log('_wasm_ctx_structure_viable length:', Module._wasm_ctx_structure_viable.length);

  // Let's test calling _wasm_structure_viable and _wasm_ctx_structure_viable with different arguments
  const posPtr = Module._malloc(16);

  // Let's test Ruined Portal (11):
  // Region (0, 0):
  Module._wasm_structure_pos(11, version, s_hi, s_lo, 0, 0, posPtr);
  const x = Module.getValue(posPtr, 'i32');
  const z = Module.getValue(posPtr + 4, 'i32');
  console.log(`Ruined Portal candidate at block (${x}, ${z}), chunk (${x >> 4}, ${z >> 4})`);

  // What biome is at this coordinate?
  const b = Module._wasm_ctx_get_biome(ctx, 1, x, 64, z);
  const bName = Module.UTF8ToString(Module._wasm_biome_name_ptr(version, b));
  console.log(`Biome at (${x}, 64, ${z}): ID ${b} (${bName})`);

  // Let's test _wasm_structure_viable: length is 3!
  // What are the 3 arguments to _wasm_structure_viable?
  // Is it: (structId, version, biomeId)?
  for (let biome = 0; biome < 50; biome++) {
    const res = Module._wasm_structure_viable(11, version, biome);
    if (res !== 0) {
      const name = Module.UTF8ToString(Module._wasm_biome_name_ptr(version, biome));
      console.log(`_wasm_structure_viable(11, ${version}, biome=${biome} [${name}]) = ${res}`);
    }
  }

  // Also test for Desert Pyramid (1), Jungle Pyramid (2), Swamp Hut (3), Igloo (4), Village (5), Ocean Monument (8), Mansion (9)
  for (const sId of [1, 2, 3, 4, 5, 8, 9, 11, 13, 24]) {
    const sName = Module.UTF8ToString(Module._wasm_structure_name_ptr(sId));
    let viableBiomes = [];
    for (let biome = 0; biome < 200; biome++) {
      const res = Module._wasm_structure_viable(sId, version, biome);
      if (res === 1) {
        viableBiomes.push(Module.UTF8ToString(Module._wasm_biome_name_ptr(version, biome)));
      }
    }
    console.log(`Structure ${sId} (${sName}): ${viableBiomes.length} viable biomes -> [${viableBiomes.slice(0, 6).join(', ')}...]`);
  }

  // Now, what did _wasm_ctx_structure_viable do?!
  console.log('\n--- Testing _wasm_ctx_structure_viable ---');
  // Look at Function v from earlier disassembly:
  // It called func 45 with: (ctx, ?, ?)
  // What does _wasm_ctx_structure_viable return for different calls?
  console.log('Call 1: (ctx, 11, x >> 4, z >> 4):', Module._wasm_ctx_structure_viable(ctx, 11, x >> 4, z >> 4));
  console.log('Call 2: (ctx, 11, x, z):', Module._wasm_ctx_structure_viable(ctx, 11, x, z));
  console.log('Call 3: (ctx, s_hi, s_lo, ...):', Module._wasm_ctx_structure_viable(ctx, s_hi, s_lo, 0));

  Module._free(posPtr);
  Module._wasm_destroy(ctx);
}
run();
