import createModule from 'seedmaps-engine-wasm';

async function test() {
  const mod = await createModule();
  const s_hi = 1;
  const s_lo = 3097851891;
  const version = 26; // 1.21.1
  const posPtr = mod._malloc(16);

  console.log('Searching for Trial Chambers in regions -5 to 5:');
  for (let rx = -5; rx <= 5; rx++) {
    for (let rz = -5; rz <= 5; rz++) {
      const ok = mod._wasm_structure_pos(24, version, s_hi, s_lo, rx, rz, posPtr);
      if (ok === 1) {
        const x = mod.getValue(posPtr, 'i32');
        const z = mod.getValue(posPtr + 4, 'i32');
        if (Math.abs(x - 160) < 300 && Math.abs(z - 64) < 300) {
          console.log(`Found Trial Chamber candidate near (160, 64): rx=${rx}, rz=${rz}, x=${x}, z=${z}, chunk=(${x>>4}, ${z>>4})`);
        }
      }
    }
  }

  // Also check region size of Trial Chamber:
  console.log('Trial Chamber regSize:', mod._wasm_structure_region_size(24, version));
}

test().catch(console.error);
