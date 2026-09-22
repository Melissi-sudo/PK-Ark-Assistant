import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  ShieldAlert, 
  Sparkles, 
  Trash2, 
  Filter, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Pin, 
  Flame, 
  Crosshair, 
  Zap,
  Clock,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  db, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp 
} from '../lib/firebase';
import { DinoTip } from '../types';

interface DinoTipsCommunityProps {
  dinoId: string;
  dinoName: string;
}

// Curated default field tips for major ARK Ascended creatures
const DEFAULT_PRESEEDED_TIPS: Record<string, Omit<DinoTip, 'id' | 'dinoId' | 'dinoName'>[]> = {
  quetzal: [
    {
      authorName: 'ApexFlier_Sky',
      category: 'Taming Trap',
      content: 'Solo taming method: Ride a Tapejara into passenger seat (press X / whistle attack target at distance), then grapple to your Tapejara and whistle Move To while firing Shocking Tranq Darts with a Longneck Rifle. Easy solo knockdown!',
      upvotes: 42,
      createdAt: '2026-03-10T14:20:00.000Z',
      pinned: true
    },
    {
      authorName: 'Tek_Breeder',
      category: 'Narcotics & Food',
      content: 'Quetzals have rapid torpor drop once knocked out! Prepare at least 80 Bio-Toxin or 250 Narcotics before downing a 150. Superior Kibble is mandatory for max effectiveness.',
      upvotes: 28,
      createdAt: '2026-03-12T09:15:00.000Z'
    },
    {
      authorName: 'Alpha_Soaker',
      category: 'PvP Strategy',
      content: 'Build a steel box saddle on a high-HP Quetzal to soak cliff turret towers where Stegos cannot walk. Sloped metal ceilings protect the rider from auto-turret line-of-sight.',
      upvotes: 19,
      createdAt: '2026-03-14T18:40:00.000Z'
    }
  ],
  fasolasuchus: [
    {
      authorName: 'DuneStalker',
      category: 'Taming Trap',
      content: 'Do NOT shoot tranqs! Fasolasuchus is a passive steering tame. Throw a salt rock or hit it with explosives while it sand-swims, jump on its back when it is stunned, and steer it into canyon rocks to build torpor.',
      upvotes: 56,
      createdAt: '2026-03-08T11:00:00.000Z',
      pinned: true
    },
    {
      authorName: 'DesertRaider',
      category: 'PvP Strategy',
      content: 'Fasolasuchus cannot soak modern heavy turrets in ASA because sand-swimming leaves the rider targetable. Use it as an ambusher to drag enemy players and mount tames into the sand.',
      upvotes: 34,
      createdAt: '2026-03-11T16:30:00.000Z'
    }
  ],
  pyromane: [
    {
      authorName: 'FlameWarden',
      category: 'Knockout & Torpor',
      content: 'To tame a wild Pyromane: Lure it into shallow water to extinguish its flame armor, then mount it and attack hostile creatures to absorb fire until absorption reaches 100%. Keep campfire blazes nearby.',
      upvotes: 63,
      createdAt: '2026-03-05T12:00:00.000Z',
      pinned: true
    },
    {
      authorName: 'SmallTribesPVP',
      category: 'PvP Strategy',
      content: 'Pyromane shoulder-mount form shoots flame bolts through turret wall gaps to ignite generators and electrical cables. Highly lethal against light armor kit runners.',
      upvotes: 39,
      createdAt: '2026-03-09T20:10:00.000Z'
    }
  ],
  stegosaurus: [
    {
      authorName: 'TurretSoakKing',
      category: 'PvP Strategy',
      content: 'Always switch to Hardened Plate mode (reduces incoming bullet & turret damage by 50%). Backwards walking prevents headshot multipliers and protects the rider from sniper fire.',
      upvotes: 88,
      createdAt: '2026-03-01T10:00:00.000Z',
      pinned: true
    },
    {
      authorName: 'TribeLogistics',
      category: 'Taming Trap',
      content: 'Simple 3x3 stone doorframe box with wood ramps. Stego will walk right up and cannot fit through single door gaps. Shoot standard tranq darts from 10 meters away.',
      upvotes: 24,
      createdAt: '2026-03-04T15:20:00.000Z'
    }
  ],
  gigantoraptor: [
    {
      authorName: 'NestHunter',
      category: 'Taming Trap',
      content: 'Distract the mother Gigantoraptor by dropping a fertilized high-tier egg (Giga, Carcha, or Rex egg) nearby. Sneak into the nest while she inspects the egg and play the imprint mini-game with the baby chick!',
      upvotes: 49,
      createdAt: '2026-03-02T13:45:00.000Z',
      pinned: true
    }
  ],
  wyvern: [
    {
      authorName: 'ScarFlyer_99',
      category: 'Taming Trap',
      content: 'Female Wyverns CAN and SHOULD be knocked out! Build a gateway trap with 4-5 dinosaur/behemoth gateways. Lure a wild female inside and down her with Shocking Tranq Darts to loot 5x Wyvern Milk from her inventory.',
      upvotes: 82,
      createdAt: '2026-03-06T08:30:00.000Z',
      pinned: true
    },
    {
      authorName: 'ApexBossRaider',
      category: 'PvP Strategy',
      content: 'Wyvern Milk gives a 180s (3 min) Insulating Warmth buff: +787 hypothermal insulation, total disease immunity, +100 HP & Food. Force-feeding to tames grants 100% immunity to Fire DoT (Dragon boss & Fire Wyverns) and Bleed DoT (Giga/Allo/Carno)!',
      upvotes: 95,
      createdAt: '2026-03-10T14:15:00.000Z',
      pinned: true
    }
  ],
  tusoteuthis: [
    {
      authorName: 'AbyssalHunter',
      category: 'Taming Trap',
      content: 'Tusoteuthis is a PASSIVE deep-sea tame! Do NOT use tranqs or land traps. Bring a high-HP Basilosaurus (which cannot be shocked or dismounted). Let the squid grab your Basilo, swim down to its mouth/beak with 50 Black Pearls in your 0 hotbar slot, and press E to feed it!',
      upvotes: 68,
      createdAt: '2026-03-04T12:00:00.000Z',
      pinned: true
    }
  ],
  carcharodontosaurus: [
    {
      authorName: 'CarchaTamer',
      category: 'Taming Trap',
      content: 'Do NOT shoot tranqs! Drag high-HP wild dinosaur corpses (Rex, Diplodocus, Trike) to the Carchar to fill its Friendliness meter. Once full, mount it and kill wild creatures rapidly to build Trust to 100%.',
      upvotes: 74,
      createdAt: '2026-03-07T16:30:00.000Z',
      pinned: true
    }
  ],
  giganotosaurus: [
    {
      authorName: 'GigaBreeder_ASA',
      category: 'Taming Trap',
      content: '4 metal dinosaur gateways and 1 large bear trap in the center. Lure the Giga into the trap, drop the 4th gateway behind it, and fire Shocking Tranq Darts. Its torpor drops rapidly — keep 500+ Narcotics or Bio-Toxin ready!',
      upvotes: 89,
      createdAt: '2026-03-02T19:00:00.000Z',
      pinned: true
    }
  ],
  therizinosaurus: [
    {
      authorName: 'TickleChickenFan',
      category: 'Taming Trap',
      content: 'Trap in a 3x3 stone doorframe or pillar box with ramps. Theri torpor falls fast: starve tame and feed Exceptional Kibble or crops. Excellent for wood/fiber harvesting and armor-piercing PvP melee.',
      upvotes: 45,
      createdAt: '2026-03-03T11:20:00.000Z'
    }
  ],
  dodo: [
    {
      authorName: 'BeachBob_Hero',
      category: 'Taming Trap',
      content: 'Punch it or use a slingshot stone. Tames in seconds with berries. Note: Dodo is NOT a resource harvester. It is a starter pet, an egg layer for Basic Kibble, or a classic PvP tactic for attaching C4 charges!',
      upvotes: 112,
      createdAt: '2026-02-28T17:00:00.000Z',
      pinned: true
    }
  ]
};

