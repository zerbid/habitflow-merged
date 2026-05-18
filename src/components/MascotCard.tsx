import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { MascotType } from '../context/AppContext';
import { MascotStage } from '../utils/helpers';
import Plant from './mascots/Plant';
import Campfire from './mascots/Campfire';

interface Props {
  percentage: number;
  streak: number;
  level: number;
  streakBroken: boolean;
  shieldActive: boolean;
  freezeTokens: number;
  mascotType: MascotType;
  colors: Colors;
  onUseFreeze: () => void;
}

type Mood = 'celebrating' | 'excited' | 'happy' | 'neutral' | 'worried' | 'sleeping' | 'angry' | 'furious' | 'shielded';

function globalStage(streak: number, streakBroken: boolean, shieldActive: boolean): MascotStage {
  if (streakBroken && !shieldActive) return -1;
  if (streak === 0) return 0;
  if (streak <= 2)  return 1;
  if (streak <= 6)  return 2;
  if (streak <= 13) return 3;
  return 4;
}

function getStreakBadge(streak: number, streakBroken: boolean, shieldActive: boolean): string | null {
  if (shieldActive)  return 'Streak koruması aktif!';
  if (streakBroken)  return 'Seri söndü...';
  if (streak <= 2)   return null;
  if (streak <= 6)   return `${streak} günlük seri!`;
  if (streak <= 13)  return `${streak} günlük seri! 🌟`;
  return `${streak} günlük EFSANE seri! 👑`;
}

// ── Mood derivation ───────────────────────────────────────────────────────────

function getMood(percentage: number, streak: number, streakBroken: boolean, shieldActive: boolean): Mood {
  if (shieldActive)              return 'shielded';
  if (streakBroken && streak === 0) return 'furious';
  if (streakBroken)              return 'angry';
  if (percentage === 100)        return 'celebrating';
  if (percentage >= 75)          return 'excited';
  if (percentage >= 50)          return 'happy';
  if (percentage >= 25)          return 'neutral';
  if (percentage > 0)            return 'worried';
  return 'sleeping';
}

// ── Personality messages ──────────────────────────────────────────────────────

const PLANT_MESSAGES: Record<Mood, string> = {
  shielded:    'Bir gün geçti. Kökler sağlam kalıyor. 🛡️🌿',
  celebrating: 'Mükemmel. Düzen, zamanla güce dönüşür. 🌳',
  excited:     'Neredeyse tamamdın. Adım adım, gün gün. 🌿',
  happy:       'İyi ilerliyorsun. Kökler derinleşiyor. 🌱',
  neutral:     'Başladın. Bu, en önemli adımdı.',
  worried:     'Yavaş başlamak, başlamamaktan iyidir. 🌱',
  sleeping:    'Henüz harekete geçmedin. Bugün hâlâ fırsat var.',
  angry:       'Bir gün kaçtı. Yarın telafi edilmeli. 🌿',
  furious:     'Seri kırıldı. Disiplin, sonuç değil alışkanlıktır.',
};

const CAMPFIRE_MESSAGES: Record<Mood, string> = {
  shielded:    'ATEŞ DONDU! Bir günlük hak kullanıldı! 🛡️🔥',
  celebrating: 'YANIYORUZ! BUGÜN KİMSE DURDURAMAZ! 🔥🔥🔥',
  excited:     'NEREDEYSE BURDAYIZ! BIRAKMA ŞİMDİ! 🔥',
  happy:       'Ateş yanıyor! Körüklemeye devam! 🔥',
  neutral:     'Orta yoldasın. Ateşi söndürme!',
  worried:     'Bu ateş sönmek üzere! Harekete geç! 😤',
  sleeping:    'UYKU VAKTİ DEĞİL! ATEŞ SÖNÜYOR! 😤',
  angry:       'SERİ GİTTİ! KABUL EDİLEMEZ! 💢🔥',
  furious:     'SAVAŞ BİTMEDİ! ATEŞI TEKRAR YAK! 🤬🔥',
};

// ── Color helpers ─────────────────────────────────────────────────────────────

