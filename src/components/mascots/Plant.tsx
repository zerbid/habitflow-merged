// src/components/mascots/Plant.tsx
// Habit-companion mascot. 6 stages (-1 wilted through 4 flowering).
// Renders with react-native-svg + Animated (no Lottie required).
//
// Install once:
//   npx expo install react-native-svg
//
// Usage:
//   <Plant stage={3} size={120} animate />

import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, {
  Circle, Ellipse, Rect, G, Path,
} from 'react-native-svg';

const AnimatedG = Animated.createAnimatedComponent(G);

export interface PlantProps {
  /** -1 wilted · 0 dormant · 1 sprout · 2 young · 3 growing · 4 full */
  stage: -1 | 0 | 1 | 2 | 3 | 4;
  /** width in px — height renders at size * 1.2 */
  size?: number;
  animate?: boolean;
}

const C = {
  soil:        '#4a2c0a',
  soilDark:    '#3a2206',
  seed:        '#7c5a3f',

  // wilted
  wiltStem:    '#8a7025',
  wiltLeaf:    '#c8a020',
  wiltLeafD:   '#a07e14',

  // alive
  stem1:       '#558b2f',
  stem3:       '#33691e',
  stem4:       '#1b5e20',
  leaf:        '#7cb342',
  leafLight:   '#8bc34a',
  leafBright:  '#9ccc65',
  bush1:       '#388e3c',
  bush2:       '#43a047',
  bush3:       '#4caf50',
  bush4:       '#66bb6a',
  bush5:       '#81c784',

  flowerOuter: '#f9a825',
  flowerInner: '#ff8f00',

  eye:         '#2a2520',
  cheek:       '#e8a8a0',
};

export default function Plant({ stage, size = 120, animate = true }: PlantProps) {
  const sway  = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) return;
    if (stage === -1) {
      // one-shot shake when stage transitions to wilted
      Animated.sequence([
        Animated.timing(shake, { toValue: 1,  duration: 80, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 80, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 1,  duration: 80, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 80, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0,  duration: 80, useNativeDriver: true }),
      ]).start();
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, {
          toValue: 1, duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(sway, {
          toValue: 0, duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animate, sway, shake, stage]);

  const rotate     = sway.interpolate({ inputRange: [0, 1], outputRange: ['-2deg', '2deg'] });
  const translateX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-3, 3] });

  return (
    <Animated.View style={{ width: size, height: size * 1.2, transform: [{ translateX }] }}>
      <Svg width={size} height={size * 1.2} viewBox="0 0 100 120">
        {/* Soil base — present at every stage */}
        <Ellipse cx={50} cy={103} rx={32} ry={3.5} fill={C.soil} opacity={0.5} />
        <Rect x={18} y={100} width={64} height={14} rx={6} fill={C.soil} />
        <Rect x={18} y={100} width={64} height={2} fill={C.soilDark} />

        <AnimatedG style={{ transform: [{ rotate }], transformOrigin: '50px 100px' } as any}>
          {stage === -1 && <Wilted />}
          {stage === 0  && <Seed />}
          {stage === 1  && <Sprout />}
          {stage === 2  && <Young />}
          {stage === 3  && <Growing />}
          {stage === 4  && <Full />}
        </AnimatedG>
      </Svg>
    </Animated.View>
  );
}

// ── small face helpers ────────────────────────────────────
function Eye({ cx, cy, r = 1.5 }: { cx: number; cy: number; r?: number }) {
  return <Circle cx={cx} cy={cy} r={r} fill={C.eye} />;
}
function Cheek({ cx, cy, r = 1.3 }: { cx: number; cy: number; r?: number }) {
  return <Circle cx={cx} cy={cy} r={r} fill={C.cheek} opacity={0.75} />;
}

// ── stages ────────────────────────────────────────────────
function Seed() {
  return <Ellipse cx={50} cy={101.5} rx={2.5} ry={1.3} fill={C.seed} />;
}

