import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Droplets, 
  Skull, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Timer, 
  Info,
  ShieldAlert,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playTekAlarmSound } from '../utils/audioAlert';

export const PyromaneTamingGuide: React.FC = () => {
  // Interactive Simulator State
  const [simActive, setSimActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [tamePercent, setTamePercent] = useState(0);
  const [flameStacks, setFlameStacks] = useState(0);
  const [simStep, setSimStep] = useState<'extinguish' | 'weaken' | 'mount' | 'absorb' | 'tamed'>('extinguish');
  const [wildPreyIgnited, setWildPreyIgnited] = useState(false);

  // Simulator interval loop
  useEffect(() => {
    let interval: any = null;
    if (simActive && simStep === 'absorb') {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            // Failed timer
            setSimActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [simActive, simStep]);

  // Ignite prey action
  const handleIgnitePrey = () => {
    setWildPreyIgnited(true);
    setFlameStacks(prev => Math.min(5, prev + 1));
  };

  // Flame absorb action
  const handleAbsorbFlame = () => {
    if (!wildPreyIgnited && flameStacks === 0) return;
    // Reset the 30-second timer as per ARK mechanic!
    setTimerSeconds(30);
    setWildPreyIgnited(false);
    const addedPercent = 18;
    const newPercent = Math.min(100, tamePercent + addedPercent);
    setTamePercent(newPercent);
    setFlameStacks(0);

    if (newPercent >= 100) {
      setSimStep('tamed');
      setSimActive(false);
      try {
        playTekAlarmSound();
      } catch (e) {
        // ignore
      }
    }
  };

  const resetSimulator = () => {
    setSimActive(false);
    setTimerSeconds(30);
    setTamePercent(0);
    setFlameStacks(0);
    setWildPreyIgnited(false);
    setSimStep('extinguish');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with in-game image */}
      <div className="relative bg-[#070e1b] border-2 border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-tek font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                ARK: FANTASTIC TAMES - PYROMANE • SPECIAL METHOD
              </span>
              <span className="px-2 py-0.5 text-[10px] font-tek font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded flex items-center gap-1">
                <Droplets className="w-3 h-3 text-cyan-400" />
                WATER &amp; FLAME ABSORPTION
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-hud text-white tracking-wide">
              PYROMANE COMPREHENSIVE TAMING PROTOCOL
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              The Pyromane does <strong>NOT</strong> use narcotics or standard knockout methods. To tame it, you must extinguish its flame armor in water, weaken it until it lets out a loud roar, mount it, and chain combat kills to absorb flames and reset the 30-second ride timer.
            </p>
          </div>

          <div className="lg:col-span-4">
            <div className="relative rounded-xl overflow-hidden border-2 border-amber-500/40 shadow-xl shadow-black">
              <img 
                src="/images/pyromane.jpg" 
                alt="Pyromane mythical feline creature shrouded in fiery flame aura during combat in ARK Ascended" 
                className="w-full h-44 object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/images/placeholder_dino.svg')) {
                    target.src = '/images/placeholder_dino.svg';
                  }
                }}
              />
              <div className="absolute bottom-2 inset-x-2 bg-black/80 backdrop-blur-md p-2 rounded border border-amber-500/30 text-[10px] text-amber-300 font-tek text-center">
                ◈ IN-GAME SCREENSHOT • PYROMANE IN COMBAT
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Phase Detailed Walkthrough */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Phase 1 */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#0b121e] border border-cyan-500/30 rounded-xl p-4 flex flex-col justify-between space-y-3"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-tek text-cyan-400">
              <span>PHASE 01</span>
              <Droplets className="w-4 h-4 text-cyan-400" />
            </div>
            <h4 className="text-sm font-bold font-hud text-white mt-1">
              LURE INTO WATER
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Find a lake, river, puddle, or wait for rain. Lead the Pyromane into water. Its fiery coat will extinguish (releasing steam), stripping its flame immunity.
            </p>
          </div>
          <div className="text-[10px] text-cyan-300 font-tek bg-cyan-950/40 p-2 rounded border border-cyan-500/20">
            ⚠️ Warning: Deep water will drown you or cause it to swim erratically. Use shallow water!
          </div>
        </motion.div>

        {/* Phase 2 */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#0b121e] border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between space-y-3"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-tek text-amber-400">
              <span>PHASE 02</span>
              <Skull className="w-4 h-4 text-amber-400" />
            </div>
            <h4 className="text-sm font-bold font-hud text-white mt-1">
              WEAKEN &amp; ROAR
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              While in water, attack it with a Pump-Action Shotgun, Longneck, or Pike until its HP falls below ~50%. It will perform a distinct, loud roaring animation and kneel.
            </p>
          </div>
          <div className="text-[10px] text-red-300 font-tek bg-red-950/40 p-2 rounded border border-red-500/30">
            🚨 DO NOT SHOOT AFTER ROAR: Any hit after the roar will cancel the ride prompt and re-aggro!
          </div>
        </motion.div>

        {/* Phase 3 */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#0b121e] border border-cyan-500/30 rounded-xl p-4 flex flex-col justify-between space-y-3"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-tek text-cyan-400">
              <span>PHASE 03</span>
              <Play className="w-4 h-4 text-cyan-400" />
            </div>
            <h4 className="text-sm font-bold font-hud text-white mt-1">
              MOUNT &amp; 30S TIMER
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Quickly run up and press <kbd className="px-1 py-0.5 bg-black border border-cyan-500/50 rounded text-cyan-300 font-bold">[E]</kbd> to ride it. A <strong>30-second taming countdown timer</strong> starts immediately!
            </p>
          </div>
          <div className="text-[10px] text-amber-300 font-tek bg-amber-950/40 p-2 rounded border border-amber-500/20">
            Clock is ticking: If it reaches 0s, you are bucked off and must restart water dousing!
          </div>
        </motion.div>

        {/* Phase 4 */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#0b121e] border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between space-y-3"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-tek text-amber-400">
              <span>PHASE 04</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <h4 className="text-sm font-bold font-hud text-white mt-1">
              IGNITE &amp; ABSORB
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Sprint towards wild creatures (Parasaurs, Phiomias, Dodos, Raptors). Attack to ignite them on fire, then activate <strong className="text-amber-400">"Flame Absorb"</strong>!
            </p>
          </div>
          <div className="text-[10px] text-emerald-300 font-tek bg-emerald-950/40 p-2 rounded border border-emerald-500/30">
            🔥 Key: Absorbing flame resets the 30s timer back to full and raises taming progress!
          </div>
        </motion.div>

        {/* Phase 5 */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#0b121e] border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between space-y-3"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-tek text-emerald-400">
              <span>PHASE 05</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold font-hud text-white mt-1">
              100% COMPLETION
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Keep chaining prey kills and flame absorptions. Once the taming bar hits 100%, press the final prompt to claim your fully tamed Pyromane!
            </p>
          </div>
          <div className="text-[10px] text-cyan-300 font-tek bg-cyan-950/40 p-2 rounded border border-cyan-500/20">
            Tip: Pyromane can transform into a shoulder pet, cook raw meat into jerky, and fuel forges!
          </div>
        </motion.div>
      </div>

      {/* Interactive Pyromane Taming Rhythm Simulator */}
      <div className="bg-[#070e1b] border-2 border-cyan-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-tek text-cyan-400 uppercase tracking-wider">
                INTERACTIVE TRAINING SIMULATOR
              </span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.2 rounded font-tek">
                PRACTICE 30S RESET RHYTHM
              </span>
            </div>
            <h3 className="text-lg font-bold font-hud text-white mt-0.5">
              TEST YOUR FLAME ABSORB &amp; TIMER CHAINING
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetSimulator}
              className="px-3 py-1.5 bg-[#0e1726] hover:bg-[#15233a] border border-slate-700 text-slate-300 text-xs font-hud rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET SIMULATOR</span>
            </button>
          </div>
        </div>

        {/* Step Progression UI in Simulator */}
        <div className="py-5 space-y-5">
          {simStep === 'extinguish' && (
            <div className="text-center py-6 space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-950/60 border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
                <Droplets className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold font-hud text-white">STEP 1: LURE PYROMANE INTO WATER</h4>
                <p className="text-xs text-slate-300 mt-1">
                  The wild Pyromane is burning with fire armor. Lure it towards the river shoreline!
                </p>
              </div>
              <button
                onClick={() => setSimStep('weaken')}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold font-hud text-xs rounded-xl shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
              >
                💧 LEAD INTO WATER (EXTINGUISH FLAMES)
              </button>
            </div>
          )}

          {simStep === 'weaken' && (
            <div className="text-center py-6 space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-950/60 border border-amber-400 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20 animate-pulse">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold font-hud text-white">STEP 2: DAMAGE WITH PUMP SHOTGUN UNTIL ROAR</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Shoot it until its health is below 50%. When it roars and collapses, cease fire immediately!
                </p>
              </div>
              <button
                onClick={() => {
                  setSimStep('mount');
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold font-hud text-xs rounded-xl shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
              >
                💥 SHOOT WITH PUMP SHOTGUN (TRIGGER ROAR)
              </button>
            </div>
          )}

          {simStep === 'mount' && (
            <div className="text-center py-6 space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-950/60 border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <Play className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold font-hud text-white">STEP 3: MOUNT THE ROARING PYROMANE</h4>
                <p className="text-xs text-slate-300 mt-1">
                  The Pyromane is kneeling down. Press <kbd className="px-1.5 py-0.5 bg-black border border-cyan-400 text-cyan-300 rounded font-bold">[E]</kbd> to jump on its back before it stands up!
                </p>
              </div>
              <button
                onClick={() => {
                  setSimStep('absorb');
                  setSimActive(true);
                  setTimerSeconds(30);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold font-hud text-xs rounded-xl shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
              >
                🐾 MOUNT PYROMANE &amp; START 30S TIMER
              </button>
            </div>
          )}

          {simStep === 'absorb' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* HUD Status Display */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-tek text-center">
                <div className={`p-4 rounded-xl border ${
                  timerSeconds <= 8 
                    ? 'bg-red-950/60 border-red-500 text-red-300 animate-pulse shadow-lg shadow-red-500/30' 
                    : 'bg-[#0b121e] border-cyan-500/30 text-cyan-300'
                }`}>
                  <div className="text-xs text-slate-400">RIDE DISMOUNT TIMER</div>
                  <div className="text-3xl font-bold font-mono tracking-wider mt-1">
                    {timerSeconds}s
                  </div>
                  <div className="text-[10px] mt-0.5 text-slate-400">Resets to 30s upon Flame Absorb</div>
                </div>

                <div className="p-4 rounded-xl border bg-[#0b121e] border-emerald-500/30 text-emerald-300">
                  <div className="text-xs text-slate-400">TAMING PROGRESS</div>
                  <div className="text-3xl font-bold font-mono tracking-wider mt-1">
                    {tamePercent}%
                  </div>
                  <div className="text-[10px] mt-0.5 text-slate-400">Goal: 100% to Complete</div>
                </div>

                <div className="p-4 rounded-xl border bg-[#0b121e] border-amber-500/30 text-amber-300 col-span-2 sm:col-span-1">
                  <div className="text-xs text-slate-400">TARGET IGNITED</div>
                  <div className="text-xl font-bold font-mono mt-2 flex items-center justify-center gap-1">
                    {wildPreyIgnited ? (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Flame className="w-5 h-5 text-amber-400 animate-bounce" /> BURNING
                      </span>
                    ) : (
                      <span className="text-slate-500">NO FLAME</span>
                    )}
                  </div>
                  <div className="text-[10px] mt-1 text-slate-400">{flameStacks} stacks built</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-tek text-slate-400">
                  <span>TAMING BAR PROGRESSION</span>
                  <span className="text-emerald-400 font-bold">{tamePercent}% / 100%</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full border border-slate-700 overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 rounded-full transition-all duration-300"
                    style={{ width: `${tamePercent}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleIgnitePrey}
                  className="py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold font-hud rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-amber-200" />
                  <span>1. ATTACK PREY (IGNITE FLAMES)</span>
                </button>

                <button
                  onClick={handleAbsorbFlame}
                  disabled={!wildPreyIgnited && flameStacks === 0}
                  className={`py-3 px-4 font-bold font-hud rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    wildPreyIgnited || flameStacks > 0
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black shadow-lg shadow-cyan-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>2. FLAME ABSORB (RESET 30S &amp; TAME)</span>
                </button>
              </div>

              {timerSeconds === 0 && (
                <div className="p-4 bg-red-950/60 border border-red-500/60 rounded-xl text-center space-y-2 animate-shake">
                  <div className="text-red-300 font-bold font-hud text-sm">
                    ⚠️ TIMER EXPIRED! YOU WERE BUCKED OFF!
                  </div>
                  <p className="text-xs text-slate-300">
                    You didn't absorb flame in time. The Pyromane became wild and hostile again. Click "Reset Simulator" to try again.
                  </p>
                </div>
              )}
            </div>
          )}

          {simStep === 'tamed' && (
            <div className="text-center py-6 space-y-4 max-w-lg mx-auto bg-emerald-950/20 border border-emerald-500/40 rounded-2xl p-6 shadow-xl shadow-emerald-500/10">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold font-hud text-emerald-300">
                  🎉 PYROMANE SUCCESSFULLY TAMED!
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  You chained wild prey flame absorptions perfectly before the 30-second timer expired.
                </p>
              </div>
              <button
                onClick={resetSimulator}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-hud text-xs rounded-xl transition-all cursor-pointer"
              >
                SIMULATE AGAIN
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