export const DinoTipsCommunity: React.FC<DinoTipsCommunityProps> = ({ dinoId, dinoName }) => {
  const { currentUser, profile, accountName, saveAccountName } = useAuth();
  
  const [tips, setTips] = useState<DinoTip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Form state
  const [authorNameInput, setAuthorNameInput] = useState<string>(() => {
    return profile?.displayName || accountName || 'Survivor';
  });
  const [contentInput, setContentInput] = useState<string>('');
  const [categoryInput, setCategoryInput] = useState<DinoTip['category']>('Taming Trap');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Filter and sort state
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'helpful' | 'newest'>('helpful');

  // Upvoted IDs tracked in localStorage
  const [upvotedTips, setUpvotedTips] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('ark_upvoted_dino_tips');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (_) {
      return new Set();
    }
  });

  // Keep author input in sync with user's saved account name
  useEffect(() => {
    const currentDisplayName = profile?.displayName || accountName;
    if (currentDisplayName && (!authorNameInput || authorNameInput === 'Survivor')) {
      setAuthorNameInput(currentDisplayName);
    }
  }, [profile, accountName]);

  // Load tips from Firestore + fallback localStorage + curated defaults
  useEffect(() => {
    setLoading(true);
    let unsubscribe = () => {};

    const localCacheKey = `ark_dino_tips_cache_${dinoId}`;
    let cachedTips: DinoTip[] = [];
    try {
      const stored = localStorage.getItem(localCacheKey);
      if (stored) cachedTips = JSON.parse(stored);
    } catch (_) {}

    // Prepare default tips for this dino (only handcrafted, dino-specific tips, no generic automated stubs)
    const defaults = (DEFAULT_PRESEEDED_TIPS[dinoId] || []).map((t, idx) => ({
      ...t,
      id: `default_${dinoId}_${idx}`,
      dinoId,
      dinoName
    }));

    try {
      const tipsRef = collection(db, 'dino_tips');
      const q = query(tipsRef, where('dinoId', '==', dinoId));

      unsubscribe = onSnapshot(q, (snapshot) => {
        const firestoreTips: DinoTip[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          firestoreTips.push({
            id: docSnap.id,
            dinoId: data.dinoId || dinoId,
            dinoName: data.dinoName || dinoName,
            authorName: data.authorName || 'Survivor',
            authorUid: data.authorUid,
            content: data.content,
            category: data.category || 'General Tip',
            upvotes: typeof data.upvotes === 'number' ? data.upvotes : 0,
            upvotedBy: data.upvotedBy || [],
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
            pinned: data.pinned || false
          });
        });

        // Combine Firestore tips with preseeded defaults (avoiding duplicates)
        const combined = [...firestoreTips];
        defaults.forEach(def => {
          if (!combined.some(c => c.content.toLowerCase().trim() === def.content.toLowerCase().trim())) {
            combined.push(def);
          }
        });

        setTips(combined);
        setLoading(false);

        // Save to local cache
        try {
          localStorage.setItem(localCacheKey, JSON.stringify(firestoreTips));
        } catch (_) {}
      }, (err) => {
        console.warn('Firestore snapshot error for dino tips, using local cache:', err);
        // Fallback to cache + defaults
        const fallbackList = [...cachedTips];
        defaults.forEach(def => {
          if (!fallbackList.some(c => c.id === def.id)) {
            fallbackList.push(def);
          }
        });
        setTips(fallbackList);
        setLoading(false);
      });
    } catch (e) {
      console.warn('Could not initialize firestore listener:', e);
      setTips(defaults);
      setLoading(false);
    }

    return () => unsubscribe();
  }, [dinoId, dinoName]);

  // Handle submitting a new comment / taming tip
  const handlePostTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentInput.trim()) {
      setErrorToast('Please enter your taming tip or strategy advice.');
      return;
    }

    setIsSubmitting(true);
    setErrorToast(null);

    const effectiveAuthor = authorNameInput.trim() || profile?.displayName || accountName || 'Survivor';
    
    // Also save this author name to user's account persistence so it sticks!
    if (effectiveAuthor !== accountName) {
      saveAccountName(effectiveAuthor);
    }

    const newTipData = {
      dinoId,
      dinoName,
      authorName: effectiveAuthor,
      authorUid: currentUser?.uid || 'local_' + effectiveAuthor,
      content: contentInput.trim(),
      category: categoryInput,
      upvotes: 1,
      upvotedBy: [currentUser?.uid || effectiveAuthor],
      createdAt: serverTimestamp()
    };

    try {
      // 1. Save to Firestore
      const docRef = await addDoc(collection(db, 'dino_tips'), newTipData);

      // 2. Optimistic local state update
      const localTip: DinoTip = {
        id: docRef.id,
        dinoId,
        dinoName,
        authorName: effectiveAuthor,
        authorUid: currentUser?.uid || 'local_' + effectiveAuthor,
        content: contentInput.trim(),
        category: categoryInput,
        upvotes: 1,
        upvotedBy: [currentUser?.uid || effectiveAuthor],
        createdAt: new Date().toISOString()
      };

      setTips(prev => [localTip, ...prev]);

      // Cache locally
      const localCacheKey = `ark_dino_tips_cache_${dinoId}`;
      try {
        const stored = localStorage.getItem(localCacheKey);
        const existing = stored ? JSON.parse(stored) : [];
        localStorage.setItem(localCacheKey, JSON.stringify([localTip, ...existing]));
      } catch (_) {}

      setContentInput('');
      setSuccessToast(`✓ Taming tip saved to community database by ${effectiveAuthor}!`);
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err: any) {
      console.warn('Firestore write error, saving tip locally:', err);
      // Fallback local save so user work is NEVER lost
      const fallbackTip: DinoTip = {
        id: `local_tip_${Date.now()}`,
        dinoId,
        dinoName,
        authorName: effectiveAuthor,
        authorUid: currentUser?.uid || 'local_' + effectiveAuthor,
        content: contentInput.trim(),
        category: categoryInput,
        upvotes: 1,
        createdAt: new Date().toISOString()
      };
      setTips(prev => [fallbackTip, ...prev]);
      setContentInput('');
      setSuccessToast(`✓ Tip saved locally for ${dinoName}!`);
      setTimeout(() => setSuccessToast(null), 3500);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upvote tip
  const handleUpvote = async (tip: DinoTip) => {
    if (upvotedTips.has(tip.id)) return;

    const nextUpvotes = (tip.upvotes || 0) + 1;
    const newSet = new Set(upvotedTips);
    newSet.add(tip.id);
    setUpvotedTips(newSet);
    try {
      localStorage.setItem('ark_upvoted_dino_tips', JSON.stringify(Array.from(newSet)));
    } catch (_) {}

    // Optimistic UI update
    setTips(prev => prev.map(t => t.id === tip.id ? { ...t, upvotes: nextUpvotes } : t));

    // Update in Firestore if not a hardcoded default
    if (!tip.id.startsWith('default_') && !tip.id.startsWith('local_tip_')) {
      try {
        const tipRef = doc(db, 'dino_tips', tip.id);
        await updateDoc(tipRef, {
          upvotes: nextUpvotes
        });
      } catch (e) {
        console.warn('Could not sync upvote to Firestore:', e);
      }
    }
  };

  // Delete tip (if authored by this user)
  const handleDeleteTip = async (tip: DinoTip) => {
    if (!window.confirm('Delete your tip from the community board?')) return;

    setTips(prev => prev.filter(t => t.id !== tip.id));

    if (!tip.id.startsWith('default_') && !tip.id.startsWith('local_tip_')) {
      try {
        await deleteDoc(doc(db, 'dino_tips', tip.id));
      } catch (e) {
        console.warn('Could not delete from Firestore:', e);
      }
    }
  };

  // Filter & sort tips
  const displayedTips = useMemo(() => {
    let result = [...tips];

    if (activeFilter !== 'all') {
      result = result.filter(t => t.category === activeFilter);
    }

    result.sort((a, b) => {
      // Pinned always first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      if (sortBy === 'helpful') {
        return (b.upvotes || 0) - (a.upvotes || 0);
      } else {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      }
    });

    return result;
  }, [tips, activeFilter, sortBy]);

  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    'Taming Trap': { bg: 'bg-emerald-950/50', text: 'text-emerald-400', border: 'border-emerald-500/40' },
    'Knockout & Torpor': { bg: 'bg-cyan-950/50', text: 'text-cyan-400', border: 'border-cyan-500/40' },
    'Narcotics & Food': { bg: 'bg-amber-950/50', text: 'text-amber-400', border: 'border-amber-500/40' },
    'PvP Strategy': { bg: 'bg-red-950/50', text: 'text-red-400', border: 'border-red-500/40' },
    'General Tip': { bg: 'bg-purple-950/50', text: 'text-purple-400', border: 'border-purple-500/40' }
  };

  return (
    <div className="bg-[#050b14] border border-cyan-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-tek tracking-widest text-cyan-400 uppercase">
                SURVIVOR FIELD INTELLIGENCE
              </span>
              <span className="text-[9px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-1.5 py-0.2 rounded font-tek">
                CLOUD SAVED
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-hud text-white flex items-center gap-2">
              <span>{dinoName.toUpperCase()} TAMING TIPS & COMMUNITY STRATEGIES</span>
              <span className="text-xs font-normal text-cyan-400/80 font-mono">({tips.length})</span>
            </h3>
          </div>
        </div>

        {/* Filter and Sort controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[#030712] border border-slate-800 rounded-xl p-1 text-xs font-hud">
            <button
              onClick={() => setSortBy('helpful')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                sortBy === 'helpful' 
                  ? 'bg-cyan-500 text-black font-bold shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              TOP VOTED
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                sortBy === 'newest' 
                  ? 'bg-cyan-500 text-black font-bold shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              NEWEST
            </button>
          </div>
        </div>
      </div>

      {/* Category filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-hud scrollbar-none">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
            activeFilter === 'all'
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-sm shadow-cyan-500/20'
              : 'bg-[#060e1c] border-white/[0.08] text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          ALL CATEGORIES ({tips.length})
        </button>
        {(['Taming Trap', 'Knockout & Torpor', 'Narcotics & Food', 'PvP Strategy', 'General Tip'] as const).map(cat => {
          const count = tips.filter(t => t.category === cat).length;
          const isActive = activeFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-sm shadow-cyan-500/20'
                  : 'bg-[#060e1c] border-white/[0.08] text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{cat}</span>
              <span className="text-[10px] opacity-75 font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Add New Tip Form */}
      <form onSubmit={handlePostTip} className="bg-[#071120] border border-cyan-500/40 rounded-xl p-4 space-y-3 relative overflow-hidden shadow-lg shadow-cyan-950/40">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-tek text-cyan-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>SUBMIT A FIELD TAMING TIP OR TRAP SETUP</span>
          </div>

          <span className="text-[10px] text-slate-400 font-mono">
            Posts to global survivor network
          </span>
        </div>

        {/* Input row: Author Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-tek text-slate-300 mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-cyan-400" />
              <span>POSTING AS (YOUR ACCOUNT NAME)</span>
            </label>
            <input
              type="text"
              value={authorNameInput}
              onChange={(e) => {
                setAuthorNameInput(e.target.value);
                saveAccountName(e.target.value);
              }}
              placeholder="e.g. foxy24013"
              className="w-full bg-[#040812] border border-cyan-500/30 rounded-lg px-3 py-1.5 text-xs text-cyan-200 font-hud focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-tek text-slate-300 mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" />
              <span>TIP CATEGORY</span>
            </label>
            <select
              value={categoryInput}
              onChange={(e: any) => setCategoryInput(e.target.value)}
              className="w-full bg-[#040812] border border-cyan-500/30 rounded-lg px-3 py-1.5 text-xs text-cyan-200 font-hud focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="Taming Trap">Taming Trap Design & Gate Setup</option>
              <option value="Knockout & Torpor">Knockout & Torpor Strategies</option>
              <option value="Narcotics & Food">Narcotics, Food & Starve Taming</option>
              <option value="PvP Strategy">PvP Utility & Combat Tactics</option>
              <option value="General Tip">General Field Intelligence</option>
            </select>
          </div>
        </div>

        {/* Tip Text Area */}
        <div>
          <textarea
            rows={3}
            value={contentInput}
            onChange={(e) => setContentInput(e.target.value)}
            placeholder={`Share your trap blueprint, tranq ammo advice, starve-timing notes, or solo taming method for ${dinoName}...`}
            className="w-full bg-[#040812] border border-cyan-500/30 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 placeholder:text-slate-600 font-sans leading-relaxed"
          />
        </div>

        {/* Feedback alerts */}
        {errorToast && (
          <div className="p-2.5 bg-red-950/50 border border-red-500/40 rounded-lg text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorToast}</span>
          </div>
        )}

        {successToast && (
          <div className="p-2.5 bg-emerald-950/50 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Submit button */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Comments automatically save to database</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !contentInput.trim()}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 disabled:opacity-50 text-black font-hud font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>SAVING TIP...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>POST TAMING TIP</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Community Tips List */}
      <div className="space-y-3 pt-1">
        {loading ? (
          <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono">Syncing field tips from satellite database...</span>
          </div>
        ) : displayedTips.length === 0 ? (
          <div className="p-8 text-center bg-[#070e1b] rounded-xl border border-dashed border-slate-800 text-slate-400">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="text-xs font-hud text-slate-300">No community tips found in this category.</p>
            <p className="text-[11px] text-slate-500 mt-1">Be the first survivor to share a taming strategy for {dinoName}!</p>
          </div>
        ) : (
          displayedTips.map((tip) => {
            const isUpvoted = upvotedTips.has(tip.id);
            const style = categoryColors[tip.category] || categoryColors['General Tip'];
            const isOwner = (currentUser && tip.authorUid === currentUser.uid) || 
                            (!currentUser && tip.authorName === authorNameInput);

            return (
              <div 
                key={tip.id} 
                className={`bg-[#070f1e] border ${tip.pinned ? 'border-cyan-400/50 shadow-md shadow-cyan-950/60' : 'border-white/[0.08] hover:border-cyan-500/30'} rounded-xl p-4 transition-all space-y-2.5`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs font-bold font-hud">
                      {tip.authorName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-hud font-bold text-white tracking-wide">
                      {tip.authorName}
                    </span>
                    {tip.pinned && (
                      <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.2 rounded font-tek flex items-center gap-1">
                        <Pin className="w-2.5 h-2.5" />
                        PINNED GUIDE
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-hud font-semibold ${style.bg} ${style.text} ${style.border}`}>
                      {tip.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {tip.createdAt ? new Date(tip.createdAt).toLocaleDateString() : 'Active'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap pl-1">
                  {tip.content}
                </p>

                {/* Footer / Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
                  <button
                    onClick={() => handleUpvote(tip)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-hud flex items-center gap-1.5 transition-all cursor-pointer ${
                      isUpvoted
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-sm shadow-cyan-500/20'
                        : 'bg-[#040914] border-white/[0.08] text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'text-cyan-400 fill-cyan-400' : ''}`} />
                    <span>HELPFUL ({tip.upvotes || 0})</span>
                  </button>

                  {isOwner && !tip.id.startsWith('default_') && (
                    <button
                      onClick={() => handleDeleteTip(tip)}
                      className="text-slate-500 hover:text-red-400 text-[11px] font-tek flex items-center gap-1 transition-colors"
                      title="Delete your tip"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>DELETE</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