function Sprout() {
  return (
    <G>
      <Rect x={48.5} y={82} width={3} height={18.5} fill={C.stem1} rx={1.5} />
      <Ellipse cx={42} cy={84} rx={5} ry={2.5} fill={C.leaf}      transform="rotate(-35 42 84)" />
      <Ellipse cx={58} cy={84} rx={5} ry={2.5} fill={C.leafLight} transform="rotate( 35 58 84)" />
    </G>
  );
}

function Young() {
  return (
    <G>
      <Rect x={48.5} y={62} width={3} height={38.5} fill={C.stem1} rx={1.5} />
      <Ellipse cx={40} cy={88} rx={7}   ry={3}   fill={C.leaf}      transform="rotate(-30 40 88)" />
      <Ellipse cx={60} cy={88} rx={7}   ry={3}   fill={C.leaf}      transform="rotate( 30 60 88)" />
      <Ellipse cx={42} cy={73} rx={6}   ry={2.8} fill={C.leafLight} transform="rotate(-30 42 73)" />
      <Ellipse cx={58} cy={73} rx={6}   ry={2.8} fill={C.leafLight} transform="rotate( 30 58 73)" />
      {/* top cluster */}
      <Circle cx={50} cy={60} r={10}   fill={C.leaf} />
      <Circle cx={45} cy={57} r={5.5}  fill={C.leafLight} />
      <Circle cx={55} cy={57} r={5.5}  fill={C.leafLight} />
      <Circle cx={50} cy={54} r={4.5}  fill={C.leafBright} />
      {/* face */}
      <Eye cx={46} cy={61} />
      <Eye cx={54} cy={61} />
      <Cheek cx={43} cy={64} />
      <Cheek cx={57} cy={64} />
      <Path d="M 47 64 Q 50 67 53 64" stroke={C.eye} strokeWidth={0.9} fill="none" strokeLinecap="round" />
    </G>
  );
}

function Growing() {
  return (
    <G>
      <Rect x={48.5} y={48} width={3} height={52.5} fill={C.stem3} rx={1.5} />
      {/* side leaf clusters */}
      <Circle cx={37} cy={86} r={6}   fill={C.leaf} />
      <Circle cx={41} cy={82} r={5}   fill={C.leafLight} />
      <Circle cx={63} cy={86} r={6}   fill={C.leaf} />
      <Circle cx={59} cy={82} r={5}   fill={C.leafLight} />
      <Circle cx={38} cy={68} r={5.5} fill={C.leafLight} />
      <Circle cx={62} cy={68} r={5.5} fill={C.leafLight} />
      <Circle cx={42} cy={65} r={4}   fill={C.leafBright} />
      <Circle cx={58} cy={65} r={4}   fill={C.leafBright} />
      {/* top body */}
      <Circle cx={50} cy={43} r={13}  fill={C.leaf} />
      <Circle cx={43} cy={41} r={7}   fill={C.leafLight} />
      <Circle cx={57} cy={41} r={7}   fill={C.leafLight} />
      <Circle cx={50} cy={36} r={6}   fill={C.leafBright} />
      <Circle cx={46} cy={47} r={5}   fill={C.leafBright} opacity={0.7} />
      <Circle cx={54} cy={47} r={5}   fill={C.leafBright} opacity={0.7} />
      {/* face */}
      <Eye cx={45} cy={43} r={1.7} />
      <Eye cx={55} cy={43} r={1.7} />
      <Cheek cx={42} cy={47} r={1.6} />
      <Cheek cx={58} cy={47} r={1.6} />
      <Path d="M 46 49 Q 50 52 54 49" stroke={C.eye} strokeWidth={1} fill="none" strokeLinecap="round" />
    </G>
  );
}

