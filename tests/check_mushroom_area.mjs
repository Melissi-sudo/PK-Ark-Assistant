import createModule from 'seedmaps-engine-wasm';
import fs from 'fs';
import path from 'path';

async function run() {
  const wasmPath = path.resolve('./node_modules/seedmaps-engine-wasm/dist/seed_engine.wasm');
  const wasmBinary = fs.readFileSync(wasmPath);
  const Module = await createModule({ wasmBinary });

  const seed = 12345n;
  const u64 = BigInt.asUintN(64, seed);
  const s_hi = Number(u64 >> 32n);
  const s_lo = Number(u64 & 0xffffffffn);
  const ctx = Module._wasm_create(26, 0, s_hi, s_lo);

  console.log('Biomes around (1904, -2000) for seed 12345:');
  for (let z = -2050; z <= -1900; z += 25) {
    let line = `z=${z}: `;
    for (let x = 1850; x <= 2000; x += 25) {
      const b = Module._wasm_ctx_get_biome(ctx, 1, x, 64, z);
      const name = Module.UTF8ToString(Module._wasm_biome_name_ptr(26, b));
      line += `${name}(${x},${z}) `;
    }
    console.log(line);
  }

  Module._wasm_destroy(ctx);
}
run();
