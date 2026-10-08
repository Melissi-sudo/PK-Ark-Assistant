import createModule from 'seedmaps-engine-wasm';

async function test() {
  const mod = await createModule();
  const s_hi = 1;
  const s_lo = 3097851891;
  const ctx = mod._wasm_create(26, 0, s_hi, s_lo);

  const startX = -64;
  const startZ = 128;
  const cols = 10;
  const rows = 10;
  const scale = 4;
  const y = 64;

  const bufPtr = mod._malloc(cols * rows * 4);
  mod._wasm_ctx_generate_biomes(ctx, startX, startZ, cols, rows, scale, y, bufPtr);

  // Check all possible indexings and coordinate assignments:
  // 1: Normal: cell (r, c) is at offset (r * cols + c), coords (startX + c*scale, startZ + r*scale)
  // 2: Transposed buffer: cell (r, c) is at offset (c * rows + r)
  // 3: Inverted axis: coords (startX + r*scale, startZ + c*scale)
  // 4: What if startX and startZ in generate_biomes are quart coordinates? (e.g. startX/4, startZ/4)?
  // 5: What if scale is 1 in getBiomeAt?
  // Let's compute mismatches for all permutations!

  const perms = [
    {
      name: 'Normal (offset = r*cols + c, x = startX + c*scale, z = startZ + r*scale, getBiome scale=4)',
      fn: (r, c) => ({
        grid: mod.getValue(bufPtr + (r * cols + c) * 4, 'i32'),
        ref: mod._wasm_ctx_get_biome(ctx, 4, startX + c * scale, y, startZ + r * scale)
      })
    },
    {
      name: 'Transposed coords (x = startX + r*scale, z = startZ + c*scale, getBiome scale=4)',
      fn: (r, c) => ({
        grid: mod.getValue(bufPtr + (r * cols + c) * 4, 'i32'),
        ref: mod._wasm_ctx_get_biome(ctx, 4, startX + r * scale, y, startZ + c * scale)
      })
    },
    {
      name: 'Transposed buffer (offset = c*rows + r, x = startX + c*scale, z = startZ + r*scale)',
      fn: (r, c) => ({
        grid: mod.getValue(bufPtr + (c * rows + r) * 4, 'i32'),
        ref: mod._wasm_ctx_get_biome(ctx, 4, startX + c * scale, y, startZ + r * scale)
      })
    },
    {
      name: 'Coords with getBiome scale=1 (x = startX + c*scale, z = startZ + r*scale)',
      fn: (r, c) => ({
        grid: mod.getValue(bufPtr + (r * cols + c) * 4, 'i32'),
        ref: mod._wasm_ctx_get_biome(ctx, 1, startX + c * scale, y, startZ + r * scale)
      })
    },
    {
      name: 'Quart coords: pass (startX/4, startZ/4) to generate_biomes',
      custom: () => {
        const qx = Math.floor(startX / 4);
        const qz = Math.floor(startZ / 4);
        mod._wasm_ctx_generate_biomes(ctx, qx, qz, cols, rows, scale, y, bufPtr);
        let mm = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const grid = mod.getValue(bufPtr + (r * cols + c) * 4, 'i32');
            const ref = mod._wasm_ctx_get_biome(ctx, 4, (qx + c) * 4, y, (qz + r) * 4);
            if (grid !== ref) mm++;
          }
        }
        return mm;
      }
    },
    {
      name: 'Quart coords with scale=1: pass (startX/4, startZ/4) and scale=1',
      custom: () => {
        const qx = Math.floor(startX / 4);
        const qz = Math.floor(startZ / 4);
        mod._wasm_ctx_generate_biomes(ctx, qx, qz, cols, rows, 1, y, bufPtr);
        let mm = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const grid = mod.getValue(bufPtr + (r * cols + c) * 4, 'i32');
            const ref = mod._wasm_ctx_get_biome(ctx, 1, qx + c, y, qz + r);
            if (grid !== ref) mm++;
          }
        }
        return mm;
      }
    }
  ];

  for (const p of perms) {
    if (p.custom) {
      console.log(`${p.name}: mismatches = ${p.custom()}`);
    } else {
      let mm = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const { grid, ref } = p.fn(r, c);
          if (grid !== ref) mm++;
        }
      }
      console.log(`${p.name}: mismatches = ${mm}`);
    }
  }

  mod._free(bufPtr);
  mod._wasm_destroy(ctx);
}

test().catch(console.error);