function Full() {
  return (
    <G>
      {/* trunk barely visible */}
      <Rect x={48.5} y={48} width={3} height={52.5} fill={C.stem4} rx={1.5} />
      {/* lush layered bush */}
      <Circle cx={32} cy={75} r={8}   fill={C.bush1} />
      <Circle cx={68} cy={75} r={8}   fill={C.bush1} />
      <Circle cx={27} cy={60} r={9}   fill={C.bush2} />
      <Circle cx={73} cy={60} r={9}   fill={C.bush2} />
      <Circle cx={34} cy={50} r={10}  fill={C.bush3} />
      <Circle cx={66} cy={50} r={10}  fill={C.bush3} />
      <Circle cx={24} cy={45} r={8}   fill={C.bush2} />
      <Circle cx={76} cy={45} r={8}   fill={C.bush2} />
      <Circle cx={40} cy={37} r={10}  fill={C.bush4} />
      <Circle cx={60} cy={37} r={10}  fill={C.bush4} />
      <Circle cx={50} cy={45} r={16}  fill={C.bush3} />
      <Circle cx={50} cy={33} r={13}  fill={C.bush5} />
      <Circle cx={42} cy={42} r={7}   fill={C.bush5} opacity={0.55} />
      <Circle cx={58} cy={42} r={7}   fill={C.bush5} opacity={0.55} />
      {/* face */}
      <Eye cx={46} cy={42} r={1.7} />
      <Eye cx={54} cy={42} r={1.7} />
      <Cheek cx={43} cy={46} r={1.6} />
      <Cheek cx={57} cy={46} r={1.6} />
      <Path d="M 46 48 Q 50 51 54 48" stroke={C.eye} strokeWidth={1} fill="none" strokeLinecap="round" />
      {/* flower */}
      <Circle cx={50} cy={14} r={3.2} fill={C.flowerOuter} />
      <Circle cx={55} cy={18} r={3.2} fill={C.flowerOuter} />
      <Circle cx={45} cy={18} r={3.2} fill={C.flowerOuter} />
      <Circle cx={53} cy={23} r={3.2} fill={C.flowerOuter} />
      <Circle cx={47} cy={23} r={3.2} fill={C.flowerOuter} />
      <Circle cx={50} cy={19} r={2.6} fill={C.flowerInner} />
    </G>
  );
}

function Wilted() {
  // sad, drooping, yellowed version of stage 2/3 silhouette
  return (
    <G transform="rotate(10 50 100)">
      <Rect x={48} y={50} width={4} height={50.5} fill={C.wiltStem} rx={2} />
      {/* drooping leaves rotated downward */}
      <Ellipse cx={38} cy={75} rx={8}  ry={3}   fill={C.wiltLeaf}  transform="rotate( 55 38 75)" />
      <Ellipse cx={62} cy={82} rx={8}  ry={3}   fill={C.wiltLeafD} transform="rotate(-55 62 82)" />
      <Ellipse cx={40} cy={58} rx={7}  ry={2.5} fill={C.wiltLeaf}  transform="rotate( 60 40 58)" />
      <Ellipse cx={60} cy={62} rx={7}  ry={2.5} fill={C.wiltLeafD} transform="rotate(-60 60 62)" />
      {/* body */}
      <Circle cx={50} cy={46} r={11.5} fill={C.wiltLeaf} />
      <Circle cx={50} cy={46} r={9.5}  fill={C.wiltLeafD} opacity={0.35} />
      {/* sad closed eyes */}
      <Path d="M 43 46 Q 45 48 47 46" stroke={C.eye} strokeWidth={1} fill="none" strokeLinecap="round" />
      <Path d="M 53 46 Q 55 48 57 46" stroke={C.eye} strokeWidth={1} fill="none" strokeLinecap="round" />
      {/* frown */}
      <Path d="M 46 52 Q 50 50 54 52" stroke={C.eye} strokeWidth={1} fill="none" strokeLinecap="round" />
    </G>
  );
}