function getMoodColor(mood: Mood, colors: Colors): string {
  switch (mood) {
    case 'shielded':    return '#3b82f6';
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

function getCardTint(mood: Mood): string {
  switch (mood) {
    case 'shielded': return 'rgba(59,130,246,0.07)';
    case 'furious':  return 'rgba(239,68,68,0.08)';
    case 'angry':    return 'rgba(249,115,22,0.08)';
    default:         return 'transparent';
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MascotCard({
  percentage, streak, level, streakBroken, shieldActive,
  freezeTokens, mascotType, colors, onUseFreeze,
}: Props) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const mood     = getMood(percentage, streak, streakBroken, shieldActive);
  const isAngry  = mood === 'angry' || mood === 'furious';
  const messages = mascotType === 'campfire' ? CAMPFIRE_MESSAGES : PLANT_MESSAGES;

  useEffect(() => {
    floatAnim.stopAnimation();
    shakeAnim.stopAnimation();

    if (isAngry) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 6,  duration: 55, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -6, duration: 55, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 4,  duration: 55, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -4, duration: 55, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0,  duration: 100, useNativeDriver: true }),
          Animated.delay(1000),
        ]),
      ).start();
    } else {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, { toValue: -6, duration: 1600, useNativeDriver: true }),
          Animated.timing(floatAnim, { toValue: 0,  duration: 1600, useNativeDriver: true }),
        ]),
      ).start();
    }
  }, [isAngry, mascotType]);

  const mascotTransform = isAngry
    ? [{ translateX: shakeAnim }]
    : [{ translateY: floatAnim }];

  const stage       = globalStage(streak, streakBroken, shieldActive);
  const streakBadge = getStreakBadge(streak, streakBroken, shieldActive);
  const moodMsg     = messages[mood];
  const moodColor   = getMoodColor(mood, colors);
  const cardTint    = getCardTint(mood);
  const borderColor = (isAngry || mood === 'shielded') ? moodColor : colors.border;
  const showFreezeBtn = streakBroken && !shieldActive && freezeTokens > 0;

  return (
    <View style={[
      s.card,
      { borderColor },
      cardTint !== 'transparent' && { backgroundColor: cardTint },
      cardTint === 'transparent' && { backgroundColor: colors.bgContent },
    ]}>
      {/* ── Mascot ── */}
      <View style={s.scene}>
        <Animated.View style={{ transform: mascotTransform }}>
          {mascotType === 'campfire'
            ? <Campfire stage={stage} size={90} animate />
            : <Plant    stage={stage} size={90} animate />}
        </Animated.View>
      </View>

      {/* ── Info ── */}
      <View style={s.info}>
        <Text style={[s.moodText, { color: moodColor }]}>{moodMsg}</Text>

        {streakBadge && (
          <View style={[s.badge, { backgroundColor: shieldActive ? '#3b82f620' : streakBroken ? '#ef444420' : '#f9731620' }]}>
            <Text style={[s.badgeText, { color: shieldActive ? '#3b82f6' : streakBroken ? '#ef4444' : '#f97316' }]}>
              {streakBadge}
            </Text>
          </View>
        )}

        {showFreezeBtn && (
          <TouchableOpacity
            style={[s.freezeBtn, { backgroundColor: '#3b82f620', borderColor: '#3b82f6' }]}
            onPress={onUseFreeze}
          >
            <Text style={[s.freezeBtnText, { color: '#3b82f6' }]}>
              🛡️ Dondur ({freezeTokens} hak)
            </Text>
          </TouchableOpacity>
        )}

        <Text style={[s.stageText, { color: colors.textMuted }]}>
          Seviye {level}
        </Text>

        <View style={[s.progressBg, { backgroundColor: colors.border }]}>
          <View style={[s.progressFill, { width: `${percentage}%` as any, backgroundColor: moodColor }]} />
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
  scene: {
    width: 90, alignItems: 'center', justifyContent: 'center',
  },
  info: { flex: 1, gap: 6 },
  moodText: { fontSize: 13, fontWeight: '700', lineHeight: 18 },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  freezeBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 12, borderWidth: 1,
  },
  freezeBtnText: { fontSize: 12, fontWeight: '700' },
  stageText: { fontSize: 11, fontWeight: '600' },
  progressBg: { height: 4, borderRadius: 2, overflow: 'hidden', marginTop: 2 },
  progressFill: { height: 4, borderRadius: 2 },
  progressLabel: { fontSize: 10 },
});
