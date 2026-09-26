import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Crosshair, 
  Flame, 
  Egg, 
  Map, 
  ShieldAlert, 
  ShoppingBag, 
  Search, 
  ArrowRight, 
  Zap, 
  ExternalLink,
  ShieldCheck,
  Check,
  Gamepad2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LibraryHub: React.FC = () => {
  const navigate = useNavigate();
  const { accountName, profile, currentUser } = useAuth();
  const [search, setSearch] = useState<string>('');

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Launcher Header Banner */}
      <div className="bg-gradient-to-r from-[#09111f] via-[#050b14] to-[#040810] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="h-16 sm:h-20 w-auto min-w-[70px] max-w-[150px] shrink-0 rounded-2xl bg-[#061122] border border-cyan-400/40 p-1.5 shadow-lg shadow-cyan-500/20 overflow-hidden flex items-center justify-center">
              <img 
                src="/logo.png?v=pk-v3" 
                alt="PK Ultimate Guide Logo" 
                className="h-full w-auto max-w-full object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" 
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 font-tek text-xs tracking-widest uppercase">
                <span>The Pitsoni Empire</span>
                <span>·</span>
                <span className="text-slate-300">Multi-Game Companion</span>
                <span>·</span>
                <span className="text-emerald-400">Library Menu</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold font-hud text-slate-100 tracking-tight leading-tight">
                PK ULTIMATE GUIDE
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Select a game below to launch its dedicated companion hub. Each title features its own custom-built theme and tactical tools.
              </p>
            </div>
          </div>

          {/* User Quick Info */}
          <div className="flex items-center gap-3 bg-[#0a1424] border border-cyan-500/20 rounded-2xl p-3.5 self-start md:self-auto">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold font-hud">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-hud font-bold text-slate-100">
                {profile?.displayName || accountName || 'Player'}
              </div>
              <div className="text-[10px] text-cyan-400 font-mono">
                {profile?.platform || 'PC / Steam'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Game Selector: Two Distinct Themed Game Showcases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GAME 1: MINECRAFT (Greenish, Blocky Vibe with Mojangles Text) */}
        <div className="mc-panel-dirt rounded-none border-4 border-[#140d09] shadow-2xl overflow-hidden flex flex-col justify-between group hover:border-[#385e1b] transition-all">
          {/* Minecraft Top Header */}
          <div className="mc-grass-header px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mojangles text-yellow-300 text-xs sm:text-sm uppercase drop-shadow-[1px_1px_0px_#1e2f0d]">
              <span>◈ Minecraft Guide</span>
            </div>
            <span className="font-mojangles text-[10px] bg-[#1a2b0d] border border-[#41681a] text-emerald-300 px-2 py-0.5">
              v1.21 Tricky Trials
            </span>
          </div>

          {/* Minecraft Thumbnail with Exact Uploaded Image */}
          <div className="relative aspect-video sm:aspect-[16/10] overflow-hidden bg-[#18110b] border-y-4 border-[#0e0a07]">
            <img
              src="/images/thumbnails/minecraft.png"
              alt="Minecraft Official Key Art"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140d09] via-transparent to-transparent opacity-60" />
            
            <div className="absolute bottom-3 left-3 right-3 font-mojangles">
              <span className="text-[10px] px-2 py-1 bg-[#2b4414] border border-[#527d28] text-white uppercase shadow-md">
                Sandbox & Adventure
              </span>
            </div>
          </div>

          {/* Minecraft Content & Launch Action */}
          <div className="p-5 sm:p-6 space-y-4 bg-[#1a120c] font-mojangles flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-wide drop-shadow-[2px_2px_0px_#000]">
                Minecraft Guide Suite
              </h2>
              <p className="text-xs text-[#b8a795] leading-relaxed">
                Featuring the Chunkbase Seed Map launcher, Command Block Gradient Text Generator (/tellraw, /title, chat), Nether Portal 3D calculator, and 1.21 Potion Lab. Divided into Survival Mode and Creative / Commands!
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/minecraft')}
                className="mc-button-green w-full py-3 px-4 text-xs sm:text-sm font-bold uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Launch Minecraft Guide</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* GAME 2: ARK SURVIVAL ASCENDED (Futuristic Cyber/TEK Sci-Fi Vibe) */}
        <div className="bg-gradient-to-b from-[#071324] via-[#050e1a] to-[#03070d] border-2 border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between group hover:border-cyan-400 transition-all">
          {/* ARK Top Header */}
          <div className="bg-gradient-to-r from-cyan-950 via-[#0a182c] to-cyan-950 px-5 py-3 flex items-center justify-between border-b border-cyan-500/30">
            <div className="flex items-center gap-2 text-cyan-300 font-tek font-bold text-xs sm:text-sm uppercase tracking-wider">
              <span className="text-cyan-400">◈</span>
              <span>ARK: Survival Ascended</span>
            </div>
            <span className="text-[10px] bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 px-2 py-0.5 rounded font-mono font-bold">
              OFFICIAL PVP META
            </span>
          </div>

          {/* ARK Thumbnail with Exact Official Key Art */}
          <div className="relative aspect-video sm:aspect-[16/10] overflow-hidden bg-black border-y border-cyan-500/20">
            <img
              src="/images/thumbnails/ark_official.jpg?v=asa_official_keyart"
              alt="ARK Survival Ascended Official Key Art"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050e1a] via-transparent to-transparent opacity-70" />
            
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-hud">
              <span className="text-[10px] px-2 py-1 bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 uppercase rounded-lg shadow-md">
                9 Interactive Tools & Maps
              </span>
            </div>
          </div>

          {/* ARK Content & Launch Action */}
          <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between font-hud">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-wide">
                ARK War Room Assistant
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Automated taming starve timers, turret soaker armor mitigation, Pyromane combat simulator, 5 high-res maps, and tribe ammo quotas.
              </p>
            </div>

            {/* Quick Jumps */}
            <div className="grid grid-cols-3 gap-2 text-xs pt-1">
              <Link
                to="/taming"
                className="p-2 bg-[#09182f] hover:bg-cyan-950 border border-cyan-500/30 rounded-xl text-cyan-300 text-center font-bold transition-colors"
              >
                Taming Calc
              </Link>
              <Link
                to="/soakers"
                className="p-2 bg-[#09182f] hover:bg-cyan-950 border border-cyan-500/30 rounded-xl text-cyan-300 text-center font-bold transition-colors"
              >
                Soaker Matrix
              </Link>
              <Link
                to="/maps"
                className="p-2 bg-[#09182f] hover:bg-cyan-950 border border-cyan-500/30 rounded-xl text-cyan-300 text-center font-bold transition-colors"
              >
                5 Maps
              </Link>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/taming')}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch ARK War Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
