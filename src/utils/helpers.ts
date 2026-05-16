import { Habit } from '../context/AppContext';

export function getTodayStr(): string {
  const d = new Date();
  return getDateStr(d);
}

export function getDateStr(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function isHabitDoneOnDate(habit: Habit, dateStr: string): boolean {
  const val = habit.history[dateStr];
  if (habit.type === 'numeric') {
    return typeof val === 'number' && val >= habit.target;
  }
  return !!val;
}

export function getCurrentVal(habit: Habit, dateStr: string): number {
  const val = habit.history[dateStr];
  if (val === true) return habit.target;
  if (typeof val === 'number') return val;
  return 0;
}

export function calcHabitStreak(habit: Habit): number {
  const checkDate = new Date();
  let streak = 0;

  // If today isn't done yet, start counting from yesterday so an
  // in-progress day doesn't reset an active streak.
  if (!isHabitDoneOnDate(habit, getTodayStr())) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (isHabitDoneOnDate(habit, getDateStr(checkDate))) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}

export function calcGlobalMaxStreak(habits: Habit[]): number {
  return habits.reduce((max, h) => Math.max(max, calcHabitStreak(h)), 0);
}

export function calcCompletedToday(habits: Habit[], today: string): number {
  return habits.filter(h => isHabitDoneOnDate(h, today)).length;
}

export function calcLevel(xp: number): { level: number; currentXP: number } {
  return {
    level: Math.floor(xp / 100) + 1,
    currentXP: xp % 100,
  };
}

// Returns true when the user had an active streak but missed yesterday
export function isStreakBroken(habits: Habit[]): boolean {
  if (habits.length === 0) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = getDateStr(yesterday);
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const tStr = getDateStr(twoDaysAgo);

  // At least one habit was done 2 days ago (was active) but none done yesterday
  const wasActive = habits.some(h => isHabitDoneOnDate(h, tStr));
  const missedYesterday = !habits.some(h => isHabitDoneOnDate(h, yStr));
  return wasActive && missedYesterday;
}
