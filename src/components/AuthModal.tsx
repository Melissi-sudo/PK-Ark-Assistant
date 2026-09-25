import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  KeyRound, 
  Mail, 
  Gamepad2, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  LogOut,
  Save,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    currentUser, 
    profile, 
    signInWithGoogle, 
    signInWithSteam,
    loginWithEmail, 
    signUpWithEmail, 
    logout, 
    updateProfile 
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'steam' | 'profile'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gamertag, setGamertag] = useState('');
  const [steamInput, setSteamInput] = useState('');
  const [platform, setPlatform] = useState<'PC / Steam' | 'PlayStation 5' | 'Xbox Series X/S' | 'Nintendo Switch'>('PC / Steam');

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync profile when opened
  React.useEffect(() => {
    if (currentUser && profile) {
      setMode('profile');
      setGamertag(profile.displayName || '');
      setPlatform(profile.platform || 'PC / Steam');
    } else {
      setMode('signin');
    }
    setError(null);
    setSuccessMessage(null);
  }, [isOpen, currentUser, profile]);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      setSuccessMessage('Securely logged in via Google Auth!');
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Google authentication encountered an issue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSteamAuth = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithSteam(steamInput.trim() || undefined);
      setSuccessMessage('Logged in with Steam!');
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Steam login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
        setSuccessMessage('Welcome back!');
        setTimeout(() => onClose(), 800);
      } else if (mode === 'signup') {
        if (!email || !password) {
          setError('Please provide both email and password.');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setIsSubmitting(false);
          return;
        }
        await signUpWithEmail(email, password, gamertag || email.split('@')[0]);
        setSuccessMessage('Account created successfully! Welcome to PK Ultimate Guide.');
        setTimeout(() => onClose(), 1000);
      } else if (mode === 'profile') {
        await updateProfile({
          displayName: gamertag,
          platform
        });
        setSuccessMessage('Gamer profile saved successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please verify credentials.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Try signing in.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0a0f1d] border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/80 overflow-hidden">
        {/* Top Banner */}
        <div className="relative bg-gradient-to-r from-cyan-950/80 via-[#0a182c] to-purple-950/80 p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-cyan-400 font-tek font-bold shadow-md">
              ◈
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-hud font-bold text-slate-100 tracking-wider text-base">
                  PK ULTIMATE GUIDE
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-1.5 py-0.2 rounded font-mono font-bold">
                  ACCOUNT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Multi-game profile & cloud sync
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-black/40 hover:bg-black/60 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Status Alerts */}
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Social Sign-in Options */}
          {mode !== 'profile' && mode !== 'steam' && (
            <div className="space-y-2.5">
              {/* Steam Button */}
              <button
                type="button"
                onClick={() => setMode('steam')}
                className="w-full py-2.5 px-4 bg-[#171d25] hover:bg-[#222b36] border border-[#2a475e] hover:border-[#66c0f4] rounded-xl text-slate-100 text-xs font-hud font-bold flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer"
              >
                {/* Official Steam SVG Logo */}
                <svg className="w-4 h-4 fill-current text-[#66c0f4]" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387l3.77-5.503a3.5 3.5 0 0 1-.362-1.528 3.5 3.5 0 0 1 3.5-3.5 3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5c-.328 0-.643-.05-.945-.138l-4.14 6.044A11.96 11.96 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 4.5a7.5 7.5 0 0 1 7.5 7.5c0 3.327-2.164 6.15-5.188 7.125l-2.072-3.023a4.5 4.5 0 0 0 2.76-4.102 4.5 4.5 0 0 0-4.5-4.5 4.5 4.5 0 0 0-4.5 4.5c0 .355.044.698.125 1.027l-2.91 4.246C3.125 15.65 4.5 13.977 4.5 12 4.5 7.858 7.858 4.5 12 4.5z"/>
                </svg>
                <span>Continue with Steam</span>
              </button>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#0d1627] hover:bg-[#121f37] border border-cyan-500/30 hover:border-cyan-400 rounded-xl text-slate-200 text-xs font-hud font-bold flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z" />
                </svg>
                <span>Sign in with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#0a0f1d] px-3 text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                  or email
                </span>
                <div className="border-t border-white/10 w-full" />
              </div>
            </div>
          )}

          {/* Steam Login Form */}
          {mode === 'steam' && (
            <form onSubmit={handleSteamAuth} className="space-y-4">
              <div className="p-3 bg-[#131b26] border border-[#2a475e] rounded-xl text-xs space-y-1">
                <span className="font-bold text-[#66c0f4] flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4" />
                  Steam Gaming Profile Sync
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Enter your Steam Persona Name / Custom URL to link your gaming identity across ARK and Minecraft.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Steam Persona / Gamertag
                </label>
                <input
                  type="text"
                  placeholder="e.g. ShadowHunter, Steve99"
                  value={steamInput}
                  onChange={(e) => setSteamInput(e.target.value)}
                  className="w-full bg-[#050a14] border border-[#2a475e] focus:border-[#66c0f4] rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#2a475e] hover:bg-[#3d6888] text-white font-hud font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  {isSubmitting ? 'Connecting...' : 'Connect Steam Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="px-3 py-2.5 bg-black/40 hover:bg-black/60 text-slate-400 text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Email / Password Form (Sign in or Sign up) */}
          {(mode === 'signin' || mode === 'signup') && (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Gamer Display Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter gamertag (optional)"
                    value={gamertag}
                    onChange={(e) => setGamertag(e.target.value)}
                    className="w-full bg-[#050a14] border border-cyan-500/30 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#050a14] border border-cyan-500/30 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#050a14] border border-cyan-500/30 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-hud font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : mode === 'signin' ? (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create Free Account</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    setError(null);
                  }}
                  className="text-xs text-cyan-400 hover:underline cursor-pointer"
                >
                  {mode === 'signin'
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </form>
          )}

          {/* Profile Management Mode */}
          {mode === 'profile' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs space-y-1">
                <div className="font-bold text-cyan-300">
                  Logged in as: {profile?.displayName || currentUser?.email || 'Player'}
                </div>
                <div className="text-slate-400 text-[11px] font-mono">
                  ID: {profile?.uid?.substring(0, 16)}...
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Gamertag / Display Name
                </label>
                <input
                  type="text"
                  value={gamertag}
                  onChange={(e) => setGamertag(e.target.value)}
                  className="w-full bg-[#050a14] border border-cyan-500/30 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Primary Gaming Platform
                </label>
                <select
                  value={platform}
                  onChange={(e: any) => setPlatform(e.target.value)}
                  className="w-full bg-[#050a14] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none cursor-pointer"
                >
                  <option value="PC / Steam">PC / Steam</option>
                  <option value="PlayStation 5">PlayStation 5</option>
                  <option value="Xbox Series X/S">Xbox Series X/S</option>
                  <option value="Nintendo Switch">Nintendo Switch</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-hud font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    onClose();
                  }}
                  className="px-3 py-2.5 bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 font-hud text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
