import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../theme/colors';

interface Props {
  percentage: number;
  streak: number;
  level: number;
  streakBroken: boolean;
  colors: Colors;
}

type Mood = 'celebrating' | 'excited' | 'happy' | 'neutral' | 'worried' | 'sleeping' | 'angry' | 'furious';

function getPlant(level: number) {
  if (level <= 2)  return { emoji: '🌱', name: 'Filiz' };
  if (level <= 5)  return { emoji: '🌿', name: 'Fide' };
  if (level <= 9)  return { emoji: '🪴', name: 'Saksı Bitkisi' };
  if (level <= 14) return { emoji: '🌲', name: 'Çam' };
  return                  { emoji: '🌳', name: 'Büyük Ağaç' };
}

function getFire(streak: number, streakBroken: boolean) {
  if (streakBroken) return { emoji: '💨',        label: 'Seri bitti... 😤' };
  if (streak === 0) return { emoji: '🕯️',        label: null };
  if (streak <= 2)  return { emoji: '🔥',         label: null };
  if (streak <= 6)  return { emoji: '🔥🔥',       label: `${streak} günlük seri!` };
  if (streak <= 13) return { emoji: '🔥🔥🔥',     label: `${streak} günlük seri! 🌟` };
  return                   { emoji: '✨🔥✨',      label: `${streak} günlük EFSANE seri! 👑` };
}

function getMood(percentage: number, streak: number, streakBroken: boolean): Mood {
  if (streakBroken && streak === 0) return streak === 0 ? 'furious' : 'angry';
  if (streakBroken) return 'angry';
  if (percentage === 100) return 'celebrating';
  if (percentage >= 75)   return 'excited';
  if (percentage >= 50)   return 'happy';
  if (percentage >= 25)   return 'neutral';
  if (percentage > 0)     return 'worried';
  return 'sleeping';
}

const MOOD_FACES: Record<Mood, string> = {
  celebrating: '🤩',
  excited:     '😄',
  happy:       '😊',
  neutral:     '😐',
  worried:     '😟',
  sleeping:    '😴',
  angry:       '😠',
  furious:     '🤬',
};

const MOOD_INDICATORS: Record<Mood, string | null> = {
  celebrating: '🎉',
  excited:     null,
  happy:       null,
  neutral:     null,
  worried:     null,
  sleeping:    '💤',
  angry:       '💢',
  furious:     '💢⚡',
};

function getMoodMessage(mood: Mood, percentage: number, streak: number): string {
  switch (mood) {
    case 'furious':     return 'SERİ BİTTİ! Bu nasıl oldu?! 🤬💢';
    case 'angry':       return `Dün kaçırdın! Seri gitti! 😠 Hadi toparlan!`;
    case 'sleeping':    return streak > 0 ? `${streak} günlük serin var, uyanma! 😤` : 'Henüz başlamadın... Hadi uyan! ☀️';
    case 'worried':     return 'Az kaldı, motive ol! 🙌';
    case 'neutral':     return 'Güzel başladın, devam et! 💪';
    case 'happy':       return 'Harika ilerliyorsun! 🌟';
    case 'excited':     return 'Son adım kaldı, bırakma! 🚀';
    case 'celebrating': return 'MÜKEMMEL! Bugün her şeyi tamamladın! 🎉';
  }
}

function getMoodColor(mood: Mood, colors: Colors): string {
  switch (mood) {
    case 'furious':     return '#ef4444';
    case 'angry':       return '#f97316';
    case 'sleeping':    return colors.textMuted;
    case 'worried':     return '#f59e0b';
    case 'neutral':     return colors.textMuted;
    case 'happy':       return colors.accent;
    case 'excited':     return colors.accent;
    case 'celebrating': return colors.success;
  }
}

function getMoodCardTint(mood: Mood): string {
  switch (mood) {
    case 'furious':  return 'rgba(239,68,68,0.08)';
    case 'angry':    return 'rgba(249,115,22,0.08)';
    case 'sleeping': return 'rgba(100,116,139,0.05)';
    default:         return 'transparent';
  }
}

