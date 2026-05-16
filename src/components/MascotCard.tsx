import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../theme/colors';

interface Props {
  percentage: number; // 0–100 daily completion
  streak: number;     // current streak days
  level: number;      // XP level
  colors: Colors;
}

// ── Mascot state derivations ──────────────────────────────────────────────────

function getPlant(level: number) {
  if (level <= 2)  return { emoji: '🌱', name: 'Filiz' };
  if (level <= 5)  return { emoji: '🌿', name: 'Fide' };
  if (level <= 9)  return { emoji: '🪴', name: 'Saksı Bitkisi' };
  if (level <= 14) return { emoji: '🌲', name: 'Çam' };
  return                  { emoji: '🌳', name: 'Büyük Ağaç' };
}

function getFire(streak: number) {
  if (streak === 0)  return { emoji: '🕯️',      label: null };
  if (streak <= 2)   return { emoji: '🔥',       label: null };
  if (streak <= 6)   return { emoji: '🔥🔥',     label: `${streak} günlük seri!` };
  if (streak <= 13)  return { emoji: '🔥🔥🔥',   label: `${streak} günlük seri! 🌟` };
  return                    { emoji: '✨🔥✨',    label: `${streak} günlük EFSANE seri! 👑` };
}

function getFace(percentage: number) {
  if (percentage === 0)   return '😴';
  if (percentage <= 25)   return '😟';
  if (percentage <= 50)   return '😐';
  if (percentage <= 75)   return '😊';
  if (percentage < 100)   return '😄';
  return '🤩';
}

function getMoodMessage(percentage: number, streak: number): string {
  if (percentage === 100) return 'MÜKEMMEL! Bugün her şeyi tamamladın! 🎉';
  if (percentage >= 75)   return 'Son adım kaldı, bırakma! 🚀';
  if (percentage >= 50)   return 'Harika ilerliyorsun! 🌟';
  if (percentage >= 25)   return 'Güzel başladın, devam et! 💪';
  if (percentage > 0)     return 'Az kaldı, motive ol! 🙌';
  if (streak > 0)         return `${streak} günlük serin var, uyanma! 😤`;
  return 'Henüz başlamadın... Hadi uyan! ☀️';
}

function getMoodColor(percentage: number, colors: Colors): string {
  if (percentage === 100) return colors.success;
  if (percentage >= 50)   return colors.accent;
  if (percentage >= 25)   return '#f59e0b';
  return colors.textMuted;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MascotCard({ percentage, streak, level, colors }: Props) {
  const floatAnim  = useRef(new Animated.Value(0)).current;
  const pulseAnim  = useRef(new Animated.Value(1)).current;
  const glowAnim   = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // Plant gently floats up and down
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -7, duration: 1400, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0,  duration: 1400, useNativeDriver: true }),
      ]),
    ).start();

    // Fire pulses in size
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 700, useNativeDriver: true }),
      ]),
    ).start();

    // Fire glow opacity
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1,   duration: 700, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const plant = getPlant(level);
  const fire  = getFire(streak);
  const face  = getFace(percentage);
  const mood  = getMoodMessage(percentage, streak);
  const moodColor = getMoodColor(percentage, colors);

  return (
    <View style={[s.card, { backgroundColor: colors.bgContent, borderColor: colors.border }]}>

      {/* ── Mascot scene ── */}
      <View style={s.scene}>
        {/* Plant + face */}
        <Animated.View style={[s.plantGroup, { transform: [{ translateY: floatAnim }] }]}>
          <Text style={s.plantEmoji}>{plant.emoji}</Text>
          <Text style={s.faceEmoji}>{face}</Text>
        </Animated.View>

        {/* Campfire */}
        <View style={s.fireColumn}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Text style={s.fireEmoji}>{fire.emoji}</Text>
          </Animated.View>
          {/* Glow ring under fire */}
          <Animated.View
            style={[
              s.fireGlow,
              {
                backgroundColor: streak > 0 ? '#f97316' : '#94a3b8',
                opacity: streak > 0 ? glowAnim : 0.2,
              },
            ]}
          />
        </View>
      </View>

      {/* ── Text panel ── */}
      <View style={s.info}>
        {/* Mood message */}
        <Text style={[s.moodText, { color: moodColor }]}>{mood}</Text>

        {/* Streak badge */}
        {fire.label && (
          <View style={[s.streakBadge, { backgroundColor: '#f9731620' }]}>
            <Text style={[s.streakBadgeText, { color: '#f97316' }]}>{fire.label}</Text>
          </View>
        )}

        {/* Plant stage */}
        <Text style={[s.stageText, { color: colors.textMuted }]}>
          {plant.name} · Seviye {level}
        </Text>

        {/* Daily progress bar */}
        <View style={[s.progressBg, { backgroundColor: colors.border }]}>
          <View
            style={[
              s.progressFill,
              {
                width: `${percentage}%` as any,
                backgroundColor: moodColor,
              },
            ]}
          />
        </View>
        <Text style={[s.progressLabel, { color: colors.textMuted }]}>
          Bugünkü ilerleme: %{percentage}
        </Text>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  card: {
    borderRadius: 22, borderWidth: 1,
    padding: 18, marginBottom: 16,
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },

  // Mascot scene
  scene: {
    width: 90, alignItems: 'center', justifyContent: 'flex-end',
    flexDirection: 'row', gap: 4,
  },
  plantGroup: { alignItems: 'center' },
  plantEmoji: { fontSize: 40, lineHeight: 44 },
  faceEmoji:  { fontSize: 22, marginTop: -4 },
  fireColumn: { alignItems: 'center', justifyContent: 'flex-end', gap: 0 },
  fireEmoji:  { fontSize: 28, lineHeight: 32 },
  fireGlow: {
    width: 28, height: 8, borderRadius: 14,
    marginTop: -2,
  },

  // Text panel
  info: { flex: 1, gap: 6 },
  moodText: {
    fontSize: 13, fontWeight: '700', lineHeight: 18,
  },
  streakBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 10,
  },
  streakBadgeText: { fontSize: 12, fontWeight: '700' },
  stageText: { fontSize: 11, fontWeight: '600' },
  progressBg: {
    height: 4, borderRadius: 2, overflow: 'hidden', marginTop: 2,
  },
  progressFill: { height: 4, borderRadius: 2 },
  progressLabel: { fontSize: 10 },
});
