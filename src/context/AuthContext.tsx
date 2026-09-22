import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from '../lib/firebase';

export interface SurvivorProfile {
  uid: string;
  email: string | null;
  displayName: string;
  tribeName: string;
  serverName: string;
  platform: 'PC / Steam' | 'PlayStation 5' | 'Xbox Series X/S';
  favoriteDinos: string[];
  createdAt?: any;
  updatedAt?: any;
}

interface AuthContextType {
  currentUser: User | null;
  profile: SurvivorProfile | null;
  accountName: string;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, initialGamertag?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<SurvivorProfile>) => Promise<void>;
  saveAccountName: (name: string, tribe?: string, server?: string, platform?: 'PC / Steam' | 'PlayStation 5' | 'Xbox Series X/S') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_NAME = 'ark_survivor_account_name';
const LOCAL_STORAGE_KEY_TRIBE = 'ark_survivor_tribe_name';
const LOCAL_STORAGE_KEY_SERVER = 'ark_survivor_server_name';
const LOCAL_STORAGE_KEY_PLATFORM = 'ark_survivor_platform';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Initialize from localStorage so account name is never lost
  const getInitialName = (): string => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_NAME);
      if (saved && saved.trim()) return saved.trim();
    } catch (_) {}
    return 'foxy24013';
  };

  const getInitialTribe = (): string => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TRIBE);
      if (saved && saved.trim()) return saved.trim();
    } catch (_) {}
    return 'The Pitsoni Empire';
  };

  const [accountName, setAccountNameState] = useState<string>(getInitialName);
  const [profile, setProfile] = useState<SurvivorProfile | null>(() => ({
    uid: 'local_survivor_' + getInitialName(),
    email: null,
    displayName: getInitialName(),
    tribeName: getInitialTribe(),
    serverName: 'Official-SmallTribes-124',
    platform: 'PC / Steam',
    favoriteDinos: ['pyromane', 'stegosaurus', 'carcharodontosaurus']
  }));
  const [loading, setLoading] = useState<boolean>(true);

  // Load user profile from Firestore
  const loadProfile = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data() as SurvivorProfile;
        // Prioritize custom set displayName if available
        const effectiveName = data.displayName || accountName || user.email?.split('@')[0] || 'Survivor';
        const mergedProfile = { ...data, displayName: effectiveName };
        setProfile(mergedProfile);
        setAccountNameState(effectiveName);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY_NAME, effectiveName);
        } catch (_) {}
      } else {
        // Create initial profile with saved name
        const newProfile: SurvivorProfile = {
          uid: user.uid,
          email: user.email,
          displayName: accountName || user.displayName || user.email?.split('@')[0] || 'Survivor',
          tribeName: getInitialTribe(),
          serverName: 'Official-SmallTribes-124',
          platform: 'PC / Steam',
          favoriteDinos: ['pyromane', 'stegosaurus', 'carcharodontosaurus'],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      }
    } catch (err) {
      console.warn('Could not fetch Firestore profile, using local fallback:', err);
      setProfile({
        uid: user.uid,
        email: user.email,
        displayName: accountName || user.displayName || 'Survivor',
        tribeName: getInitialTribe(),
        serverName: 'Official-SmallTribes-124',
        platform: 'PC / Steam',
        favoriteDinos: ['pyromane', 'stegosaurus']
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadProfile(user);
      } else {
        // If logged out or unauthenticated, keep local survivor profile with saved account name
        const currentSavedName = getInitialName();
        setAccountNameState(currentSavedName);
        setProfile({
          uid: 'local_survivor_' + currentSavedName,
          email: null,
          displayName: currentSavedName,
          tribeName: getInitialTribe(),
          serverName: 'Official-SmallTribes-124',
          platform: 'PC / Steam',
          favoriteDinos: ['pyromane', 'stegosaurus']
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveAccountName = async (
    name: string, 
    tribe?: string, 
    server?: string, 
    platform?: 'PC / Steam' | 'PlayStation 5' | 'Xbox Series X/S'
  ) => {
    const cleanName = name.trim() || 'Survivor';
    setAccountNameState(cleanName);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_NAME, cleanName);
      if (tribe) localStorage.setItem(LOCAL_STORAGE_KEY_TRIBE, tribe);
      if (server) localStorage.setItem(LOCAL_STORAGE_KEY_SERVER, server);
      if (platform) localStorage.setItem(LOCAL_STORAGE_KEY_PLATFORM, platform);
    } catch (e) {
      console.warn('localStorage write error:', e);
    }

    setProfile(prev => {
      if (!prev) {
        return {
          uid: currentUser ? currentUser.uid : 'local_survivor_' + cleanName,
          email: currentUser?.email || null,
          displayName: cleanName,
          tribeName: tribe || 'The Pitsoni Empire',
          serverName: server || 'Official-SmallTribes-124',
          platform: platform || 'PC / Steam',
          favoriteDinos: ['pyromane', 'stegosaurus']
        };
      }
      return {
        ...prev,
        displayName: cleanName,
        tribeName: tribe || prev.tribeName,
        serverName: server || prev.serverName,
        platform: platform || prev.platform
      };
    });

    // If logged into Firebase, update Firestore user document
    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), {
          displayName: cleanName,
          tribeName: tribe || profile?.tribeName || 'The Pitsoni Empire',
          serverName: server || profile?.serverName || 'Official-SmallTribes-124',
          platform: platform || profile?.platform || 'PC / Steam',
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (e) {
        console.warn('Firestore write warning:', e);
      }
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await loadProfile(result.user);
      }
    } catch (error: any) {
      console.error('Google Sign-in failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        await loadProfile(result.user);
      }
    } catch (error: any) {
      console.error('Email login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, initialGamertag?: string) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        const newProfile: SurvivorProfile = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: initialGamertag || result.user.email?.split('@')[0] || 'Survivor',
          tribeName: 'The Pitsoni Empire',
          serverName: 'Official-SmallTribes-124',
          platform: 'PC / Steam',
          favoriteDinos: ['pyromane', 'stegosaurus'],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        try {
          await setDoc(doc(db, 'users', result.user.uid), newProfile);
        } catch (e) {
          console.warn('Firestore write error during signup:', e);
        }
        setProfile(newProfile);
      }
    } catch (error: any) {
      console.error('Email sign up failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  const updateProfile = async (data: Partial<SurvivorProfile>) => {
    if (!currentUser || !profile) return;
    const updated = { ...profile, ...data, updatedAt: serverTimestamp() };
    setProfile(updated);
    try {
      await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
    } catch (e) {
      console.warn('Failed to update profile in firestore:', e);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      profile,
      accountName,
      loading,
      signInWithGoogle,
      loginWithEmail,
      signUpWithEmail,
      logout,
      updateProfile,
      saveAccountName
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
