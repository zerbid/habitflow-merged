/**
 * Logistic regression engine for per-habit completion probability.
 *
 * Model: P(completed today) = sigmoid(w · x)
 *
 * Features per sample (x):
 *   [1, dayOfWeek/6, last7Rate, last14Rate]
 *    ^bias  ^day context   ^recent momentum
 *
 * Training: mini-batch gradient descent on the habit's own history.
 * Requires ≥ 14 days of history to produce at least 7 training samples.
 * Below that threshold returns 'unknown'.
 */

import { Habit } from '../context/AppContext';

// ── Math primitives ────────────────────────────────────────────────────────────

function sigmoid(x: number): number {
  // clamp to avoid overflow in exp
  const clamped = Math.max(-30, Math.min(30, x));
  return 1 / (1 + Math.exp(-clamped));
}

function dot(a: number[], b: number[]): number {
  return a.reduce((s, v, i) => s + v * b[i], 0);
}

// ── Feature engineering ────────────────────────────────────────────────────────

function isCompleted(habit: Habit, dateStr: string): boolean {
  const val = habit.history[dateStr];
  if (habit.type === 'boolean') return val === true;
  return typeof val === 'number' && habit.target > 0 && val >= habit.target;
}

/** [bias, dayOfWeek_norm, last7Rate, last14Rate] */
function buildFeatures(dayOfWeek: number, last7Rate: number, last14Rate: number): number[] {
  return [1, dayOfWeek / 6, last7Rate, last14Rate];
}

interface Sample {
  x: number[];
  y: number; // 0 | 1
}

function extractSamples(habit: Habit): Sample[] {
  // Sort all recorded dates ascending
  const dates = Object.keys(habit.history).sort();
  if (dates.length < 14) return [];

  const samples: Sample[] = [];

  // Start at index 7 so we always have a full last-7 window
  for (let i = 7; i < dates.length; i++) {
    const d     = new Date(dates[i]);
    const dow   = d.getDay();

    const w7    = dates.slice(Math.max(0, i - 7),  i);
    const w14   = dates.slice(Math.max(0, i - 14), i);

    const r7  = w7.length  === 0 ? 0.5 : w7.filter(dd  => isCompleted(habit, dd)).length  / w7.length;
    const r14 = w14.length === 0 ? 0.5 : w14.filter(dd => isCompleted(habit, dd)).length / w14.length;

    samples.push({
      x: buildFeatures(dow, r7, r14),
      y: isCompleted(habit, dates[i]) ? 1 : 0,
    });
  }

  return samples;
}

// ── Logistic regression trainer ────────────────────────────────────────────────

function trainLogistic(
  samples: Sample[],
  iterations = 250,
  lr        = 0.1,
): number[] {
  const nFeatures = samples[0].x.length;
  const w = new Array(nFeatures).fill(0) as number[];

  for (let iter = 0; iter < iterations; iter++) {
    const grad = new Array(nFeatures).fill(0) as number[];
    for (const s of samples) {
      const err = sigmoid(dot(w, s.x)) - s.y;
      for (let j = 0; j < nFeatures; j++) grad[j] += err * s.x[j];
    }
    for (let j = 0; j < nFeatures; j++) w[j] -= (lr * grad[j]) / samples.length;
  }

  return w;
}

// ── Public API ─────────────────────────────────────────────────────────────────

export type RiskLevel = 'high' | 'medium' | 'low' | 'unknown';

export interface Prediction {
  probability: number;  // 0–1, or -1 when unknown
  risk: RiskLevel;
  pctLabel: string;     // e.g. "%34"
  riskLabel: string;    // human-readable Turkish label
}

const UNKNOWN: Prediction = {
  probability: -1,
  risk: 'unknown',
  pctLabel: '—',
  riskLabel: 'Yeterli veri yok',
};

/**
 * Predict the probability that `habit` will be completed today.
 * Returns UNKNOWN if the habit has fewer than 14 days of history.
 *
 * NOTE: Training runs synchronously (~1 ms for 30 samples).
 * For long histories (200+ days) consider memoising by (habitId, today).
 */
export function predictToday(habit: Habit): Prediction {
  const samples = extractSamples(habit);
  if (samples.length < 7) return UNKNOWN;

  const w   = trainLogistic(samples);
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  // Build today's feature vector from history up to yesterday
  const before  = Object.keys(habit.history).sort().filter(d => d < todayStr);
  const w7      = before.slice(-7);
  const w14     = before.slice(-14);

  const r7  = w7.length  === 0 ? 0.5 : w7.filter(d  => isCompleted(habit, d)).length  / w7.length;
  const r14 = w14.length === 0 ? 0.5 : w14.filter(d => isCompleted(habit, d)).length / w14.length;

  const p    = sigmoid(dot(w, buildFeatures(today.getDay(), r7, r14)));
  const pct  = Math.round(p * 100);
  const risk: RiskLevel = p < 0.40 ? 'high' : p < 0.65 ? 'medium' : 'low';

  const riskLabel =
    risk === 'high'   ? 'Risk var — dikkat et'  :
    risk === 'medium' ? 'Orta ihtimal'           :
                        'İyi gidiyorsun';

  return { probability: p, risk, pctLabel: `%${pct}`, riskLabel };
}

/**
 * Batch-predict for a list of habits. Returns a map: habitId → Prediction.
 * Filters out habits already completed today.
 */
export function predictAll(habits: Habit[], today: string): Map<string, Prediction> {
  const map = new Map<string, Prediction>();
  for (const h of habits) {
    const alreadyDone =
      h.type === 'boolean'
        ? h.history[today] === true
        : typeof h.history[today] === 'number' &&
          (h.history[today] as number) >= h.target;
    if (!alreadyDone) map.set(h.id, predictToday(h));
  }
  return map;
}
