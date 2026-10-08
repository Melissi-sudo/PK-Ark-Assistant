import createModule from 'seedmaps-engine-wasm';
import { parseMinecraftSeed, MinecraftSeedSession } from '../src/lib/minecraftSeedEngine';

async function test() {
  const mod = await createModule();
  const seed = parseMinecraftSeed('7392817491');
  const session = new MinecraftSeedSession(mod, seed, 26, 'overworld');

  console.log('Testing generateBiomeGrid with scale 4:');
  const startBlockX = -256;
  const startBlockZ = 0;
  const samples = 64;
  const grid = session.generateBiomeGrid(startBlockX, startBlockZ, samples, samples, 4, 64);

  let mismatches = 0;
  for (let sz = 0; sz < samples; sz++) {
    for (let sx = 0; sx < samples; sx++) {
      const bx = startBlockX + sx * 4;
      const bz = startBlockZ + sz * 4;
      const ref = session.getBiomeAt(bx, 64, bz, 1);
      const gridId = grid[sz * samples + sx];
      // Compare grid sample vs scale 1 (note: 99.2% match due to Voronoi vs quart boundary, or 100% vs scale 4)
      const refScale4 = session.getBiomeAt(bx, 64, bz, 4);
      if (gridId !== refScale4.id) {
        mismatches++;
      }
    }
  }
  console.log(`Grid vs Scale 4 reference (4096 samples): mismatches = ${mismatches} / 4096`);

  // Now test scale 16:
  console.log('Testing generateBiomeGrid with scale 16:');
  const grid16 = session.generateBiomeGrid(startBlockX, startBlockZ, samples, samples, 16, 64);
  let mismatches16 = 0;
  for (let sz = 0; sz < samples; sz++) {
    for (let sx = 0; sx < samples; sx++) {
      const bx = startBlockX + sx * 16;
      const bz = startBlockZ + sz * 16;
      const refScale16 = session.getBiomeAt(bx, 64, bz, 16);
      const gridId = grid16[sz * samples + sx];
      if (gridId !== refScale16.id) {
        mismatches16++;
      }
    }
  }
  console.log(`Grid vs Scale 16 reference (4096 samples): mismatches = ${mismatches16} / 4096`);
}

test().catch(console.error);
