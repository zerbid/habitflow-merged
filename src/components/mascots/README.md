# Mascots — Plant & Campfire

Habit-companion mascots that grow with consistent practice. Rendered with
`react-native-svg` + `Animated`. **No Lottie required.**

## Install

```sh
npx expo install react-native-svg
```

## Usage

```tsx
import Plant from './src/components/mascots/Plant';
import Campfire from './src/components/mascots/Campfire';

<Plant     stage={3} size={120} animate />
<Campfire  stage={3} size={120} animate />
```

## Props

| prop      | type                                     | default | notes                                     |
| --------- | ---------------------------------------- | ------- | ----------------------------------------- |
| `stage`   | `-1 \| 0 \| 1 \| 2 \| 3 \| 4`            | —       | growth stage (required)                   |
| `size`    | `number`                                 | `120`   | width in px — **height = size * 1.2**     |
| `animate` | `boolean`                                | `true`  | turn off for list rows / static thumbs    |

## Stage map

**Plant** — `-1` Solgun · `0` Tohum · `1` Filiz · `2` Genç · `3` Yetişmiş · `4` Çiçeklenme
**Campfire** — `-1` Köz · `0` Soğuk · `1` Kıvılcım · `2` Küçük · `3` Şenlik · `4` Coşkulu

Stage `-1` is the **broken-streak state** — yellowed plant or dark logs with
glowing embers. The mascot never disappears; it just slips.

## Stage helper

Compute consecutive completed days per habit, then map:

```ts
export function stageForStreak(
  consecutiveDays: number,
  daysSinceLastCompletion: number,
): -1 | 0 | 1 | 2 | 3 | 4 {
  if (daysSinceLastCompletion >= 3 && consecutiveDays > 0) return -1;
  if (consecutiveDays <= 0)  return 0;
  if (consecutiveDays <= 3)  return 1;
  if (consecutiveDays <= 10) return 2;
  if (consecutiveDays <= 25) return 3;
  return 4;
}
```

When the user completes the habit again after a `-1` state, recompute from the
new (smaller) consecutive count — the mascot recovers gradually.

## Animation

- **Plant sway**: rotate −2° → +2°, 3.4s ease-in-out, infinite.
- **Campfire flicker**: opacity 0.65 ↔ 1.0 (4-step), 0.8s, infinite.
- **Campfire glow halo**: separate `Animated.View` behind the SVG, opacity
  0.15 ↔ stage-max (0.35/0.45/0.55 for stages 2/3/4), 2s loop.
- **Stage −1 shake**: one-shot translateX wobble when the component first
  receives `stage={-1}` — signals "your streak just broke."

All transforms use `useNativeDriver: true` (UI thread, no JS bridge).

## Performance

- Pass `animate={false}` for habit list rows. Each animated mascot drives an
  Animated.Value; dozens of them is fine but unnecessary off-screen.
- Glow uses a colored View instead of an SVG element — cheaper to repaint.
- No gradients (per spec — flat colors + opacity only).

## Files

```
src/components/mascots/
├── Plant.tsx
├── Campfire.tsx
└── README.md  ← you are here
```

Design canvas reference: open `index.html` → "Growth mascots · Bitki & Ateş"
section. The canvas mockups use the exact same viewBox/coordinates/palette as
these TSX components, so visuals stay in lockstep with design.
