import createModule from 'seedmaps-engine-wasm';

// Standard Minecraft Java Edition Structure Placement Algorithm (ChunkGenerator.java):
// For a region (rx, rz):
// seed = worldSeed + salt + rx * 341873128712 + rz * 132897987541
// JavaRandom(seed)
// chunkX = rx * spacing + rng.nextInt(spacing - separation)
// chunkZ = rz * spacing + rng.nextInt(spacing - separation)
// In Java 1.18+: (rx * spacing + rng.nextInt(spacing - separation))
class JavaRandom {
  constructor(seed) {
    this.seed = (seed ^ 0x5DEECE66DEn) & ((1n << 48n) - 1n);
  }
  next(bits) {
    this.seed = (this.seed * 0x5DEECE66DEn + 0xBn) & ((1n << 48n) - 1n);
    return Number(this.seed >> (48n - BigInt(bits)));
  }
  nextInt(bound) {
    if (bound <= 0) return 0;
    if ((bound & -bound) === bound) {
      return Number((BigInt(bound) * BigInt(this.next(31))) >> 31n);
    }
    let bits, val;
    do {
      bits = this.next(31);
      val = bits % bound;
    } while (bits - val + (bound - 1) < 0);
    return val;
  }
}

function getJavaStructureChunk(worldSeed, salt, spacing, separation, rx, rz) {
  // In Java 1.14+:
  // regionSeed = rx * 341873128712L + rz * 132897987541L + worldSeed + salt
  const k1 = 341873128712n;
  const k2 = 132897987541n;
  const regionSeed = BigInt.asIntN(64, BigInt(rx) * k1 + BigInt(rz) * k2 + worldSeed + BigInt(salt));
  const rng = new JavaRandom(regionSeed);
  const maxOffset = spacing - separation;
  const cx = rx * spacing + rng.nextInt(maxOffset);
  const cz = rz * spacing + rng.nextInt(maxOffset);
  return { cx, cz, x: cx * 16, z: cz * 16 };
}

async function test() {
  const mod = await createModule();
  const seed = 7392817491n;
  const u64 = BigInt.asUintN(64, seed);
  const s_hi = Number(u64 >> 32n);
  const s_lo = Number(u64 & 0xffffffffn);
  const posPtr = mod._malloc(16);

  console.log('Comparing Java reference vs WASM for Overworld Ruined Portal (spacing 40, separation 15, salt 34222645):');
  let match = 0;
  for (let rx = -3; rx <= 3; rx++) {
    for (let rz = -3; rz <= 3; rz++) {
      const java = getJavaStructureChunk(seed, 34222645, 40, 15, rx, rz);
      mod._wasm_structure_pos(11, 26, s_hi, s_lo, rx, rz, posPtr);
      const wasmX = mod.getValue(posPtr, 'i32');
      const wasmZ = mod.getValue(posPtr + 4, 'i32');
      if (java.x === wasmX && java.z === wasmZ) match++;
      else console.log(`Mismatch at (${rx}, ${rz}): java=(${java.x}, ${java.z}) vs wasm=(${wasmX}, ${wasmZ})`);
    }
  }
  console.log(`Matched: ${match} / 49`);
}

test().catch(console.error);
