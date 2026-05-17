import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Ellipse, Rect, Circle, Path } from 'react-native-svg';
import { MascotStage } from '../../utils/helpers';

interface Props {
  stage: MascotStage;
  size?: number;
  animate?: boolean;
}

const VW = 100;
const VH = 120;

// Teardrop flame: base at (cx, cy), rising to (cx, cy-h), half-width w
function flame(cx: number, cy: number, w: number, h: number, color: string, opacity = 1) {
  const d = `M ${cx},${cy} Q ${cx + w * 0.8},${cy - h * 0.35} ${cx},${cy - h} Q ${cx - w * 0.8},${cy - h * 0.35} ${cx},${cy} Z`;
  return <Path key={`${cx}-${cy}-${h}`} d={d} fill={color} opacity={opacity} />;
}

export default function Campfire({ stage, size = 80, animate = true }: Props) {
  const flickerAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animate || stage <= 0) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(flickerAnim, { toValue: 0.65, duration: 380, useNativeDriver: true }),
        Animated.timing(flickerAnim, { toValue: 1.0,  duration: 280, useNativeDriver: true }),
        Animated.timing(flickerAnim, { toValue: 0.8,  duration: 230, useNativeDriver: true }),
        Animated.timing(flickerAnim, { toValue: 1.0,  duration: 380, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animate, stage]);

  const h = size * (VH / VW);

  return (
    <Animated.View style={{ width: size, height: h, opacity: animate && stage > 0 ? flickerAnim : 1 }}>
      <Svg width={size} height={h} viewBox={`0 0 ${VW} ${VH}`}>

        {stage === -1 && (
          /* Embers — dark logs, glowing dots, no flame */
          <>
            <Rect x={32} y={97} width={38} height={10} rx={5} fill="#3e1f00" transform="rotate(18, 51, 102)" />
            <Rect x={30} y={97} width={38} height={10} rx={5} fill="#4a2800" transform="rotate(-18, 49, 102)" />
            <Ellipse cx={50} cy={101} rx={18} ry={6} fill="#cc3300" opacity={0.3} />
            <Circle cx={42} cy={98} r={4}   fill="#e84000" />
            <Circle cx={52} cy={97} r={4.5} fill="#cc3300" />
            <Circle cx={60} cy={99} r={3.5} fill="#e84000" />
            <Circle cx={42} cy={98} r={1.8} fill="#ffd700" />
            <Circle cx={52} cy={97} r={2.2} fill="#ffd700" />
            <Circle cx={60} cy={99} r={1.5} fill="#ffb300" />
          </>
        )}

        {stage >= 0 && (
          /* Logs shared by stages 0-4 */
          <>
            <Rect x={32} y={97} width={38} height={10} rx={5} fill="#5d3a1a" transform="rotate(18, 51, 102)" />
            <Rect x={30} y={97} width={38} height={10} rx={5} fill="#6d4c2a" transform="rotate(-18, 49, 102)" />
          </>
        )}

        {stage === 0 && (
          /* Cold — ash pile only */
          <>
            <Ellipse cx={50} cy={101} rx={22} ry={7}  fill="#78909c" opacity={0.4} />
            <Ellipse cx={50} cy={101} rx={12} ry={4}  fill="#b0bec5" opacity={0.35} />
          </>
        )}

        {stage === 1 && (
          /* Small flame */
          <>
            <Ellipse cx={50} cy={100} rx={14} ry={5}  fill="#ff6b35" opacity={0.35} />
            {flame(50, 98, 8, 24, '#ff6b35')}
            {flame(50, 98, 6, 18, '#ffd93d')}
          </>
        )}

        {stage === 2 && (
          /* Medium fire */
          <>
            <Ellipse cx={50} cy={100} rx={20} ry={6}  fill="#ff6b35" opacity={0.45} />
            {flame(42, 98, 7, 26, '#ff8c42', 0.9)}
            {flame(58, 98, 7, 26, '#ff8c42', 0.9)}
            {flame(50, 98, 10, 36, '#ff6b35')}
            {flame(50, 98, 7,  26, '#ffd93d')}
          </>
        )}

        {stage === 3 && (
          /* Large fire */
          <>
            <Ellipse cx={50} cy={100} rx={27} ry={8}  fill="#ff4500" opacity={0.5} />
            {flame(38, 98, 8, 30, '#ff8c42', 0.8)}
            {flame(62, 98, 8, 30, '#ff8c42', 0.8)}
            {flame(44, 98, 9, 38, '#ff6b35', 0.95)}
            {flame(56, 98, 9, 38, '#ff6b35', 0.95)}
            {flame(50, 98, 12, 52, '#ff4500')}
            {flame(50, 98, 8,  40, '#ffd93d')}
          </>
        )}

        {stage === 4 && (
          /* Bonfire — max intensity with sparks */
          <>
            <Ellipse cx={50} cy={101} rx={34} ry={9}  fill="#ff4500" opacity={0.55} />
            {flame(35, 98, 9,  38, '#cc2200', 0.85)}
            {flame(65, 98, 9,  38, '#cc2200', 0.85)}
            {flame(42, 98, 10, 50, '#ff4500', 0.9)}
            {flame(58, 98, 10, 50, '#ff4500', 0.9)}
            {flame(47, 98, 11, 62, '#ff6b35')}
            {flame(53, 98, 11, 62, '#ff6b35')}
            {flame(50, 98, 14, 72, '#ff4500')}
            {flame(50, 98, 9,  58, '#ffd93d')}
            {flame(50, 98, 5,  44, '#ffee00')}
            {/* Sparks */}
            <Circle cx={36} cy={42} r={2.5} fill="#ffd93d" opacity={0.9} />
            <Circle cx={63} cy={32} r={2}   fill="#ff8c42" opacity={0.8} />
            <Circle cx={50} cy={25} r={3}   fill="#ffee00" opacity={0.85} />
            <Circle cx={42} cy={36} r={1.8} fill="#ffa726" opacity={0.7} />
            <Circle cx={60} cy={48} r={2.2} fill="#ff6b35" opacity={0.75} />
          </>
        )}

      </Svg>
    </Animated.View>
  );
}
