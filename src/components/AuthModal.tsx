import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  KeyRound, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  LogOut,
  Save,
  ShieldCheck,
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
  const [platform, setPlatform] = useState<'PC / Steam' | 'PlayStation 5' | 'Xbox Series X/S' | 'Nintendo Switch'>('PC / Steam');

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync profile state when opened
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
      setSuccessMessage('Successfully signed in with Google!');
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
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
        setSuccessMessage('Signed in successfully!');
        setTimeout(() => {
          onClose();
        }, 800);
      } else if (mode === 'signup') {
        await signUpWithEmail(email, password, gamertag.trim() || undefined);
        setSuccessMessage('Account created and profile initialized!');
        setTimeout(() => {
          onClose();
        }, 800);
      } else if (mode === 'profile') {
        await updateProfile({
          displayName: gamertag,
          platform
        });
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please double check credentials.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please sign in.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0c1222] border border-gray-200 dark:border-cyan-500/40 rounded-[28px] shadow-2xl overflow-hidden font-sf-text text-[#111827] dark:text-slate-100 transition-colors">
        {/* Top Header */}
        <div className="relative bg-gray-50 dark:bg-gradient-to-r dark:from-cyan-950/90 dark:via-[#0c1a30] dark:to-purple-950/90 p-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-cyan-950/80 border border-gray-200 dark:border-cyan-400/50 flex items-center justify-center p-1.5 shadow-sm shrink-0">
              <img 
                src="/logo.png?v=pk-v3" 
                alt="PK Ultimate Guide Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#111827] dark:text-white tracking-tight text-sm sm:text-base font-sf-display">
                  PK Ultimate Guide
                </span>
                <span className="text-[10px] font-bold bg-blue-50 dark:bg-cyan-500/20 text-[#0066cc] dark:text-cyan-300 border border-blue-200 dark:border-cyan-400/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ACCOUNT
                </span>
              </div>
              <p className="text-xs text-[#4b5563] dark:text-slate-400 font-medium">
                Cloud profile & timer sync
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 border border-gray-200 dark:border-transparent text-[#4b5563] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Status Messages */}
          {error && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/40 rounded-2xl text-red-700 dark:text-red-200 text-xs flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 rounded-2xl text-emerald-700 dark:text-emerald-200 text-xs flex items-center gap-2.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Social Sign-in Options */}
          {mode !== 'profile' && (
            <div className="space-y-3">
              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-white dark:bg-[#121c2e] hover:bg-gray-50 dark:hover:bg-[#18263e] border border-gray-200 dark:border-cyan-500/30 hover:border-[#0066cc] dark:hover:border-cyan-400 rounded-full text-[#111827] dark:text-slate-100 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-gray-200 dark:border-white/10 w-full" />
                <span className="bg-white dark:bg-[#0c1222] px-3 text-[10px] text-[#4b5563] dark:text-slate-400 uppercase tracking-wider font-semibold">
                  or email
                </span>
                <div className="border-t border-gray-200 dark:border-white/10 w-full" />
              </div>
            </div>
          )}

          {/* Email / Password Form (Sign in or Sign up) */}
          {(mode === 'signin' || mode === 'signup') && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-[#374151] dark:text-slate-300 mb-1.5">
                    Gamer Display Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter gamertag / display name"
                    value={gamertag}
                    onChange={(e) => setGamertag(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#060b14] border border-gray-200 dark:border-cyan-500/30 focus:border-[#0066cc] dark:focus:border-cyan-400 rounded-2xl px-3.5 py-2.5 text-xs text-[#111827] dark:text-slate-100 placeholder-[#9ca3af] focus:outline-none transition-all font-medium"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#374151] dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9ca3af] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#060b14] border border-gray-200 dark:border-cyan-500/30 focus:border-[#0066cc] dark:focus:border-cyan-400 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-[#111827] dark:text-slate-100 placeholder-[#9ca3af] focus:outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#9ca3af] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#060b14] border border-gray-200 dark:border-cyan-500/30 focus:border-[#0066cc] dark:focus:border-cyan-400 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-[#111827] dark:text-slate-100 placeholder-[#9ca3af] focus:outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#0066cc] hover:bg-[#0055b3] text-white font-bold text-xs rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : mode === 'signin' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
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
                  className="text-xs text-[#0066cc] dark:text-cyan-400 hover:underline cursor-pointer font-semibold"
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
              <div className="p-4 bg-gray-50 dark:bg-cyan-950/40 border border-gray-200 dark:border-cyan-500/30 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-[#111827] dark:text-cyan-300">
                  Logged in as: {profile?.displayName || currentUser?.email || 'Player'}
                </div>
                <div className="text-[#4b5563] dark:text-slate-400 text-[11px] font-mono">
                  ID: {profile?.uid?.substring(0, 16)}...
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] dark:text-slate-300 mb-1.5">
                  Gamertag / Display Name
                </label>
                <input
                  type="text"
                  value={gamertag}
                  onChange={(e) => setGamertag(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#060b14] border border-gray-200 dark:border-cyan-500/30 focus:border-[#0066cc] rounded-2xl px-3.5 py-2.5 text-xs text-[#111827] dark:text-slate-100 focus:outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] dark:text-slate-300 mb-1.5">
                  Primary Gaming Platform
                </label>
                <select
                  value={platform}
                  onChange={(e: any) => setPlatform(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#060b14] border border-gray-200 dark:border-cyan-500/30 rounded-2xl px-3.5 py-2.5 text-xs text-[#111827] dark:text-slate-100 focus:outline-none cursor-pointer font-medium"
                >
                  <option value="PC / Steam" className="bg-white dark:bg-[#0c1222]">PC / Steam</option>
                  <option value="PlayStation 5" className="bg-white dark:bg-[#0c1222]">PlayStation 5</option>
                  <option value="Xbox Series X/S" className="bg-white dark:bg-[#0c1222]">Xbox Series X/S</option>
                  <option value="Nintendo Switch" className="bg-white dark:bg-[#0c1222]">Nintendo Switch</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#0066cc] hover:bg-[#0055b3] text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    onClose();
                  }}
                  className="px-5 py-3 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/80 border border-red-200 dark:border-red-500/40 text-red-600 dark:text-red-300 text-xs font-bold rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
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
