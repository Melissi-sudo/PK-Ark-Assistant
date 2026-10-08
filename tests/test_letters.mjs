import createModule from 'seedmaps-engine-wasm';
import fs from 'fs';
import path from 'path';

async function run() {
  const wasmPath = path.resolve('./node_modules/seedmaps-engine-wasm/dist/seed_engine.wasm');
  const wasmBinary = fs.readFileSync(wasmPath);
  const Module = await createModule({ wasmBinary });

  console.log('Testing each export letter:');
  const letters = ['o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x'];
  for (const l of letters) {
    // Check if exported
    console.log(`Letter '${l}': type=${typeof Module['_' + l]}`);
  }
}
run();
