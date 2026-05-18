import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
  Auth,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// getReactNativePersistence is present in the RN bundle but absent from TS types in this version
const { getReactNativePersistence } = require('firebase/auth') as {
  getReactNativePersistence: (storage: typeof AsyncStorage) => any;
};
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { Habit } from '../context/AppContext';

const firebaseConfig = {
  apiKey: 'AIzaSyDUE9s_TsKYgayqMUODsUOmwlzsRjmMANE',
  authDomain: 'habitflow-e5355.firebaseapp.com',
  projectId: 'habitflow-e5355',
  storageBucket: 'habitflow-e5355.firebasestorage.app',
  messagingSenderId: '558086172753',
  appId: '1:558086172753:web:b0eb0df1ed47cc83064870',
  measurementId: 'G-S4670MCZ6R',
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// getReactNativePersistence is the officially supported persistence for
// React Native / Expo Go. Falls back to getAuth() if initializeAuth was
// already called (e.g. during Fast Refresh hot-reload).
let auth: Auth;
try {
  auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(firebaseApp);
}

const db = getFirestore(firebaseApp);

export type { User };
export { auth };

export interface CloudData {
  habits: Habit[];
  userXP: number;
  theme: string;
  lastOpenedMonth: string;
  lastOpenedYear: string;
  notificationsEnabled: boolean;
  notificationTime: string;
  lastNotificationDate: string;
  mascotType: string;
  freezeTokens: number;
  lastFreezeUsedDate: string;
}

export function onUserStateChanged(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function signInWithGoogle(): Promise<User | null> {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (e) {
    console.error('Sign in error:', e);
    return null;
  }
}

export async function signOutUser(): Promise<void> {
  return signOut(auth);
}

export async function syncToCloud(uid: string, data: CloudData): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, data, { merge: true });
  } catch (e) {
    console.error('Cloud sync error:', e);
  }
}

export async function downloadFromCloud(uid: string): Promise<CloudData | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;
    const raw = snap.data();
    // Validate minimum shape before trusting the cast
    if (!raw || typeof raw !== 'object' || !Array.isArray(raw['habits'])) return null;
    return raw as CloudData;
  } catch (e) {
    console.error('Cloud download error:', e);
    return null;
  }
}

export async function deleteCloudData(uid: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { habits: [], userXP: 0, theme: 'dark' });
  } catch (e) {
    console.error('Cloud delete error:', e);
  }
}
