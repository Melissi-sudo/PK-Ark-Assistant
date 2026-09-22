import React from 'react';
import { 
  ShoppingBag, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Award, 
  Clock, 
  CheckCircle2, 
  Flame,
  Bomb,
  Egg,
  Layers,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';

export const PkStoreCatalog: React.FC = () => {
  const storeCategories = [
    {
      category: 'Boss-Ready Alpha Teams',
      icon: <Award className="w-5 h-5 text-amber-400" />,
      items: [
        {
          name: 'Alpha Dragon Theri Squad',
          details: '19x High-Stat Therizinosaurus (21k HP, 1200%+ Melee) + 124 Armor Ascendant Saddles + 1x High-Stam Yutyrannus + Veggie Cakes bundle.',
          badge: 'OVERSEER & DRAGON'
        },
        {
          name: 'Alpha Megapithecus & Broodmother Package',
          details: '19x 254 Melee Megatherium / Tek Rex army ready to melt Alpha spider and ape for instant Tek replicator and generator unlocks.',
          badge: 'DAY 1 UNLOCKS'
        }
      ]
    },
    {
      category: 'God-Stat Official Bloodlines',
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      items: [
        {
          name: '254 Melee Giga & Carcha Pairs',
          details: 'Max mutation capped Giganotosaurus & Carcharodontosaurus breeding pairs. Sterile & clean options for your tribe vault.',
          badge: '254 CAP STATS'
        },
        {
          name: 'Hardened Plate Stegosaurus Line',
          details: 'Top-tier official PvP Stego lines with 254 HP points and mastercraft saddles. Soak deathwalls with zero dismount risk.',
          badge: '#1 SOAKER'
        },
        {
          name: 'Pyromane War Line (ASA Bob\'s Tall Tales)',
          details: 'High-stat flame-absorber breeding pairs with max melee and stamina for PvP field dominance and flame extinguishing.',
          badge: 'ASA META'
        }
      ]
    },
    {
      category: 'Bulk Deathwall Resources',
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
      items: [
        {
          name: '250,000 to 1,000,000 ARB Crates',
          details: 'Instant Advanced Rifle Bullet crates dropped securely at your base obelisk or cliffside platform.',
          badge: 'BULK AMMO'
        },
        {
          name: 'Tek Defense Bundles (Shards & Generators)',
          details: '50,000+ Element Shards, 20x Tek Turrets, 2x Tek Generators, and element fuel packs.',
          badge: 'TEK KIT'
        },
        {
          name: 'Pre-Smelted Metal & Polymer Crates',
          details: '100,000 Refined Metal Ingots & Hard Polymer bundles to eliminate hours of mining mountain nodes.',
          badge: 'RAW MATS'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#211409] via-[#1a0f07] to-[#0d131f] border border-amber-500/40 rounded-xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 text-xs font-tek font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
              OFFICIAL CLUSTER ALLY // PK STORE
            </span>
            <span className="flex items-center gap-1.5 text-xs text-amber-400 font-hud">
              <ShieldCheck className="w-4 h-4" />
              Verified Fast Delivery
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold font-hud text-amber-100 tracking-wider">
            SKIP THE MINDLESS GRIND. DOMINATE OFFICIAL PVP.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Grinding 500,000 bullets and breeding 40 generations of mutations takes hundreds of hours of repetitive farming that active tribes don't have time for. 
            <strong>PK Store</strong> delivers boss-ready alpha armies, 254 capped bloodlines, bulk ammo crates, and TEK kits directly to your Official & Small Tribes servers.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              href="https://discord.gg/C9pD2yduw9"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-hud font-bold text-sm rounded-lg shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-transform cursor-pointer"
            >
              <span>JOIN PK STORE DISCORD</span>
              <ExternalLink className="w-4 h-4" />
            </motion.a>

            <div className="text-xs text-amber-300/80 font-tek">
              Discord Invite: <strong className="text-amber-200">discord.gg/C9pD2yduw9</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Guarantees Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#0b121e] border border-cyan-500/20 rounded-xl p-4 flex items-center gap-3"
        >
          <Clock className="w-8 h-8 text-cyan-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-white font-hud">Fast Obelisk Delivery</div>
            <div className="text-[11px] text-slate-400">Safe, confidential drop-offs across Official clusters.</div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#0b121e] border border-amber-500/20 rounded-xl p-4 flex items-center gap-3"
        >
          <Award className="w-8 h-8 text-amber-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-white font-hud">100% Capped 254 Stats</div>
            <div className="text-[11px] text-slate-400">Clean 0/0 and sterile raid dinos tested in real wars.</div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#0b121e] border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3"
        >
          <MessageSquare className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-white font-hud">Direct Ticket Support</div>
            <div className="text-[11px] text-slate-400">Active community staff ready to fulfill orders 24/7.</div>
          </div>
        </motion.div>
      </div>

      {/* Catalog Grid */}
      <div className="space-y-6">
        {storeCategories.map((cat, idx) => (
          <div key={idx} className="bg-[#0b121e] border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              {cat.icon}
              <h3 className="text-base font-bold font-hud text-white tracking-wide">
                {cat.category}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.items.map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.02, borderColor: 'rgba(245, 158, 11, 0.6)' }}
                  transition={{ duration: 0.18 }}
                  className="bg-[#070e1a] border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-xs sm:text-sm font-bold font-hud text-amber-200">
                        {item.name}
                      </h4>
                      <span className="text-[10px] font-tek font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.details}
                    </p>
                  </div>

                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href="https://discord.gg/C9pD2yduw9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 rounded text-center text-xs font-hud font-bold text-amber-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Order in Discord</span>
                    <ExternalLink className="w-3 h-3" />
                  </motion.a>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#121c2b] border border-cyan-500/30 rounded-xl p-6 text-center space-y-3">
        <h3 className="text-lg font-bold font-hud text-white">
          JOIN THE PK STORE COMMUNITY
        </h3>
        <p className="text-xs text-slate-300 max-w-lg mx-auto">
          Participate in regular dino giveaways, view vouches from reigning alpha tribes, and get fast quotes for your specific cluster server.
        </p>
        <div className="pt-1">
          <a
            href="https://discord.gg/C9pD2yduw9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white font-hud font-bold text-sm rounded-lg shadow-lg shadow-[#5865F2]/20 transition-all"
          >
            <span>CONNECT TO DISCORD (https://discord.gg/C9pD2yduw9)</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
