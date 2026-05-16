import { initializeApp, getApps } from 'firebase/app';
import {
  initializeAuth,
  inMemoryPersistence,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
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

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// initializeAuth with explicit persistence avoids the
// "Component auth has not been registered yet" crash on React Native / Hermes.
// inMemoryPersistence keeps auth alive for the app session; habit data
// (habits, XP, theme) is independently persisted in AsyncStorage.
const auth = initializeAuth(firebaseApp, {
  persistence: inMemoryPersistence,
});

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