export default function MascotCard({ percentage, streak, level, streakBroken, colors }: Props) {
  const floatAnim  = useRef(new Animated.Value(0)).current;
  const pulseAnim  = useRef(new Animated.Value(1)).current;
  const glowAnim   = useRef(new Animated.Value(0.6)).current;
  const shakeAnim  = useRef(new Animated.Value(0)).current;

  const mood = getMood(percentage, streak, streakBroken);
  const isAngry = mood === 'angry' || mood === 'furious';

  useEffect(() => {
    // Float: angry mascots vibrate instead of floating
    if (isAngry) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 5,  duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -5, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 3,  duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -3, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0,  duration: 120, useNativeDriver: true }),
          // pause
          Animated.delay(1200),
        ]),
      ).start();
    } else {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, { toValue: -7, duration: 1400, useNativeDriver: true }),
          Animated.timing(floatAnim, { toValue: 0,  duration: 1400, useNativeDriver: true }),
        ]),
      ).start();
    }

    // Fire pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 700, useNativeDriver: true }),
      ]),
    ).start();

    // Glow opacity
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1,   duration: 700, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, [isAngry]);

  const plant      = getPlant(level);
  const fire       = getFire(streak, streakBroken);
  const face       = MOOD_FACES[mood];
  const indicator  = MOOD_INDICATORS[mood];
  const moodMsg    = getMoodMessage(mood, percentage, streak);
  const moodColor  = getMoodColor(mood, colors);
  const cardTint   = getMoodCardTint(mood);

  const plantTransform = isAngry
    ? [{ translateX: shakeAnim }]
    : [{ translateY: floatAnim }];

  return (
    <View style={[
      s.card,
      { backgroundColor: colors.bgContent, borderColor: isAngry ? moodColor : colors.border },
      cardTint !== 'transparent' && { backgroundColor: cardTint },
    ]}>
      {/* ── Mascot scene ── */}
      <View style={s.scene}>
        <Animated.View style={[s.plantGroup, { transform: plantTransform }]}>
          {indicator && (
            <Text style={s.indicatorEmoji}>{indicator}</Text>
          )}
          <Text style={s.plantEmoji}>{plant.emoji}</Text>
          <Text style={s.faceEmoji}>{face}</Text>
        </Animated.View>

        <View style={s.fireColumn}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Text style={s.fireEmoji}>{fire.emoji}</Text>
          </Animated.View>
          <Animated.View
            style={[
              s.fireGlow,
              {
                backgroundColor: streakBroken ? '#64748b' : streak > 0 ? '#f97316' : '#94a3b8',
                opacity: streak > 0 && !streakBroken ? glowAnim : 0.2,
              },
            ]}
          />
        </View>
      </View>

      {/* ── Text panel ── */}
      <View style={s.info}>
        <Text style={[s.moodText, { color: moodColor }]}>{moodMsg}</Text>

        {fire.label && (
          <View style={[s.streakBadge, { backgroundColor: streakBroken ? '#ef444420' : '#f9731620' }]}>
            <Text style={[s.streakBadgeText, { color: streakBroken ? '#ef4444' : '#f97316' }]}>
              {fire.label}
            </Text>
          </View>
        )}

        <Text style={[s.stageText, { color: colors.textMuted }]}>
          {plant.name} · Seviye {level}
        </Text>

        <View style={[s.progressBg, { backgroundColor: colors.border }]}>
          <View
            style={[
              s.progressFill,
              { width: `${percentage}%` as any, backgroundColor: moodColor },
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

const s = StyleSheet.create({
  card: {
    borderRadius: 22, borderWidth: 1,
    padding: 18, marginBottom: 16,
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  scene: {
    width: 90, alignItems: 'center', justifyContent: 'flex-end',
    flexDirection: 'row', gap: 4,
  },
  plantGroup: { alignItems: 'center' },
  indicatorEmoji: { fontSize: 16, marginBottom: 2 },
  plantEmoji: { fontSize: 40, lineHeight: 44 },
  faceEmoji:  { fontSize: 22, marginTop: -4 },
  fireColumn: { alignItems: 'center', justifyContent: 'flex-end', gap: 0 },
  fireEmoji:  { fontSize: 28, lineHeight: 32 },
  fireGlow: {
    width: 28, height: 8, borderRadius: 14,
    marginTop: -2,
  },
  info: { flex: 1, gap: 6 },
  moodText: { fontSize: 13, fontWeight: '700', lineHeight: 18 },
  streakBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 10,
  },
  streakBadgeText: { fontSize: 12, fontWeight: '700' },
  stageText: { fontSize: 11, fontWeight: '600' },
  progressBg: { height: 4, borderRadius: 2, overflow: 'hidden', marginTop: 2 },
  progressFill: { height: 4, borderRadius: 2 },
  progressLabel: { fontSize: 10 },
});
