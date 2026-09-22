import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Sparkles, 
  ChevronRight,
  Flame,
  Zap,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TurretSoakerGuide: React.FC = () => {
  const [selectedSoaker, setSelectedSoaker] = useState<'stego' | 'trike' | 'carbonemys'>('stego');
  const [stegoVariant, setStegoVariant] = useState<'regular' | 'tek'>('regular');

  return (
    <div className="space-y-6">
      {/* Header Banner replicating ARK Ascended UI style with cyan bracket highlights */}
      <div className="relative bg-[#070e1a] border-2 border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* ARK HUD Corner Accents */}
        <div className="absolute top-2 left-2 text-cyan-400 font-mono text-xs opacity-60">┌──</div>
        <div className="absolute top-2 right-2 text-cyan-400 font-mono text-xs opacity-60">──┐</div>
        <div className="absolute bottom-2 left-2 text-cyan-400 font-mono text-xs opacity-60">└──</div>
        <div className="absolute bottom-2 right-2 text-cyan-400 font-mono text-xs opacity-60">──┘</div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-tek font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-cyan-400" />
                OFFICIAL PVP RAID PROTOCOL
              </span>
              <span className="px-2 py-0.5 text-[10px] font-tek font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
                HITBOX RULES &amp; DAMAGE MITIGATION
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-hud text-white mt-1 tracking-wide">
              TURRET SOAKERS &amp; BULLET HITBOX MATRIX
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Master the exact bullet hitboxes for heavy and auto-turret draining on Official PvP. Explains where bullets must strike to activate maximum armor reduction and sustain pushes.
            </p>
          </div>

          <div className="bg-[#050b14] border border-cyan-500/30 rounded-xl p-3 text-xs font-tek text-slate-300 shrink-0">
            <div className="text-[10px] text-slate-400">VEGGIE CAKE RATE</div>
            <div className="text-emerald-400 font-bold text-sm">+2,100 HP / 30s</div>
            <div className="text-[10px] text-slate-500">Auto-consumed when HP &lt; 85%</div>
          </div>
        </div>

        {/* Quick Soaker Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-800">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedSoaker('stego')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedSoaker === 'stego'
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20'
                : 'bg-[#091220] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-hud">STEGO / TEK STEGO</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded font-tek font-bold">#1 PREFERRED</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Hitbox: Armored Tail &amp; Plates (50% Armor)</div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedSoaker('trike')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedSoaker === 'trike'
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20'
                : 'bg-[#091220] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-hud">TRICERATOPS (TRIKE)</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-tek font-bold">85% REDUCTION</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Hitbox: Frontal Head Frill (85% Armor)</div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedSoaker('carbonemys')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedSoaker === 'carbonemys'
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20'
                : 'bg-[#091220] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-hud">CARBONEMYS (TURTLE)</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-tek font-bold">80% REDUCTION</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Hitbox: Shell, Back &amp; Tail (80% Armor)</div>
          </motion.button>
        </div>
      </div>

      {/* Dynamic Detailed Soaker Card with Motion Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedSoaker}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {selectedSoaker === 'stego' && (
            <div className="bg-[#0b121e] border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-3">
              <div className="flex rounded-lg overflow-hidden border border-slate-800 bg-[#060c16] p-1 gap-1">
                <button
                  onClick={() => setStegoVariant('regular')}
                  className={`flex-1 py-1.5 px-2 rounded text-xs font-tek font-bold transition-all cursor-pointer ${
                    stegoVariant === 'regular'
                      ? 'bg-cyan-950 border border-cyan-400 text-cyan-300'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  REGULAR STEGO (ORGANIC)
                </button>
                <button
                  onClick={() => setStegoVariant('tek')}
                  className={`flex-1 py-1.5 px-2 rounded text-xs font-tek font-bold transition-all cursor-pointer ${
                    stegoVariant === 'tek'
                      ? 'bg-purple-950 border border-purple-400 text-purple-300'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  TEK STEGO (EXTINCTION)
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border-2 border-cyan-500/40 shadow-lg shadow-black">
                <img 
                  src={stegoVariant === 'regular' ? '/images/stegosaurus.jpg' : '/images/tek_stegosaurus.jpg'} 
                  alt={stegoVariant === 'regular' ? 'Organic Stegosaurus heavy turret soaker with armored dorsal plates absorbing auto-turret bullets' : 'Tek Stegosaurus cybernetic variant with electrified defensive plates for high-tier raiding'}
                  className="w-full h-64 object-cover" 
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/images/placeholder_dino.svg')) {
                      target.src = '/images/placeholder_dino.svg';
                    }
                  }}
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-xs font-tek text-cyan-300 border border-cyan-500/40">
                  {stegoVariant === 'regular' ? '◈ THE ISLAND / BASE MAPS' : '⚡ EXTINCTION ONLY • LVL 180 WILD'}
                </div>
                <div className="absolute bottom-3 inset-x-3 bg-black/85 backdrop-blur-md p-2 rounded-lg border border-cyan-500/30 text-[11px] text-slate-200">
                  <span className="text-amber-400 font-bold">CRITICAL TECHNIQUE:</span> Always walk backwards tail-first into turret towers so bullets hit the armored tail and spine plates!
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-hud text-cyan-300">
                    STEGOSAURUS &amp; TEK STEGOSAURUS
                  </h3>
                  <div className="text-xs text-slate-400 font-tek">
                    PREFERRED TURRET DRAINER • OFFICIAL SMALL TRIBES META
                  </div>
                </div>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-tek font-bold">
                  50% FLAT MITIGATION + DISMOUNT IMMUNITY
                </span>
              </div>

              {/* Hitbox details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#070e1a] border border-cyan-500/20 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 text-cyan-300 font-hud text-xs font-bold mb-1">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <span>REQUIRED BULLET HITBOX</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Turrets <strong className="text-white">MUST hit its armored tail and back plates</strong>. When backing up towards enemy deathwalls, the tail acts as a bullet shield that prevents headshot multipliers and protects your tribe members walking behind.
                  </p>
                </div>

                <div className="bg-[#070e1a] border border-cyan-500/20 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-hud text-xs font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>HARDENED PLATE MODE</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Toggle to <strong>Hardened Plate Mode</strong>: gives <span className="text-emerald-400 font-bold">50% flat damage reduction</span> across the entire body. Furthermore, the rider <span className="text-white font-bold">CANNOT be dismounted or picked</span> by enemy flyers, Voidwyrms, or Net Guns!
                  </p>
                </div>
              </div>

              {/* Why Tek Stego is superior */}
              <div className="p-4 bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 rounded-xl space-y-2">
                <div className="text-xs font-bold font-hud text-cyan-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>WHY TEK STEGOSAURUS IS PREFERRED (EXTINCTION SPAWNING)</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li><strong className="text-cyan-300">ASA Spawning:</strong> Tek creatures natively spawn on Extinction in ARK: Survival Ascended. For The Island and Scorched Earth, standard Stegosaurus is the primary soaker.</li>
                  <li><strong className="text-cyan-300">Level 180 Wild Cap:</strong> Tek dinos spawn up to level 180 on official servers (+30 levels over normal 150 dinos).</li>
                  <li><strong className="text-cyan-300">+20% Base Stats:</strong> Higher base health pool (easily breeding over 30,000 HP post-tame).</li>
                  <li><strong className="text-cyan-300">Sweet Vegetable Cake Synergy:</strong> Auto-eats veggie cakes to heal 2,100 HP every 30 seconds when below 85% health.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedSoaker === 'trike' && (
        <div className="bg-[#0b121e] border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <div className="relative rounded-xl overflow-hidden border-2 border-cyan-500/40 shadow-lg shadow-black">
                <img 
                  src="/images/triceratops.jpg" 
                  alt="Triceratops displaying 85 percent frontal head damage reduction armor against auto-turret fire" 
                  className="w-full h-64 object-cover" 
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/images/placeholder_dino.svg')) {
                      target.src = '/images/placeholder_dino.svg';
                    }
                  }}
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-xs font-tek text-amber-300 border border-amber-500/40">
                  ◈ 85% FRONTAL HEAD REDUCTION
                </div>
                <div className="absolute bottom-3 inset-x-3 bg-black/85 backdrop-blur-md p-2 rounded-lg border border-amber-500/30 text-[11px] text-slate-200">
                  <span className="text-amber-400 font-bold">CRITICAL TECHNIQUE:</span> Turrets must strike directly onto the Trike's skull frill! Facing away will cause full body damage.
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-hud text-cyan-300">
                    TRICERATOPS (TRIKE)
                  </h3>
                  <div className="text-xs text-slate-400 font-tek">
                    FRONTAL CHOKE-POINT PUSHER • BULLET SPONGE
                  </div>
                </div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-tek font-bold">
                  85% BULLET DAMAGE REDUCTION ON HEAD
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#070e1a] border border-amber-500/20 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 text-amber-300 font-hud text-xs font-bold mb-1">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span>HEADPLATE HITBOX MECHANIC</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Turrets <strong className="text-white">MUST hit its head/frill</strong>! When facing forward into turrets, its thick bone shield absorbs <strong className="text-amber-400">85% of all bullet damage</strong>. Never turn sideways or expose the body.
                  </p>
                </div>

                <div className="bg-[#070e1a] border border-amber-500/20 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 text-cyan-300 font-hud text-xs font-bold mb-1">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>RIVALRY BUFF &amp; CHARGE</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    When large enemy carnivores (Rex, Giga, Spino) are nearby, Trike gains the <strong>Rivalry Buff</strong>: +15% extra damage resistance and +10% max HP! Its Ram Charge also staggers enemy defenders and breaks metal spikes.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-slate-300 space-y-1">
                <div className="font-bold text-amber-300 font-hud">SOAKING COMPARISON:</div>
                <p>Heavy Turret deals 115 damage per bullet base. When hitting a Trike's head with a 100+ armor saddle, bullets inflict under <strong>5 to 9 damage per shot</strong>, easily out-sustained by Sweet Vegetable Cakes.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedSoaker === 'carbonemys' && (
        <div className="bg-[#0b121e] border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <div className="relative rounded-xl overflow-hidden border-2 border-cyan-500/40 shadow-lg shadow-black">
                <img 
                  src="/images/carbonemys.jpg" 
                  alt="Carbonemys giant turtle demonstrating 80 percent shell and 50 percent tail bullet damage reduction angles" 
                  className="w-full h-64 object-cover" 
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/images/placeholder_dino.svg')) {
                      target.src = '/images/placeholder_dino.svg';
                    }
                  }}
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-xs font-tek text-emerald-300 border border-emerald-500/40">
                  ◈ 80% SHELL / 50% TAIL REDUCTION
                </div>
                <div className="absolute bottom-3 inset-x-3 bg-black/85 backdrop-blur-md p-2 rounded-lg border border-emerald-500/30 text-[11px] text-slate-200">
                  <span className="text-emerald-400 font-bold">CRITICAL TECHNIQUE:</span> Turrets must hit its shell, back, or tail! Do not allow turrets to headshot.
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-hud text-cyan-300">
                    CARBONEMYS (TURTLE)
                  </h3>
                  <div className="text-xs text-slate-400 font-tek">
                    WATER CAVE DRAINER • AIR DROP AMMO EXHAUSTER
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-tek font-bold">
                  80% SHELL / 50% LIMBS &amp; TAIL
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#070e1a] border border-emerald-500/20 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 text-emerald-300 font-hud text-xs font-bold mb-1">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span>SHELL &amp; TAIL HITBOX</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Turrets <strong className="text-white">MUST hit its shell, back, or tail</strong>! Its shell provides an enormous <strong className="text-emerald-400">80% damage reduction</strong>, and its tail and legs provide <strong className="text-emerald-400">50% damage reduction</strong> against bullets.
                  </p>
                </div>

                <div className="bg-[#070e1a] border border-emerald-500/20 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 text-cyan-300 font-hud text-xs font-bold mb-1">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>CHEAP TO CLONE &amp; AIR DROP</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Turtles incubate fast and have inexpensive cloning costs. Tribes drop high-HP cloned turtles from Argentavis or Quetzals directly onto roof turrets or swim them into underwater artifact cave defense walls.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-slate-300 space-y-1">
                <div className="font-bold text-emerald-300 font-hud">VEGGIE CAKE SUSTAIN:</div>
                <p>Because Carbonemys is a herbivore, it auto-eats Sweet Veggie Cakes just like a Stego, restoring 2,100 HP every 30 seconds until the turret grid runs dry on ammo.</p>
              </div>
            </div>
          </div>
        </div>
      )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
