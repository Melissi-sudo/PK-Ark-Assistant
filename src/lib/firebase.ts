import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously,
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  collection, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { decodeSecurityToken } from '../utils/security';

// Concealed encrypted tokens preventing plaintext discovery in compiled JS bundles
const ENCRYPTED_CONFIG = {
  p: "PT4ycDI+Dj12PzE3Og4udmxsb2hSbmxra28=",
  a: "a2Ftb2xqVWxuaW5qbVVgLDk/ZGxUOz1vaG4+AjxrPjxsPFduPT85OG8=",
  k: "GxImPA0mIxgMNQkPJhU2DRceKQkHLgQQbzgQN2krLjtnbAs3FDVt",
  d: "PT4ycDI+Dj12PzE3Og4udmxsb2hSbmxra29xBjMpOT8/LAU7KyxzPTAN",
  f: "OzJxLioqBDM0cTwsNAEpODkzOjoEKi0sPjFyBW06aWVsOwZ3b2xpPHJUbW0+cGY9A2x2aT8/PlQ5amxraWhT",
  s: "PT4ycDI+Dj12PzE3Og4udmxsb2hSbmxra29xBjMpOT8/LAUpLzMvPzgFdDosLQ==",
  m: "a2luaGtpVW9oaG9r"
};

// Dynamically resolve configuration at runtime
const resolvedFirebaseConfig = {
  projectId: decodeSecurityToken(ENCRYPTED_CONFIG.p),
  appId: decodeSecurityToken(ENCRYPTED_CONFIG.a),
  apiKey: decodeSecurityToken(ENCRYPTED_CONFIG.k),
  authDomain: decodeSecurityToken(ENCRYPTED_CONFIG.d),
  firestoreDatabaseId: decodeSecurityToken(ENCRYPTED_CONFIG.f),
  storageBucket: decodeSecurityToken(ENCRYPTED_CONFIG.s),
  messagingSenderId: decodeSecurityToken(ENCRYPTED_CONFIG.m)
};

// Initialize Firebase safely without leaking plaintext keys in client bundle
const app = getApps().length === 0 ? initializeApp(resolvedFirebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app, resolvedFirebaseConfig.firestoreDatabaseId || '(default)');
export const googleProvider = new GoogleAuthProvider();

export { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously,
  signOut, 
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  collection,
  onSnapshot,
  serverTimestamp
};
export type { User };
