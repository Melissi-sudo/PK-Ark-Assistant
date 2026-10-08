import createModule from 'seedmaps-engine-wasm';
import { parseMinecraftSeed, MinecraftSeedSession } from '../src/lib/minecraftSeedEngine';

async function test() {
  const mod = await createModule();
  const seed = parseMinecraftSeed('7392817491');
  const session = new MinecraftSeedSession(mod, seed, 26, 'overworld'); // 1.21.1

  console.log('Seed:', seed.toString());
  const spawn = session.getSpawn();
  console.log('Spawn:', spawn);

  // Check getBiomeAt around spawn
  const bSpawn = session.getBiomeAt(spawn.x, 64, spawn.z, 1);
  console.log('Spawn biome (scale 1):', bSpawn);

  const bSpawnScale4 = session.getBiomeAt(spawn.x, 64, spawn.z, 4);
  console.log('Spawn biome (scale 4):', bSpawnScale4);

  // Check generateBiomeGrid at spawn tile
  const tileX = Math.floor(spawn.x / 256);
  const tileZ = Math.floor(spawn.z / 256);
  const startBlockX = tileX * 256;
  const startBlockZ = tileZ * 256;
  const grid = session.generateBiomeGrid(startBlockX, startBlockZ, 64, 64, 4, 64);
  
  // Compare grid sample at (spawn.x, spawn.z)
  const sampleX = Math.floor((spawn.x - startBlockX) / 4);
  const sampleZ = Math.floor((spawn.z - startBlockZ) / 4);
  const gridId = grid[sampleZ * 64 + sampleX];
  console.log(`Grid ID at spawn sample (${sampleX}, ${sampleZ}):`, gridId, 'vs getBiomeAt (scale 1):', bSpawn.id, 'vs getBiomeAt (scale 4):', bSpawnScale4.id);

  // Check 10 points in the tile to verify exact match between getBiomeAt and generateBiomeGrid
  console.log('\nPoint by point comparison (scale 4):');
  let mismatchCount = 0;
  for (let sz = 0; sz < 10; sz++) {
    for (let sx = 0; sx < 10; sx++) {
      const bx = startBlockX + sx * 4;
      const bz = startBlockZ + sz * 4;
      const pointBiome = session.getBiomeAt(bx, 64, bz, 4);
      const gridBiome = grid[sz * 64 + sx];
      if (pointBiome.id !== gridBiome) {
        console.log(`Mismatch at (${bx}, ${bz}): getBiomeAt=${pointBiome.id} (${pointBiome.name}) vs grid=${gridBiome}`);
        mismatchCount++;
      }
    }
  }
  console.log(`Checked 100 points, mismatches: ${mismatchCount}`);

  // Test Mushroom Fields coordinate test:
  // Let's search a 2000x2000 area around 0,0 to see where Mushroom Fields (ID 14) are found
  console.log('\nSearching for Mushroom Fields in 2000x2000 region around 0,0:');
  const mfLocations: {x: number, z: number, id: number}[] = [];
  for (let z = -1000; z <= 1000; z += 64) {
    for (let x = -1000; x <= 1000; x += 64) {
      const b = session.getBiomeAt(x, 64, z, 4);
      if (b.id === 14 || b.id === 15) {
        mfLocations.push({ x, z, id: b.id });
      }
    }
  }
  console.log(`Found ${mfLocations.length} mushroom field sample points:`, mfLocations.slice(0, 5));
}

test().catch(console.error);
