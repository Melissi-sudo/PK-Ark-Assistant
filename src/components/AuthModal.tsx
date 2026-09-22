import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  KeyRound, 
  Mail, 
  Server, 
  Users, 
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
    loginWithEmail, 
    signUpWithEmail, 
    logout, 
    updateProfile 
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'profile'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gamertag, setGamertag] = useState('');
  const [tribeName, setTribeName] = useState('The Pitsoni Empire');
  const [serverName, setServerName] = useState('Official-SmallTribes-124');
  const [platform, setPlatform] = useState<'PC / Steam' | 'PlayStation 5' | 'Xbox Series X/S'>('PC / Steam');

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync profile when opened
  React.useEffect(() => {
    if (currentUser && profile) {
      setMode('profile');
      setGamertag(profile.displayName || '');
      setTribeName(profile.tribeName || 'The Pitsoni Empire');
      setServerName(profile.serverName || 'Official-SmallTribes-124');
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
      }, 900);
    } catch (err: any) {
      setError(err.message || 'Google authentication encountered an issue.');
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
        setSuccessMessage('Welcome back, Survivor!');
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
        setSuccessMessage('Account created successfully! Welcome to the tribe.');
        setTimeout(() => onClose(), 1000);
      } else if (mode === 'profile') {
        await updateProfile({
          displayName: gamertag,
          tribeName,
          serverName,
          platform
        });
        setSuccessMessage('Survivor profile & tribe settings saved to Cloud!');
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
      <div className="relative w-full max-w-md bg-[#070e1b] border-2 border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/80 overflow-hidden">
        {/* Holographic Top Banner with ASA styling */}
        <div className="relative bg-gradient-to-r from-cyan-950/80 via-[#0a182c] to-cyan-950/80 p-5 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-cyan-400 font-tek font-bold shadow-md shadow-cyan-500/20">
              ◈
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-tek text-cyan-400 tracking-wider uppercase">SURVIVOR SECURE ACCESS</span>
                <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-1 py-0.2 rounded font-tek">
                  CLOUD PERSISTENCE
                </span>
              </div>
              <h3 className="text-base font-bold font-hud text-white">
                {currentUser ? 'SURVIVOR PROFILE & CLOUD SYNC' : 'SECURE ACCOUNT LOGIN'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/50 rounded-lg border border-transparent hover:border-cyan-500/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch for guests */}
        {!currentUser && (
          <div className="grid grid-cols-2 p-1.5 bg-[#050b14] border-b border-slate-800 text-xs font-hud font-bold">
            <button
              onClick={() => { setMode('signin'); setError(null); }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                mode === 'signin'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>SIGN IN</span>
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                mode === 'signup'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>CREATE ACCOUNT</span>
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* If already logged in: Profile management */}
          {currentUser ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-[#050a14] border border-cyan-500/20 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-tek">AUTHENTICATED USER</div>
                  <div className="text-sm font-bold text-cyan-300 truncate max-w-[240px]">
                    {currentUser.email || currentUser.displayName || 'Survivor'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    setMode('signin');
                  }}
                  className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 rounded-lg text-xs font-tek flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>LOGOUT</span>
                </button>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-tek text-slate-300 mb-1">
                    SURVIVOR GAMERTAG / NICKNAME
                  </label>
                  <input
                    type="text"
                    value={gamertag}
                    onChange={(e) => setGamertag(e.target.value)}
                    placeholder="e.g. AlphaPredator_99"
                    className="w-full bg-[#050b14] border border-cyan-500/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-hud"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-tek text-slate-300 mb-1 flex items-center gap-1">
                      <Users className="w-3 h-3 text-cyan-400" />
                      <span>TRIBE NAME</span>
                    </label>
                    <input
                      type="text"
                      value={tribeName}
                      onChange={(e) => setTribeName(e.target.value)}
                      className="w-full bg-[#050b14] border border-cyan-500/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-hud"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-tek text-slate-300 mb-1 flex items-center gap-1">
                      <Server className="w-3 h-3 text-cyan-400" />
                      <span>OFFICIAL SERVER</span>
                    </label>
                    <input
                      type="text"
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                      className="w-full bg-[#050b14] border border-cyan-500/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-hud"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-tek text-slate-300 mb-1 flex items-center gap-1">
                    <Gamepad2 className="w-3 h-3 text-cyan-400" />
                    <span>GAMING PLATFORM</span>
                  </label>
                  <select
                    value={platform}
                    onChange={(e: any) => setPlatform(e.target.value)}
                    className="w-full bg-[#050b14] border border-cyan-500/30 rounded-lg px-3 py-2 text-xs text-cyan-300 focus:outline-none focus:border-cyan-400 font-hud"
                  >
                    <option value="PC / Steam">PC / Steam (ARK Ascended)</option>
                    <option value="PlayStation 5">PlayStation 5</option>
                    <option value="Xbox Series X/S">Xbox Series X/S</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black font-bold font-hud rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>SAVE TO CLOUD</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            // Sign In / Sign Up Form
            <div className="space-y-4">
              {/* Google Sign In One-Click Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl font-hud text-xs font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md hover:border-cyan-400"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8 0-1.3.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-[10px] font-tek text-slate-500 uppercase">OR EMAIL CREDENTIALS</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-tek text-slate-300 mb-1">
                      SURVIVOR GAMERTAG
                    </label>
                    <input
                      type="text"
                      value={gamertag}
                      onChange={(e) => setGamertag(e.target.value)}
                      placeholder="e.g. Iron_Reaper"
                      className="w-full bg-[#050b14] border border-cyan-500/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-hud"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-tek text-slate-300 mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-cyan-400" />
                    <span>EMAIL ADDRESS</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="survivor@ark.com"
                    className="w-full bg-[#050b14] border border-cyan-500/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-hud"
                  />
                </div>

                <div>
                  <label className="block text-xs font-tek text-slate-300 mb-1 flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-cyan-400" />
                    <span>PASSWORD</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#050b14] border border-cyan-500/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-hud"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 mt-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-hud rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : mode === 'signin' ? (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>SIGN IN TO SURVIVOR ACCOUNT</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>CREATE SURVIVOR ACCOUNT</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-[#040810] p-3 text-center border-t border-slate-800/80 text-[11px] text-slate-400 font-hud">
          <span className="text-cyan-400">The Pitsoni Empire</span> • Official PvP Cloud Synchronization
        </div>
      </div>
    </div>
  );
};
