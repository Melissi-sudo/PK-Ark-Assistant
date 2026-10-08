import createModule from 'seedmaps-engine-wasm';
import { parseMinecraftSeed, MinecraftSeedSession } from '../src/lib/minecraftSeedEngine.js';

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
  console.log(`Grid ID at spawn sample (${sampleX}, ${sampleZ}):`, gridId, 'vs getBiomeAt:', bSpawn.id);

  // Test mushroom fields across 20 points
  console.log('\nChecking for any mushroom fields in grid:');
  let mushroomCount = 0;
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] === 14 || grid[i] === 15) {
      mushroomCount++;
    }
  }
  console.log('Mushroom fields in spawn tile:', mushroomCount, '/ 4096');
}

test().catch(console.error);
