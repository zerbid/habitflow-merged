import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { MascotType } from '../context/AppContext';

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

// ── Plant & Fire helpers ──────────────────────────────────────────────────────

function getPlant(level: number) {
  if (level <= 2)  return { emoji: '🌱', name: 'Filiz' };
  if (level <= 5)  return { emoji: '🌿', name: 'Fide' };
  if (level <= 9)  return { emoji: '🪴', name: 'Saksı Bitkisi' };
  if (level <= 14) return { emoji: '🌲', name: 'Çam' };
  return                  { emoji: '🌳', name: 'Büyük Ağaç' };
}

function getFire(streak: number, streakBroken: boolean, shieldActive: boolean) {
  if (shieldActive)  return { emoji: '🛡️🔥',     label: 'Streak koruması aktif!' };
  if (streakBroken)  return { emoji: '💨',         label: 'Seri söndü...' };
  if (streak === 0)  return { emoji: '🕯️',         label: null };
  if (streak <= 2)   return { emoji: '🔥',          label: null };
  if (streak <= 6)   return { emoji: '🔥🔥',        label: `${streak} günlük seri!` };
  if (streak <= 13)  return { emoji: '🔥🔥🔥',      label: `${streak} günlük seri! 🌟` };
  return                    { emoji: '✨🔥✨',       label: `${streak} günlük EFSANE seri! 👑` };
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

const MOOD_FACES: Record<Mood, string> = {
  shielded:    '😌',
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
  shielded:    '🛡️',
  celebrating: '🎉',
  excited:     null,
  happy:       null,
  neutral:     null,
  worried:     null,
  sleeping:    '💤',
  angry:       '💢',
  furious:     '💢⚡',
};

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
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim  = useRef(new Animated.Value(0.6)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const mood     = getMood(percentage, streak, streakBroken, shieldActive);
  const isAngry  = mood === 'angry' || mood === 'furious';
  const messages = mascotType === 'campfire' ? CAMPFIRE_MESSAGES : PLANT_MESSAGES;
  const pulseDuration = mascotType === 'campfire' ? 400 : 700;

  useEffect(() => {
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
          Animated.timing(floatAnim, { toValue: -7, duration: 1400, useNativeDriver: true }),
          Animated.timing(floatAnim, { toValue: 0,  duration: 1400, useNativeDriver: true }),
        ]),
      ).start();
    }

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: mascotType === 'campfire' ? 1.35 : 1.2, duration: pulseDuration, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: pulseDuration, useNativeDriver: true }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1,   duration: pulseDuration, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: pulseDuration, useNativeDriver: true }),
      ]),
    ).start();
  }, [isAngry, mascotType]);

  const plant      = getPlant(level);
  const fire       = getFire(streak, streakBroken, shieldActive);
  const face       = MOOD_FACES[mood];
  const indicator  = MOOD_INDICATORS[mood];
  const moodMsg    = messages[mood];
  const moodColor  = getMoodColor(mood, colors);
  const cardTint   = getCardTint(mood);
  const borderColor = (isAngry || mood === 'shielded') ? moodColor : colors.border;

  const plantTransform = isAngry
    ? [{ translateX: shakeAnim }]
    : [{ translateY: floatAnim }];

  const showFreezeBtn = streakBroken && !shieldActive && freezeTokens > 0;

  return (
    <View style={[
      s.card,
      { borderColor },
      cardTint !== 'transparent' && { backgroundColor: cardTint },
      cardTint === 'transparent' && { backgroundColor: colors.bgContent },
    ]}>
      {/* ── Scene ── */}
      <View style={s.scene}>
        <Animated.View style={[s.plantGroup, { transform: plantTransform }]}>
          {indicator && <Text style={s.indicatorEmoji}>{indicator}</Text>}
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
                backgroundColor: shieldActive ? '#3b82f6' : streakBroken ? '#64748b' : streak > 0 ? '#f97316' : '#94a3b8',
                opacity: (streak > 0 && !streakBroken) || shieldActive ? glowAnim : 0.2,
              },
            ]}
          />
        </View>
      </View>

      {/* ── Info ── */}
      <View style={s.info}>
        <Text style={[s.moodText, { color: moodColor }]}>{moodMsg}</Text>

        {fire.label && (
          <View style={[s.badge, { backgroundColor: shieldActive ? '#3b82f620' : streakBroken ? '#ef444420' : '#f9731620' }]}>
            <Text style={[s.badgeText, { color: shieldActive ? '#3b82f6' : streakBroken ? '#ef4444' : '#f97316' }]}>
              {fire.label}
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
          {plant.name} · Seviye {level}
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
    width: 90, alignItems: 'center', justifyContent: 'flex-end',
    flexDirection: 'row', gap: 4,
  },
  plantGroup: { alignItems: 'center' },
  indicatorEmoji: { fontSize: 16, marginBottom: 2 },
  plantEmoji: { fontSize: 40, lineHeight: 44 },
  faceEmoji:  { fontSize: 22, marginTop: -4 },
  fireColumn: { alignItems: 'center', justifyContent: 'flex-end' },
  fireEmoji:  { fontSize: 28, lineHeight: 32 },
  fireGlow: { width: 28, height: 8, borderRadius: 14, marginTop: -2 },
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
