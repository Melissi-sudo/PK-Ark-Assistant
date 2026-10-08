import createModule from 'seedmaps-engine-wasm';

async function test() {
  const mod = await createModule();
  const ctx = mod._wasm_create(26, 0, 1, 3097851891); // 1.21.1, seed 7392817491

  console.log('Searching for Mushroom Fields in 5000x5000 area around 0,0:');
  const mfList = [];
  for (let bz = -2500; bz <= 2500; bz += 32) {
    for (let bx = -2500; bx <= 2500; bx += 32) {
      const b = mod._wasm_ctx_get_biome(ctx, 1, bx, 64, bz);
      if (b === 14 || b === 15) {
        mfList.push({ bx, bz, b });
      }
    }
  }
  console.log(`Found ${mfList.length} mushroom field points. First 10:`, mfList.slice(0, 10));

  // What about at Y=320 or Y=16 or Y=-64?
  for (let y of [-64, 0, 16, 64, 128, 256, 320]) {
    let count = 0;
    for (let bz = -500; bz <= 500; bz += 64) {
      for (let bx = -500; bx <= 500; bx += 64) {
        const b = mod._wasm_ctx_get_biome(ctx, 1, bx, y, bz);
        if (b === 14 || b === 15) count++;
      }
    }
    console.log(`Mushroom fields count at Y=${y}: ${count}`);
  }
}

test().catch(console.error);
