export interface Colors {
  bgMain: string;
  bgContent: string;
  bgPanel: string;
  border: string;
  hairline: string;
  textMain: string;
  textSub: string;
  textMuted: string;
  primary: string;
  primarySoft: string;
  accent: string;
  accentSoft: string;
  success: string;
  danger: string;
  gradientA: string;
  gradientB: string;
}

// ── Warm Linen (light) ───────────────────────────────────────
export const lightColors: Colors = {
  bgMain:      '#F2EDE3',
  bgContent:   '#FBF7EF',
  bgPanel:     '#EDE5D6',
  border:      '#E3DAC7',
  hairline:    '#E8E0CE',
  textMain:    '#2A2520',
  textSub:     '#5C544A',
  textMuted:   '#9A8F80',
  primary:     '#5F7A60',
  primarySoft: '#DDE3D8',
  accent:      '#B36B4E',
  accentSoft:  '#EFD9CB',
  success:     '#7A9B6A',
  danger:      '#C97064',
  gradientA:   '#5F7A60',
  gradientB:   '#7A9B6A',
};

// ── Dark ─────────────────────────────────────────────────────
export const darkColors: Colors = {
  bgMain:      '#0d1117',
  bgContent:   '#161b22',
  bgPanel:     '#21262d',
  border:      '#30363d',
  hairline:    '#30363d',
  textMain:    '#e6edf3',
  textSub:     '#adbac7',
  textMuted:   '#7d8590',
  primary:     '#e6edf3',
  primarySoft: 'rgba(230,237,243,0.1)',
  accent:      '#818cf8',
  accentSoft:  'rgba(129,140,248,0.15)',
  success:     '#22c55e',
  danger:      '#f85149',
  gradientA:   '#6366f1',
  gradientB:   '#8b5cf6',
};

// ── Earthy habit dot palette ──────────────────────────────────
export const HABIT_COLORS = [
  '#C97064', '#D89465', '#C9A961', '#7A9B6A',
  '#7BA5A8', '#7B85A8', '#9784A5', '#B58198',
];
