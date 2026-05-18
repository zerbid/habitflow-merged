import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  inMemoryPersistence,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
  Auth,
} from 'firebase/auth';
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
const db = getFirestore(firebaseApp);

// Auth is initialized lazily on first use so that a registration failure
// never crashes the app at startup. All habit data lives in AsyncStorage and
// the app runs fully offline; auth is only needed for optional cloud sync.
let _auth: Auth | null = null;

function getFirebaseAuth(): Auth | null {
  if (_auth) return _auth;
  try {
    _auth = initializeAuth(firebaseApp, { persistence: inMemoryPersistence });
  } catch {
    try { _auth = getAuth(firebaseApp); } catch { _auth = null; }
  }
  return _auth;
}

export type { User };

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
  const auth = getFirebaseAuth();
  if (!auth) { callback(null); return () => {}; }
  return onAuthStateChanged(auth, callback);
}

export async function signInWithGoogle(): Promise<User | null> {
  const auth = getFirebaseAuth();
  if (!auth) return null;
  try {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    return result.user;
  } catch (e) {
    console.error('Sign in error:', e);
    return null;
  }
}

export async function signOutUser(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) return;
  return signOut(auth);
}

export async function syncToCloud(uid: string, data: CloudData): Promise<void> {
  try {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
  } catch (e) {
    console.error('Cloud sync error:', e);
  }
}

export async function downloadFromCloud(uid: string): Promise<CloudData | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    const raw = snap.data();
    if (!raw || typeof raw !== 'object' || !Array.isArray(raw['habits'])) return null;
    return raw as CloudData;
  } catch (e) {
    console.error('Cloud download error:', e);
    return null;
  }
}

export async function deleteCloudData(uid: string): Promise<void> {
  try {
    await setDoc(doc(db, 'users', uid), { habits: [], userXP: 0, theme: 'dark' });
  } catch (e) {
    console.error('Cloud delete error:', e);
  }
}
