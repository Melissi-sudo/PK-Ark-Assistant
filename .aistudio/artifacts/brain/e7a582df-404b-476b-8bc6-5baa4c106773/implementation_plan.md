# Rust Tactical Companion: Raid, Upkeep & Combat Suite

Architectural blueprint for integrating Rust into the multi-game companion hub alongside ARK: Survival Ascended, Minecraft 1.21+, and Terraria 1.4.4+. This addition delivers a dedicated tactical operations suite engineered for competitive survival players, raid leaders, base architects, and solo survivors.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during Phase 1 clarification:
> - **Game Selection**: Rust
> - **Feature Scope**: Full multi-tool companion hub (raid calculations, base upkeep & decay math, weapon TTK & ballistics, tech tree scrap planner, and electrical quick-reference).
> 
> **Theme & Routing Decisions**:
> - **Theme Accent**: Industrial Oxide & Hazard Orange (`#f97316` / `#ea580c`) with weathered gunmetal slate (`#0e1217`, `#161c24`) and radioactive amber indicators.
> - **Top Bar Integration**: Added as a 4th dedicated game tab in the top navigation bar with clean responsive label adaptation (`Rust` / `Rust Tactical`).

---

## 1. Overview & Core Concept

### What It Does
The Rust Tactical Companion provides hardcore survivalists with high-precision mathematical models and tactical planners for Rust. Instead of guessing how much sulfur a raid target requires, how long a base will survive before decaying, or what armor combination survives an AK headshot, players get instant, authoritative calculations with zero latency.

### Target Audience & Persona
- **Clan Raid Leaders & Roam Squads**: Accurately calculating sulfur, explosive quantities (C4, Rockets, Satchels, Explo 5.56), and craft times before roaming.
- **Base Builders & Upkeep Managers**: Planning base footprints, tracking TC (Tool Cupboard) consumption across material tiers, and scheduling refueling runs.
- **PVP Duelists & Roamers**: Analyzing weapon time-to-kill (TTK), damage falloff, and headshot damage against wood, roadsign, and full metal kits.
- **Wipe-Day Progression Enthusiasts**: Calculating the exact scrap required to tech down workbenches to critical blueprints (Garage Door, Syringes, Thompson, Rocket Launcher).

### Key Value
- **Zero-Waste Raiding**: Avoid running out of rockets mid-raid with complete compound shopping lists.
- **Real Decay Math**: Accounts for the official Rust non-linear upkeep scaling curve based on total structure count.
- **Offline & Instant**: Client-side reactive calculations with shimmer transitions and instant responsiveness.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Hub Discovery**:
   - Player visits `/library` or clicks the new `Rust` tab in the top navigation.
   - Dedicated game card highlights the 5 tactical modules with direct launch links.
2. **Multi-Target Raid Calculator (`/rust/raid`)**:
   - Player selects target structure types (e.g., 2 Garage Doors, 1 Sheet Metal Wall, 1 High External Stone Wall, 2 Auto Turrets).
   - Chooses preferred explosive mix or clicks "Optimal Lowest Sulfur".
   - App computes total explosives required, complete raw material breakdown (Sulfur, Charcoal, Gunpowder, Low Grade, Metal Frags, Tech Trash, Pipes), and craft time.
   - Includes eco-raid alternatives (spear/fire-arrow soft-side costs and tool counts).
3. **Base Upkeep & Decay Simulator (`/rust/upkeep`)**:
   - Player enters block counts for Wood, Stone, Sheet Metal, and Armored (HQM) foundations/walls.
   - Interactive TC visualizer computes exact 24h consumption, tax brackets, and hours remaining based on current stored resources.
4. **Combat TTK & Ballistics Matrix (`/rust/combat`)**:
   - Interactive target dummy: select armor kit (Naked, Wood, Roadsign, Full Metal, Heavy Plate).
   - Compare weapons (AK-47, MP5, Thompson, SAR, Bolty, Custom, Bow/Crossbow) with distance slider (0m to 150m) and ammo selector (Standard, HV, Incendiary, Explosive).
   - Real-time hit-to-kill counts, headshot multipliers, and time-to-kill charts.
5. **Tech Tree & Monument Scrap Planner (`/rust/techtree`)**:
   - Interactive visual tree for Workbench Tier 1, 2, and 3.
   - Select desired target items (e.g., Garage Door + Syringe); computes direct scrap path cost vs. total branch cost.
   - Monument loot estimator: estimates scrap, keycards, and component yields per run.

### Visual Identity & Theme
- **Aesthetic Direction**: Gritty industrial survival, oxidized metal plates, warning hazard stripes, weathered rivets, military tactical UI.
- **Color Palette (60-30-10 Rule)**:
  - **60% Neutral Canvas**: Deep oxide charcoal (`#0c0f13`), industrial gunmetal (`#13181f`).
  - **30% Structural Surfaces**: Weathered steel cards (`#1a212b`), dark hairline borders (`#2b3544`), muted steel labels (`#94a3b8`).
  - **10% High-Intent Accent**: Industrial Rust Oxide Orange (`#f97316` / `#ea580c`), radioactive hazard amber (`#f59e0b`).
