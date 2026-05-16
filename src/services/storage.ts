import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storage = {
  async get(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  },
  async set(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },
  async clear(): Promise<void> {
    await AsyncStorage.clear();
  },
  async getJSON<T>(key: string, fallback: T): Promise<T> {
    const val = await AsyncStorage.getItem(key);
    if (val === null) return fallback;
    try { return JSON.parse(val) as T; } catch { return fallback; }
  },
  async setJSON(key: string, value: unknown): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
};
