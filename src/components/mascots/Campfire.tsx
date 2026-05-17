// src/components/mascots/Campfire.tsx
// Habit-companion mascot. 6 stages (-1 embers through 4 bonfire).
// Renders with react-native-svg + Animated (no Lottie required).
//
// Install once:
//   npx expo install react-native-svg
//
// Usage:
//   <Campfire stage={3} size={120} animate />

import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, {
  Circle, Ellipse, Rect, G, Path,
} from 'react-native-svg';

const AnimatedG    = Animated.createAnimatedComponent(G);
const AnimatedView = Animated.View;

export interface CampfireProps {
  /** -1 embers · 0 cold · 1 small · 2 medium · 3 large · 4 bonfire */
  stage: -1 | 0 | 1 | 2 | 3 | 4;
  /** width in px — height renders at size * 1.2 */
  size?: number;
  animate?: boolean;
}

const C = {
  // logs
  logActive:  '#5d3a1a',
  logActiveL: '#6d4c2a',
  logEmber:   '#3e1f00',
  logEmberL:  '#4a2800',

  // ash
  ash1: '#78909c',
  ash2: '#b0bec5',

  // embers
  emberDot:    '#e84000',
  emberDark:   '#cc3300',
  emberBright: '#ffd700',

  // flames
  flameOut:  '#ff6b35',
  flameMid:  '#ff8c42',
  flameInD:  '#ff4500',
  flameIn:   '#ffd93d',
  flameTip:  '#ffee00',

  // glow / sparks
  glow:   '#ff6b35',
  spark1: '#ffd93d',
  spark2: '#ff8c42',
  spark3: '#ffee00',
  spark4: '#ffa726',

  // face
  eye:   '#2a2520',
  cheek: '#ffb3a0',
};

// Teardrop flame path — pointed top, rounded bottom.
function flame(cx: number, baseY: number, w: number, h: number): string {
  const top = baseY - h;
  return (
    `M ${cx} ${baseY}` +
    ` C ${cx - w} ${baseY} ${cx - w * 0.85} ${baseY - h * 0.45} ${cx - w * 0.4} ${baseY - h * 0.78}` +
    ` Q ${cx - w * 0.1} ${top + h * 0.08} ${cx} ${top}` +
    ` Q ${cx + w * 0.1} ${top + h * 0.08} ${cx + w * 0.4} ${baseY - h * 0.78}` +
    ` C ${cx + w * 0.85} ${baseY - h * 0.45} ${cx + w} ${baseY} ${cx} ${baseY}` +
    ` Z`
  );
}

