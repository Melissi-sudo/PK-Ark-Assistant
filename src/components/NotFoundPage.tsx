import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, Map, Crosshair, ShieldAlert, Zap, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-16 sm:py-24 flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-xl w-full bg-[#070e1a]/90 border border-cyan-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl relative overflow-hidden"
      >
        {/* Hologram scanline effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-tekScanline pointer-events-none" />

        {/* Implant lost badge */}
        <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/20">
          <AlertTriangle className="w-8 h-8 animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 font-tek font-bold text-xs tracking-wider mb-3">
          <span>SPECIMEN IMPLANT DE-SYNCHRONIZED // 404</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-tek font-black text-white tracking-wider mb-3">
          ARK COORDINATES NOT FOUND
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed font-sans mb-8">
          The tactical frequency or map waypoint you attempted to access does not exist on this ARK server. Re-align your TEK transmitter to return to active War Room operations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link
            to="/taming"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-hud font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20"
          >
            <Crosshair className="w-4 h-4" />
            <span>TAMING CALCULATOR</span>
          </Link>

          <Link
            to="/maps"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0a1526] hover:bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-hud font-bold text-xs rounded-xl transition-all"
          >
            <Map className="w-4 h-4" />
            <span>RESOURCE MAPS</span>
          </Link>

          <Link
            to="/soakers"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0a1526] hover:bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-hud font-bold text-xs rounded-xl transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>SOAKER HITBOX GUIDE</span>
          </Link>

          <Link
            to="/store"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0a1526] hover:bg-amber-950/60 border border-amber-500/40 text-amber-300 font-hud font-bold text-xs rounded-xl transition-all"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>PK STORE DISCORD</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-800 text-[11px] font-tek text-slate-500">
          PK ARK ASSISTANT // WAR ROOM RECOVERY PROTOCOL
        </div>
      </motion.div>
    </div>
  );
};