- **Typography & Hierarchy**:
  - *Display / Titles*: `Oswald` / `Plus Jakarta Sans` with bold uppercase tracking for military industrial titles.
  - *Data & Calculations*: `JetBrains Mono` and `tabular-nums` for all raw sulfur, explosive quantities, hit counters, and countdown timers.
  - *Body Prose*: Clean, highly legible sans (`Plus Jakarta Sans`).
- **Anti-Slop Discipline**:
  - No fake version numbers or decorative pulsing dots.
  - Clean unboxed metadata with `·` separators.
  - Single-line controls with `whitespace-nowrap shrink-0` across all tabs and buttons.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full Multi-Tool Suite vs. Standalone Raid Calc**
  - *Chosen Approach*: Implement a cohesive multi-tab Rust Companion (`/rust` with subtabs `/rust/raid`, `/rust/upkeep`, `/rust/combat`, `/rust/techtree`).
  - *Why*: User explicitly requested a "Full multi-tool companion hub" providing parity with the comprehensive ARK, Minecraft, and Terraria suites.
  - *Alternatives Considered*: A single-page raid calculator would leave base builders and roamers without upkeep or ballistics tools.

- **Decision 2: Authoritative Rust Upkeep Tax Curve**
  - *Chosen Approach*: Implement the true Facepunch decay formula with tiered progressive tax brackets ($0\text{--}15$ blocks: $10\%$, $16\text{--}40$: $15\%$, $41\text{--}75$: $20\%$, $>75$: $33.3\%$).
  - *Why*: Flat estimates in other calculators are inaccurate for large compounds or multi-TC designs; exact math gives players confidence their bases will not decay overnight.

- **Decision 3: Multi-Target Raid Shopping Cart**
  - *Chosen Approach*: Allow users to build an entire raid target list (e.g. 4 Garage Doors + 2 Armored Doors + 1 External Wall) rather than calculating one entity at a time.
  - *Why*: Real raids involve multiple doors and walls; a unified shopping cart computes aggregate sulfur and craft components in one click.

---

## 4. Technical Architecture & Data Strategy

### System Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Navbar & Game Switcher                      │
│        [Library] · [ARK Ascended] · [Minecraft] · [Terraria] · [Rust]  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    Rust Companion Hub (/rust)                          │
│   Tab Bar: [Raid Calculator] [Base Upkeep] [Combat TTK] [Tech Tree]    │
└───────────┬───────────────────┬─────────────────┬──────────────────┬───┘
            │                   │                 │                  │
            ▼                   ▼                 ▼                  ▼
┌──────────────────┐ ┌──────────────────┐ ┌───────────────┐ ┌────────────────┐
│ RaidCalculator   │ │ BaseUpkeepCalc   │ │ CombatTTK     │ │ TechTreeScrap  │
│ - Structure Pick │ │ - Block counts   │ │ - Armor Kit   │ │ - WB 1/2/3     │
│ - Explosive Mix  │ │ - Tier selection │ │ - Weapon Pick │ │ - Path Calc    │
│ - Raw Sulfur Math│ │ - Tax brackets   │ │ - Ammo Type   │ │ - Monument Loot│
│ - Eco Raid Guide │ │ - Decay hours    │ │ - Hit-to-Kill │ │ - Scrap Goal   │
└──────────────────┘ └──────────────────┘ └───────────────┘ └────────────────┘
            │                   │                 │                  │
            └───────────────────┴────────┬────────┴──────────────────┘
                                         ▼
┌────────────────────────────────────────────────────────────────────────┐
│                Rust Data Engine (src/data/rustData.ts)                 │
│  - Structures & Durability HP (Door, Wall, Turret, SAM)                │
│  - Explosives & Damage Profiles (C4, Rocket, Satchel, Explo 5.56)      │
│  - Raw Crafting Recipes (Sulfur, Charcoal, Metal, Pipes, Low Grade)    │
│  - Upkeep Bracket Tax Formula Tables                                   │
│  - Weapon Fire Rates, Damage Falloff & Armor Protection Percentages    │
│  - Workbench Blueprints & Scrap Unlock Tree Node Data                  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Structures & State Model

```typescript
// Core Raid Target Entity
interface RaidTarget {
  id: string;
  name: string;
  category: 'doors' | 'walls' | 'deployables';
  hp: number;
  durability: Record<ExplosiveType, number>; // exact count needed
  softSideDurability?: Record<string, number>; // eco raid options
}

// Explosive Specifications & Recipe Cost
interface ExplosiveCost {
  type: ExplosiveType;
  name: string;
  sulfur: number;
  charcoal: number;
  gunpowder: number;
  metalFrags: number;
  lowGrade: number;
  pipes: number;
  techTrash: number;
  craftTimeSeconds: number;
}

// Base Upkeep Structure Input
interface UpkeepBlockInput {
  woodBlocks: number;
  stoneBlocks: number;
  metalBlocks: number;
  hqmBlocks: number;
}
```

### Interactive State Transitions & UI Polish
- **Responsive Layout**: Adheres to the 1440px desktop baseline with full responsiveness on mobile.
- **Shimmer Skeletons**: Integrated into `PageTransitionSkeleton.tsx` for `/rust` routes with an industrial rust/amber accent shimmer.
- **Fast Reset Handlers**: Clear raid target cart, reset upkeep values, and test different armor loads with single-click reset controls.
- **Copy Shopping List**: 1-click clipboard export formatting the raid shopping list for clan Discord or in-game chat.
