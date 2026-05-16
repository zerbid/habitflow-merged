import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Storage } from '../services/storage';
import {
  onUserStateChanged,
  syncToCloud,
  downloadFromCloud,
  deleteCloudData,
  signInWithGoogle,
  signOutUser,
  User,
  CloudData,
} from '../services/firebase';
import { getTodayStr } from '../utils/helpers';

export interface Habit {
  id: string;
  name: string;
  color: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  type: 'boolean' | 'numeric';
  target: number;
  createdAt: string;
  history: Record<string, boolean | number>;
}

export interface PendingReport {
  title: string;
  periodPrefix: string;
}

interface AppContextType {
  habits: Habit[];
  userXP: number;
  theme: 'dark' | 'light';
  notificationsEnabled: boolean;
  notificationTime: string;
  lastNotificationDate: string;
  user: User | null;
  isLoading: boolean;
  pendingReport: PendingReport | null;
  addHabit: (
    name: string,
    color: string,
    timeOfDay: Habit['timeOfDay'],
    type: Habit['type'],
    target: number,
  ) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string) => void;
  updateNumeric: (id: string, amount: number) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setNotifications: (enabled: boolean) => void;
  setNotificationTime: (time: string) => void;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  exportData: () => CloudData;
  importData: (data: CloudData) => Promise<void>;
  resetAllData: () => Promise<void>;
  clearPendingReport: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [userXP, setUserXP] = useState(0);
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTimeState] = useState('20:00');
  const [lastNotificationDate, setLastNotificationDate] = useState('');
  const [lastOpenedMonth, setLastOpenedMonth] = useState('');
  const [lastOpenedYear, setLastOpenedYear] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingReport, setPendingReport] = useState<PendingReport | null>(null);

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    const unsub = onUserStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const cloud = await downloadFromCloud(firebaseUser.uid);
        if (cloud) {
          await applyCloudData(cloud);
        } else {
          // Push local data up on first sign-in
          flushToCloud(firebaseUser.uid);
        }
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!isLoading) checkReports();
  }, [isLoading]);

  async function loadFromStorage() {
    try {
      const [
        habitsStr, xpStr, themeStr, notifEnabled,
        notifTime, notifDate, openedMonth, openedYear,
      ] = await Promise.all([
        Storage.get('habits'),
        Storage.get('userXP'),
        Storage.get('theme'),
        Storage.get('notificationsEnabled'),
        Storage.get('notificationTime'),
        Storage.get('lastNotificationDate'),
        Storage.get('lastOpenedMonth'),
        Storage.get('lastOpenedYear'),
      ]);

      if (habitsStr) setHabits(JSON.parse(habitsStr));
      if (xpStr) setUserXP(parseInt(xpStr));
      if (themeStr) setThemeState(themeStr as 'dark' | 'light');
      setNotificationsEnabled(notifEnabled === 'true');
      if (notifTime) setNotificationTimeState(notifTime);
      if (notifDate) setLastNotificationDate(notifDate);

      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const currentYear = now.getFullYear().toString();
      setLastOpenedMonth(openedMonth || currentMonth);
      setLastOpenedYear(openedYear || currentYear);
    } finally {
      setIsLoading(false);
    }
  }

  async function applyCloudData(data: CloudData) {
    if (data.habits?.length) {
      setHabits(data.habits);
      await Storage.setJSON('habits', data.habits);
    }
    if (data.userXP !== undefined) {
      setUserXP(data.userXP);
      await Storage.set('userXP', String(data.userXP));
    }
    if (data.theme) {
      setThemeState(data.theme as 'dark' | 'light');
      await Storage.set('theme', data.theme);
    }
    if (data.notificationsEnabled !== undefined) {
      setNotificationsEnabled(data.notificationsEnabled);
      await Storage.set('notificationsEnabled', String(data.notificationsEnabled));
    }
    if (data.notificationTime) {
      setNotificationTimeState(data.notificationTime);
      await Storage.set('notificationTime', data.notificationTime);
    }
    if (data.lastOpenedMonth) {
      setLastOpenedMonth(data.lastOpenedMonth);
      await Storage.set('lastOpenedMonth', data.lastOpenedMonth);
    }
    if (data.lastOpenedYear) {
      setLastOpenedYear(data.lastOpenedYear);
      await Storage.set('lastOpenedYear', data.lastOpenedYear);
    }
  }

  function buildCloudPayload(overrides: Partial<CloudData> = {}): CloudData {
    return {
      habits,
      userXP,
      theme,
      lastOpenedMonth,
      lastOpenedYear,
      notificationsEnabled,
      notificationTime,
      lastNotificationDate,
      ...overrides,
    };
  }

  function flushToCloud(uid: string, overrides: Partial<CloudData> = {}) {
    syncToCloud(uid, buildCloudPayload(overrides)).catch(console.error);
  }

  function persistHabits(next: Habit[], xpDelta = 0) {
    const nextXP = Math.max(0, userXP + xpDelta);
    setHabits(next);
    if (xpDelta !== 0) setUserXP(nextXP);
    Storage.setJSON('habits', next).catch(console.error);
    if (xpDelta !== 0) Storage.set('userXP', String(nextXP)).catch(console.error);
    if (user) flushToCloud(user.uid, { habits: next, userXP: nextXP });
  }

  function addHabit(
    name: string,
    color: string,
    timeOfDay: Habit['timeOfDay'],
    type: Habit['type'],
    target: number,
  ) {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      color,
      timeOfDay,
      type,
      target,
      createdAt: new Date().toISOString(),
      history: {},
    };
    persistHabits([...habits, newHabit]);
  }

  function deleteHabit(id: string) {
    persistHabits(habits.filter(h => h.id !== id));
  }

  function toggleHabit(id: string) {
    const today = getTodayStr();
    let xpDelta = 0;
    const next = habits.map(h => {
      if (h.id !== id) return h;
      const hist = { ...h.history };
      if (hist[today]) {
        delete hist[today];
        xpDelta = -10;
      } else {
        hist[today] = true;
        xpDelta = 10;
      }
      return { ...h, history: hist };
    });
    persistHabits(next, xpDelta);
  }

  function updateNumeric(id: string, amount: number) {
    if (!Number.isFinite(amount)) return;
    const today = getTodayStr();
    const next = habits.map(h => {
      if (h.id !== id) return h;
      const hist = { ...h.history };
      let cur = typeof hist[today] === 'number' ? (hist[today] as number) : 0;
      cur = Math.max(0, cur + amount);
      if (cur === 0) delete hist[today];
      else hist[today] = cur;
      return { ...h, history: hist };
    });
    persistHabits(next, amount * 2);
  }

  function setTheme(t: 'dark' | 'light') {
    setThemeState(t);
    Storage.set('theme', t).catch(console.error);
    if (user) flushToCloud(user.uid, { theme: t });
  }

  function setNotifications(enabled: boolean) {
    setNotificationsEnabled(enabled);
    Storage.set('notificationsEnabled', String(enabled)).catch(console.error);
    if (user) flushToCloud(user.uid, { notificationsEnabled: enabled });
  }

  function setNotificationTime(time: string) {
    setNotificationTimeState(time);
    Storage.set('notificationTime', time).catch(console.error);
    if (user) flushToCloud(user.uid, { notificationTime: time });
  }

  async function signIn() {
    await signInWithGoogle();
  }

  async function signOut() {
    await signOutUser();
    setUser(null);
  }

  function exportData(): CloudData {
    return buildCloudPayload();
  }

  async function importData(data: CloudData) {
    try {
      await applyCloudData(data);
      if (user) flushToCloud(user.uid);
    } catch (e) {
      console.error('Import failed:', e);
      throw e;
    }
  }

  async function resetAllData() {
    await Storage.clear();
    setHabits([]);
    setUserXP(0);
    setThemeState('dark');
    setNotificationsEnabled(false);
    setNotificationTimeState('20:00');
    setLastNotificationDate('');
    setLastOpenedMonth('');
    setLastOpenedYear('');
    if (user) await deleteCloudData(user.uid);
  }

  function checkReports() {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const currentYear = now.getFullYear().toString();

    if (lastOpenedYear && lastOpenedYear !== currentYear) {
      setPendingReport({ periodPrefix: lastOpenedYear, title: `${lastOpenedYear} Yılının Özeti` });
      setLastOpenedYear(currentYear);
      setLastOpenedMonth(currentMonth);
      Storage.set('lastOpenedYear', currentYear).catch(console.error);
      Storage.set('lastOpenedMonth', currentMonth).catch(console.error);
    } else if (lastOpenedMonth && lastOpenedMonth !== currentMonth) {
      const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
      const [y, m] = lastOpenedMonth.split('-');
      const label = `${monthNames[parseInt(m) - 1]} ${y} Özeti`;
      setPendingReport({ periodPrefix: lastOpenedMonth, title: label });
      setLastOpenedMonth(currentMonth);
      Storage.set('lastOpenedMonth', currentMonth).catch(console.error);
    }
  }

  function clearPendingReport() {
    setPendingReport(null);
  }

  return (
    <AppContext.Provider
      value={{
        habits,
        userXP,
        theme,
        notificationsEnabled,
        notificationTime,
        lastNotificationDate,
        user,
        isLoading,
        pendingReport,
        addHabit,
        deleteHabit,
        toggleHabit,
        updateNumeric,
        setTheme,
        setNotifications,
        setNotificationTime,
        signIn,
        signOut,
        exportData,
        importData,
        resetAllData,
        clearPendingReport,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
