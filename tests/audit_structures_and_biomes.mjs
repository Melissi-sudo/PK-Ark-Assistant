import createModule from 'seedmaps-engine-wasm';

async function main() {
  const mod = await createModule();
  console.log('Structure type count:', mod._wasm_structure_type_count ? mod._wasm_structure_type_count() : 'none');

  const structCount = mod._wasm_structure_type_count ? mod._wasm_structure_type_count() : 50;
  for (let i = 0; i < structCount; i++) {
    const namePtr = mod._wasm_structure_name_ptr ? mod._wasm_structure_name_ptr(i) : 0;
    const nameLen = mod._wasm_structure_name_length ? mod._wasm_structure_name_length(i) : 0;
    let name = 'unknown';
    if (namePtr && nameLen) {
      const bytes = new Uint8Array(mod.HEAPU8.buffer, namePtr, nameLen);
      name = new TextDecoder().decode(bytes);
    }
    const regionSize = mod._wasm_structure_region_size ? mod._wasm_structure_region_size(i) : 'none';
    console.log(`Structure ${i}: "${name}", regionSize=${regionSize}`);
  }
}

main().catch(console.error);
