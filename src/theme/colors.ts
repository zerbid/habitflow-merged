export interface Colors {
  bgMain: string;
  bgContent: string;
  bgPanel: string;
  border: string;
  textMain: string;
  textMuted: string;
  primary: string;
  accent: string;
  accentSoft: string;
  success: string;
  danger: string;
  // gradient stops
  gradientA: string;
  gradientB: string;
}

export const darkColors: Colors = {
  bgMain: '#0d1117',
  bgContent: '#161b22',
  bgPanel: '#21262d',
  border: '#30363d',
  textMain: '#e6edf3',
  textMuted: '#7d8590',
  primary: '#e6edf3',
  accent: '#818cf8',
  accentSoft: 'rgba(129,140,248,0.15)',
  success: '#22c55e',
  danger: '#f85149',
  gradientA: '#6366f1',
  gradientB: '#8b5cf6',
};

export const lightColors: Colors = {
  bgMain: '#f0f4ff',
  bgContent: '#ffffff',
  bgPanel: '#f8faff',
  border: '#e2e8f0',
  textMain: '#1e293b',
  textMuted: '#64748b',
  primary: '#1e293b',
  accent: '#6366f1',
  accentSoft: 'rgba(99,102,241,0.10)',
  success: '#16a34a',
  danger: '#dc2626',
  gradientA: '#6366f1',
  gradientB: '#8b5cf6',
};

export const HABIT_COLORS = [
  '#f43f5e', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#6366f1', '#a855f7', '#ec4899',
];
