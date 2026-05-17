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

export default function Plant({ stage, size = 80, animate = true }: Props) {
  const floatY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: -5, duration: 1800, useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animate]);

  const h = size * (VH / VW);

  return (
    <Animated.View style={{ width: size, height: h, transform: animate ? [{ translateY: floatY }] : [] }}>
      <Svg width={size} height={h} viewBox={`0 0 ${VW} ${VH}`}>

        {/* Soil — always shown */}
        <Ellipse cx={50} cy={110} rx={26} ry={8} fill="#4a2c0a" opacity={0.6} />

        {stage === -1 && (
          /* Wilted — yellowed drooping plant */
          <>
            <Path
              d="M50,108 C50,92 62,82 58,67 C55,54 63,47 57,37"
              stroke="#8a7025" strokeWidth={3} fill="none" strokeLinecap="round"
            />
            <Ellipse cx={38} cy={97} rx={12} ry={5} fill="#c8a020" opacity={0.85} transform="rotate(35, 38, 97)" />
            <Ellipse cx={61} cy={82} rx={11} ry={5} fill="#b89018" opacity={0.75} transform="rotate(-25, 61, 82)" />
            <Ellipse cx={51} cy={67} rx={10} ry={4.5} fill="#a07e14" opacity={0.65} transform="rotate(15, 51, 67)" />
          </>
        )}

        {stage === 0 && (
          /* Dormant seed */
          <>
            <Ellipse cx={50} cy={104} rx={5.5} ry={4} fill="#6b3a1a" />
            <Ellipse cx={50} cy={103} rx={2.5} ry={1.8} fill="#8a5230" opacity={0.5} />
          </>
        )}

        {stage === 1 && (
          /* Sprout */
          <>
            <Rect x={48.5} y={78} width={3} height={30} rx={1.5} fill="#558b2f" />
            <Ellipse cx={39} cy={84} rx={10} ry={5.5} fill="#7cb342" transform="rotate(-28, 39, 84)" />
            <Ellipse cx={61} cy={84} rx={10} ry={5.5} fill="#7cb342" transform="rotate(28, 61, 84)" />
          </>
        )}

        {stage === 2 && (
          /* Young plant — two leaf pairs */
          <>
            <Rect x={48.5} y={58} width={3} height={50} rx={1.5} fill="#558b2f" />
            <Ellipse cx={37} cy={93} rx={12} ry={6} fill="#7cb342" transform="rotate(-25, 37, 93)" />
            <Ellipse cx={63} cy={93} rx={12} ry={6} fill="#7cb342" transform="rotate(25, 63, 93)" />
            <Ellipse cx={39} cy={73} rx={11} ry={5.5} fill="#8bc34a" transform="rotate(-30, 39, 73)" />
            <Ellipse cx={61} cy={73} rx={11} ry={5.5} fill="#8bc34a" transform="rotate(30, 61, 73)" />
          </>
        )}

        {stage === 3 && (
          /* Growing — branched with leaf clusters */
          <>
            <Rect x={48.5} y={46} width={3} height={62} rx={1.5} fill="#33691e" />
            <Path d="M50,76 L34,64" stroke="#558b2f" strokeWidth={2.5} strokeLinecap="round" />
            <Path d="M50,76 L66,64" stroke="#558b2f" strokeWidth={2.5} strokeLinecap="round" />
            <Circle cx={29} cy={60} r={13} fill="#7cb342" />
            <Circle cx={71} cy={60} r={13} fill="#8bc34a" />
            <Circle cx={50} cy={46} r={14} fill="#9ccc65" />
            <Ellipse cx={36} cy={91} rx={13} ry={6.5} fill="#7cb342" transform="rotate(-22, 36, 91)" />
            <Ellipse cx={64} cy={91} rx={13} ry={6.5} fill="#7cb342" transform="rotate(22, 64, 91)" />
          </>
        )}

        {stage === 4 && (
          /* Full plant — lush bush with flower */
          <>
            <Rect x={48.5} y={40} width={3} height={68} rx={1.5} fill="#1b5e20" />
            <Circle cx={50} cy={63} r={24} fill="#388e3c" />
            <Circle cx={32} cy={71} r={17} fill="#43a047" />
            <Circle cx={68} cy={71} r={17} fill="#4caf50" />
            <Circle cx={50} cy={52} r={19} fill="#66bb6a" />
            <Circle cx={50} cy={44} r={13} fill="#81c784" />
            {/* Flower */}
            <Circle cx={50} cy={35} r={7} fill="#f9a825" />
            <Circle cx={50} cy={35} r={4} fill="#ff8f00" />
            <Ellipse cx={34} cy={90} rx={14} ry={6.5} fill="#43a047" transform="rotate(-20, 34, 90)" />
            <Ellipse cx={66} cy={90} rx={14} ry={6.5} fill="#43a047" transform="rotate(20, 66, 90)" />
          </>
        )}

      </Svg>
    </Animated.View>
  );
}