export default function Campfire({ stage, size = 120, animate = true }: CampfireProps) {
  const flick = useRef(new Animated.Value(0)).current;
  const glow  = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) return;
    if (stage === -1) {
      Animated.sequence([
        Animated.timing(shake, { toValue: 1,  duration: 80, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 80, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 1,  duration: 80, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 80, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0,  duration: 80, useNativeDriver: true }),
      ]).start();
      return;
    }
    if (stage <= 0) return; // no fire to animate

    const flicker = Animated.loop(
      Animated.sequence([
        Animated.timing(flick, { toValue: 0.65, duration: 200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(flick, { toValue: 1,    duration: 200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(flick, { toValue: 0.85, duration: 200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(flick, { toValue: 1,    duration: 200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    const glowing = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    flicker.start();
    glowing.start();
    return () => { flicker.stop(); glowing.stop(); };
  }, [animate, flick, glow, shake, stage]);

  const translateX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-3, 3] });

  // glow opacity range scales with stage
  const glowMax = stage === 4 ? 0.55 : stage === 3 ? 0.45 : 0.35;
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [glowMax - 0.2, glowMax] });

  return (
    <Animated.View style={{ width: size, height: size * 1.2, transform: [{ translateX }] }}>
      {/* Glow halo — sits behind the SVG, opacity loops independently */}
      {stage >= 2 && (
        <AnimatedView
          pointerEvents="none"
          style={{
            position: 'absolute',
            left:   size * 0.18,
            top:    size * (95 / 120) - size * 0.18,
            width:  size * 0.64,
            height: size * 0.36,
            borderRadius: size * 0.32,
            backgroundColor: C.glow,
            opacity: glowOpacity,
          }}
        />
      )}

      <Svg width={size} height={size * 1.2} viewBox="0 0 100 120">
        {/* ground shadow */}
        <Ellipse cx={50} cy={113} rx={36} ry={3.5} fill="#2a2520" opacity={0.18} />

        {stage === -1 && <Embers />}
        {stage === 0  && <Cold />}
        {stage >= 1   && (
          <>
            <Logs active />
            <AnimatedG style={{ opacity: stage >= 1 ? flick : 1 } as any}>
              {stage === 1 && <FireSmall />}
              {stage === 2 && <FireMedium />}
              {stage === 3 && <FireLarge />}
              {stage === 4 && <FireBonfire />}
            </AnimatedG>
            {stage === 4 && <Sparks />}
          </>
        )}
      </Svg>
    </Animated.View>
  );
}

// ─── primitives ────────────────────────────────────────────
function Logs({ active = true }: { active?: boolean }) {
  const log  = active ? C.logActive  : C.logEmber;
  const logL = active ? C.logActiveL : C.logEmberL;
  return (
    <G>
      {/* back log */}
      <G transform="translate(50 107) rotate(-12)">
        <Rect x={-26} y={-3} width={52} height={6} rx={3} fill={log} />
        <Ellipse cx={-24} cy={0} rx={1.5} ry={2} fill={logL} />
        <Ellipse cx={ 24} cy={0} rx={1.5} ry={2} fill={logL} />
      </G>
      {/* front log */}
      <G transform="translate(50 102) rotate(12)">
        <Rect x={-26} y={-3} width={52} height={6} rx={3} fill={log} />
        <Ellipse cx={-24} cy={0} rx={1.5} ry={2} fill={logL} />
        <Ellipse cx={ 24} cy={0} rx={1.5} ry={2} fill={logL} />
      </G>
    </G>
  );
}

function Eye({ cx, cy, r = 1.5 }: { cx: number; cy: number; r?: number }) {
  return <Circle cx={cx} cy={cy} r={r} fill={C.eye} />;
}
function Cheek({ cx, cy, r = 1.3 }: { cx: number; cy: number; r?: number }) {
  return <Circle cx={cx} cy={cy} r={r} fill={C.cheek} opacity={0.7} />;
}

// ─── stages ────────────────────────────────────────────────
function Embers() {
  return (
    <G>
      <Logs active={false} />
      {/* glowing ember dots between logs */}
      <Circle cx={42} cy={103} r={2.2} fill={C.emberDot} />
      <Circle cx={42} cy={103} r={1}   fill={C.emberBright} />
      <Circle cx={52} cy={100} r={2.4} fill={C.emberDot} />
      <Circle cx={52} cy={100} r={1.2} fill={C.emberBright} />
      <Circle cx={59} cy={104} r={2}   fill={C.emberDark} />
      <Circle cx={59} cy={104} r={0.9} fill={C.emberBright} />
    </G>
  );
}

function Cold() {
  return (
    <G>
      <Logs active={true} />
      {/* ash mound */}
      <Ellipse cx={50} cy={98}  rx={16} ry={4}   fill={C.ash1} />
      <Ellipse cx={50} cy={95}  rx={11} ry={2.8} fill={C.ash2} />
      <Ellipse cx={46} cy={94}  rx={3}  ry={1.2} fill={C.ash2} opacity={0.7} />
      <Ellipse cx={54} cy={94}  rx={3}  ry={1.2} fill={C.ash2} opacity={0.7} />
    </G>
  );
}

function FireSmall() {
  return (
    <G>
      <Path d={flame(50, 96, 6,   22)} fill={C.flameOut} />
      <Path d={flame(50, 96, 3.2, 14)} fill={C.flameIn} />
    </G>
  );
}

function FireMedium() {
  return (
    <G>
      {/* left + right small */}
      <Path d={flame(42, 96, 5, 20)} fill={C.flameOut} />
      <Path d={flame(42, 96, 2.5, 12)} fill={C.flameIn} />
      <Path d={flame(58, 96, 5, 24)} fill={C.flameOut} />
      <Path d={flame(58, 96, 2.5, 15)} fill={C.flameIn} />
      {/* center tall */}
      <Path d={flame(50, 96, 8,   38)} fill={C.flameOut} />
      <Path d={flame(50, 96, 5,   28)} fill={C.flameMid} />
      <Path d={flame(50, 96, 2.7, 20)} fill={C.flameIn} />
      {/* face on center flame */}
      <Eye cx={47} cy={78} />
      <Eye cx={53} cy={78} />
      <Cheek cx={45} cy={81} />
      <Cheek cx={55} cy={81} />
      <Ellipse cx={50} cy={83} rx={2} ry={0.8} fill={C.eye} />
    </G>
  );
}

function FireLarge() {
  return (
    <G>
      {/* outer pair short */}
      <Path d={flame(36, 96, 4, 16)} fill={C.flameInD} />
      <Path d={flame(36, 96, 2, 11)} fill={C.flameIn} />
      <Path d={flame(64, 96, 4, 18)} fill={C.flameInD} />
      <Path d={flame(64, 96, 2, 12)} fill={C.flameIn} />
      {/* inner pair medium */}
      <Path d={flame(44, 96, 5,   32)} fill={C.flameOut} />
      <Path d={flame(44, 96, 3,   23)} fill={C.flameIn} />
      <Path d={flame(56, 96, 5,   34)} fill={C.flameOut} />
      <Path d={flame(56, 96, 3,   25)} fill={C.flameIn} />
      {/* center tallest */}
      <Path d={flame(50, 96, 9,   54)} fill={C.flameInD} />
      <Path d={flame(50, 96, 6.2, 42)} fill={C.flameOut} />
      <Path d={flame(50, 96, 4,   32)} fill={C.flameMid} />
      <Path d={flame(50, 96, 2.2, 22)} fill={C.flameTip} />
      {/* face */}
      <Eye cx={47} cy={70} r={1.7} />
      <Eye cx={53} cy={70} r={1.7} />
      <Cheek cx={44} cy={74} r={1.6} />
      <Cheek cx={56} cy={74} r={1.6} />
      <Ellipse cx={50} cy={76} rx={2.5} ry={1} fill={C.eye} />
    </G>
  );
}

function FireBonfire() {
  return (
    <G>
      <Path d={flame(32, 96, 4, 20)} fill={C.flameInD} />
      <Path d={flame(32, 96, 2, 13)} fill={C.flameIn} />
      <Path d={flame(68, 96, 4, 22)} fill={C.flameInD} />
      <Path d={flame(68, 96, 2, 14)} fill={C.flameIn} />
      <Path d={flame(40, 96, 5,   36)} fill={C.flameInD} />
      <Path d={flame(40, 96, 3,   27)} fill={C.flameIn} />
      <Path d={flame(60, 96, 5,   40)} fill={C.flameInD} />
      <Path d={flame(60, 96, 3,   31)} fill={C.flameIn} />
      <Path d={flame(46, 96, 6,   52)} fill={C.flameOut} />
      <Path d={flame(46, 96, 4,   40)} fill={C.flameMid} />
      <Path d={flame(54, 96, 6,   56)} fill={C.flameOut} />
      <Path d={flame(54, 96, 4,   44)} fill={C.flameMid} />
      <Path d={flame(50, 96, 10,  72)} fill={C.flameInD} />
      <Path d={flame(50, 96, 7,   60)} fill={C.flameOut} />
      <Path d={flame(50, 96, 4.5, 46)} fill={C.flameIn} />
      <Path d={flame(50, 96, 2.5, 32)} fill={C.flameTip} />
      {/* big face */}
      <Eye cx={47} cy={62} r={1.9} />
      <Eye cx={53} cy={62} r={1.9} />
      <Cheek cx={43} cy={67} r={1.8} />
      <Cheek cx={57} cy={67} r={1.8} />
      <Ellipse cx={50} cy={70} rx={3} ry={1.2} fill={C.eye} />
    </G>
  );
}

function Sparks() {
  return (
    <G>
      <Circle cx={30} cy={22} r={1}   fill={C.spark1} />
      <Circle cx={42} cy={14} r={0.8} fill={C.spark3} />
      <Circle cx={58} cy={18} r={1}   fill={C.spark2} />
      <Circle cx={68} cy={26} r={0.8} fill={C.spark4} />
      <Circle cx={50} cy={10} r={1.2} fill={C.spark3} />
      <Circle cx={36} cy={32} r={0.7} fill={C.spark2} />
      <Circle cx={64} cy={36} r={0.8} fill={C.spark1} />
      <Circle cx={26} cy={38} r={0.6} fill={C.spark4} />
      <Circle cx={74} cy={42} r={0.7} fill={C.spark1} />
    </G>
  );
}
