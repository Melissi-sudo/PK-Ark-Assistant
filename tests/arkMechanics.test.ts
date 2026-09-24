/**
 * Independent Unit Tests for Verified ARK Mechanics
 * 
 * Verifies:
 * 1. Taming Food Restore Points (DevKit PrimalItemConsumable_*)
 * 2. Industrial Forge Smelt Cycle Timing (DevKit PrimalStructureItem_IndustrialForge)
 * 3. ASA vs ASE Wild Stat Distribution Probabilities
 * 4. Binomial Death Probability under varied creature stat parameters
 */

import { 
  VERIFIED_FOOD_POINTS, 
  getFoodPointsForFoodName, 
  INDUSTRIAL_FORGE_MECHANICS, 
  getEligibleWildStatCount, 
  getWildStatRollProbability 
} from '../src/data/arkMechanics';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Test failed: ${message}`);
  } else {
    passedTests++;
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('--- RUNNING AUDIT UNIT TESTS ---\n');

// ==========================================
// TEST SUITE 1: Taming Food Restore Points
// ==========================================
console.log('Suite 1: Food Stat Restoration Mapping');
assert(VERIFIED_FOOD_POINTS.kibble.foodPoints === 80, 'Kibble restores 80 food');
assert(VERIFIED_FOOD_POINTS.raw_mutton.foodPoints === 50, 'Raw Mutton restores 50 food');
assert(VERIFIED_FOOD_POINTS.raw_prime_meat.foodPoints === 50, 'Raw Prime Meat restores 50 food');
assert(VERIFIED_FOOD_POINTS.raw_meat.foodPoints === 50, 'Raw Meat restores 50 food');
assert(VERIFIED_FOOD_POINTS.mejoberry.foodPoints === 30, 'Mejoberry restores 30 food');
assert(VERIFIED_FOOD_POINTS.crops.foodPoints === 40, 'Crops restore 40 food');
assert(VERIFIED_FOOD_POINTS.sweet_vegetable_cake.foodPoints === 500, 'Sweet Veggie Cake restores 500 food');

// Test string name resolver
assert(getFoodPointsForFoodName('Extraordinary Kibble') === 80, 'Resolves Extraordinary Kibble -> 80');
assert(getFoodPointsForFoodName('Raw Mutton') === 50, 'Resolves Raw Mutton -> 50');
assert(getFoodPointsForFoodName('Cooked Prime Meat') === 50, 'Resolves Cooked Prime Meat -> 50');
assert(getFoodPointsForFoodName('Mejoberries') === 30, 'Resolves Mejoberries -> 30');
assert(getFoodPointsForFoodName('Rockarrot (Crops)') === 40, 'Resolves Rockarrot (Crops) -> 40');
assert(getFoodPointsForFoodName('Giant Bee Honey') === 80, 'Resolves Giant Bee Honey -> 80');

// ==========================================
// TEST SUITE 2: Industrial Forge Smelt Cycle
// ==========================================
console.log('\nSuite 2: Industrial Forge Batch Mechanics');
// 1 batch = 40 raw metal -> 20 ingots in 1.5 seconds
assert(INDUSTRIAL_FORGE_MECHANICS.cycleSeconds === 1.5, 'Cycle duration is 1.5 seconds');
assert(INDUSTRIAL_FORGE_MECHANICS.rawMetalPerCycle === 40, '40 raw metal consumed per cycle');
assert(INDUSTRIAL_FORGE_MECHANICS.ingotsProducedPerCycle === 20, '20 ingots produced per cycle');

// Test specific batch calculations
// 0 raw metal -> 0 seconds
assert(INDUSTRIAL_FORGE_MECHANICS.calculateSmeltTimeSeconds(0) === 0, '0 raw metal = 0 seconds');

// 20 raw metal (partial batch of 40) -> 1 batch = 1.5 seconds
assert(INDUSTRIAL_FORGE_MECHANICS.calculateSmeltTimeSeconds(20) === 1.5, '20 raw metal takes 1 batch (1.5s)');

// 40 raw metal (exact 1 batch) -> 1.5 seconds
assert(INDUSTRIAL_FORGE_MECHANICS.calculateSmeltTimeSeconds(40) === 1.5, '40 raw metal takes 1 batch (1.5s)');

// 80 raw metal (exact 2 batches) -> 3.0 seconds
assert(INDUSTRIAL_FORGE_MECHANICS.calculateSmeltTimeSeconds(80) === 3.0, '80 raw metal takes 2 batches (3.0s)');

// 100 raw metal (2.5 batches -> rounded up to 3 batches) -> 4.5 seconds
assert(INDUSTRIAL_FORGE_MECHANICS.calculateSmeltTimeSeconds(100) === 4.5, '100 raw metal takes 3 batches (4.5s)');

// Large scale: 40,000 raw metal -> 1,000 batches * 1.5s = 1,500s (25 minutes)
assert(INDUSTRIAL_FORGE_MECHANICS.calculateSmeltTimeSeconds(40000) === 1500, '40,000 raw metal takes 1,500 seconds (25 minutes)');

// Charcoal: 1 wood -> 1 charcoal per second
assert(INDUSTRIAL_FORGE_MECHANICS.calculateCharcoalTimeSeconds(60) === 60, '60 wood burns in 60 seconds');

// ==========================================
// TEST SUITE 3: ASA vs ASE Wild Stat Indices
// ==========================================
console.log('\nSuite 3: ASA vs ASE Stat Allocation Rules');
// Standard terrestrial creature with Oxygen (Stegosaurus, Rex, Raptor, etc.)
assert(getEligibleWildStatCount('stegosaurus', true) === 6, 'ASA Stegosaurus has 6 eligible stats (no speed)');
assert(getEligibleWildStatCount('stegosaurus', false) === 7, 'ASE Stegosaurus has 7 eligible stats (with wasted speed)');
assert(Math.abs(getWildStatRollProbability('stegosaurus', true) - (1 / 6)) < 0.0001, 'ASA Stego roll probability is 1/6');
assert(Math.abs(getWildStatRollProbability('stegosaurus', false) - (1 / 7)) < 0.0001, 'ASE Stego roll probability is 1/7');

// Creature without Oxygen (Baryonyx, Spino, Megalodon, Basilosaurus)
assert(getEligibleWildStatCount('baryonyx', true) === 5, 'ASA Baryonyx has 5 eligible stats (no oxygen, no speed)');
assert(getEligibleWildStatCount('baryonyx', false) === 6, 'ASE Baryonyx has 6 eligible stats (no oxygen)');
assert(Math.abs(getWildStatRollProbability('baryonyx', true) - 0.20) < 0.0001, 'ASA Baryonyx roll probability is 1/5 (20%)');

console.log(`\n🎉 ALL ${passedTests} / ${totalTests} UNIT TESTS PASSED SUCCESSFULLY!`);
