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
  if (streak === 0)  return 0;
  if (streak <= 2)   return 1;
  if (streak <= 6)   return 2;
  if (streak <= 13)  return 3;
  return 4;
}

function getMood(pct: number, streak: number, broken: boolean, shield: boolean): Mood {
  if (shield)                    return 'shielded';
  if (broken && streak === 0)    return 'furious';
  if (broken)                    return 'angry';
  if (pct === 100)               return 'celebrating';
  if (pct >= 75)                 return 'excited';
  if (pct >= 50)                 return 'happy';
  if (pct >= 25)                 return 'neutral';
  if (pct > 0)                   return 'worried';
  return 'sleeping';
}

const PLANT_MSG: Record<Mood, string> = {
  shielded:    'Bir gün geçti. Kökler sağlam kalıyor.',
  celebrating: 'Mükemmel. Düzen, zamanla güce dönüşür.',
  excited:     'Neredeyse tamamdın. Adım adım, gün gün.',
  happy:       'İyi ilerliyorsun. Kökler derinleşiyor.',
  neutral:     'Başladın. Bu, en önemli adımdı.',
  worried:     'Yavaş başlamak, başlamamaktan iyidir.',
  sleeping:    'Henüz harekete geçmedin. Bugün hâlâ fırsat var.',
  angry:       'Bir gün kaçtı. Yarın telafi edilmeli.',
  furious:     'Seri kırıldı. Disiplin, sonuç değil alışkanlıktır.',
};

const CAMPFIRE_MSG: Record<Mood, string> = {
  shielded:    'ATEŞ DONDU! Bir günlük hak kullanıldı!',
  celebrating: 'YANIYORUZ! BUGÜN KİMSE DURDURAMAZ!',
  excited:     'NEREDEYSE BURDAYIZ! BIRAKMA ŞİMDİ!',
  happy:       'Ateş yanıyor! Körüklemeye devam!',
  neutral:     'Orta yoldasın. Ateşi söndürme!',
  worried:     'Bu ateş sönmek üzere! Harekete geç!',
  sleeping:    'UYKU VAKTİ DEĞİL! ATEŞ SÖNÜYOR!',
  angry:       'SERİ GİTTİ! KABUL EDİLEMEZ!',
  furious:     'SAVAŞ BİTMEDİ! ATEŞI TEKRAR YAK!',
};

const PLANT_LABEL: Record<Mood, string> = {
  shielded: 'Dost · korunuyor', celebrating: 'Dost · çiçekleniyor',
  excited: 'Dost · büyüyor', happy: 'Dost · büyüyor',
  neutral: 'Dost · büyüyor', worried: 'Dost · solmak üzere',
  sleeping: 'Dost · uyuyor', angry: 'Dost · solgun', furious: 'Dost · solgun',
};

const FIRE_LABEL: Record<Mood, string> = {
  shielded: 'Dost · korunuyor', celebrating: 'Dost · coşkulu',
  excited: 'Dost · alevleniyor', happy: 'Dost · güzel yanıyor',
  neutral: 'Dost · yanıyor', worried: 'Dost · sönmek üzere',
  sleeping: 'Dost · köze dönüyor', angry: 'Dost · köz', furious: 'Dost · köz',
};

// ── Component ─────────────────────────────────────────────────────────────────

const FIRE_BG     = '#251D17';
const FIRE_BORDER = '#3A2F25';
const FIRE_TEXT   = '#FBF7EF';
const FIRE_MUTED  = '#9A8F80';
const FIRE_ACCENT = '#E08456';
const FIRE_TRACK  = '#3A2F25';

export default function MascotCard({
  percentage, streak, level, streakBroken, shieldActive,
  freezeTokens, mascotType, colors, onUseFreeze,
}: Props) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const mood    = getMood(percentage, streak, streakBroken, shieldActive);
  const isAngry = mood === 'angry' || mood === 'furious';
  const isFire  = mascotType === 'campfire';

  useEffect(() => {
    floatAnim.stopAnimation();
    shakeAnim.stopAnimation();
    if (isAngry) {
      Animated.loop(Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 5,  duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -5, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 3,  duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -3, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0,  duration: 100, useNativeDriver: true }),
        Animated.delay(1200),
      ])).start();
    } else {
      Animated.loop(Animated.sequence([
        Animated.timing(floatAnim, { toValue: -5, duration: 1800, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0,  duration: 1800, useNativeDriver: true }),
      ])).start();
    }
  }, [isAngry, mascotType]);

  const stage     = globalStage(streak, streakBroken, shieldActive);
  const moodMsg   = (isFire ? CAMPFIRE_MSG : PLANT_MSG)[mood];
  const moodLabel = (isFire ? FIRE_LABEL : PLANT_LABEL)[mood];
  const showFreeze = streakBroken && !shieldActive && freezeTokens > 0;

  // streak progress bar: stage 0-4 → 0–100%
  const stageBarPct = Math.min(Math.max(stage, 0), 4) * 25;

  const mascotTransform = isAngry
    ? [{ translateX: shakeAnim }]
    : [{ translateY: floatAnim }];

  // ── Campfire card (dark) ──
  if (isFire) {
    return (
      <View style={[s.card, { backgroundColor: FIRE_BG, borderColor: FIRE_BORDER }]}>
        {/* warm radial glow behind mascot */}
        <View style={s.fireGlowBg} pointerEvents="none" />
        <View style={s.mascotSide}>
          <Animated.View style={{ transform: mascotTransform }}>
            <Campfire stage={stage} size={110} animate />
          </Animated.View>
        </View>
        <View style={s.infoSide}>
          <Text style={[s.typeLabel, { color: FIRE_MUTED }]}>{moodLabel}</Text>
          <Text style={[s.moodMsg, { color: FIRE_TEXT }]}>{moodMsg}</Text>
          <View style={s.metaRow}>
            <Text style={[s.metaVal, { color: FIRE_ACCENT, fontFamily: 'Georgia' }]}>
              {streak} gün
            </Text>
            <View style={[s.metaSep, { backgroundColor: FIRE_BORDER }]} />
            <Text style={[s.metaHint, { color: FIRE_MUTED }]}>köz tutmaya devam</Text>
          </View>
          <View style={[s.progressBg, { backgroundColor: FIRE_TRACK }]}>
            <View style={[s.progressFill, { width: `${stageBarPct}%` as any, backgroundColor: FIRE_ACCENT }]} />
          </View>
          {showFreeze && (
            <TouchableOpacity
              onPress={onUseFreeze}
              style={s.freezeBtn}
            >
              <Text style={[s.freezeText, { color: '#3b82f6' }]}>
                🛡️ Dondur ({freezeTokens} hak)
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // ── Plant card (light) ──
  return (
    <View style={[s.card, { backgroundColor: colors.bgContent, borderColor: colors.hairline }]}>
      {/* bottom gradient tint */}
      <View style={[s.plantGlowBg, { backgroundColor: colors.primarySoft }]} pointerEvents="none" />
      <View style={s.mascotSide}>
        <Animated.View style={{ transform: mascotTransform }}>
          <Plant stage={stage} size={110} animate />
        </Animated.View>
      </View>
      <View style={s.infoSide}>
        <Text style={[s.typeLabel, { color: colors.textMuted }]}>{moodLabel}</Text>
        <Text style={[s.moodMsg, { color: colors.textMain }]}>{moodMsg}</Text>
        <View style={s.metaRow}>
          <Text style={[s.metaVal, { color: colors.primary, fontFamily: 'Georgia' }]}>
            {streak} gün
          </Text>
          <View style={[s.metaSep, { backgroundColor: colors.border }]} />
          <Text style={[s.metaHint, { color: colors.textMuted }]}>
            {stage < 4
              ? `${(4 - stage) * 7} gün sonra çiçek`
              : 'Tam çiçeklenme!'
            }
          </Text>
        </View>
        <View style={[s.progressBg, { backgroundColor: colors.bgPanel }]}>
          <View style={[s.progressFill, { width: `${stageBarPct}%` as any, backgroundColor: colors.primary }]} />
        </View>
        {showFreeze && (
          <TouchableOpacity
            onPress={onUseFreeze}
            style={s.freezeBtn}
          >
            <Text style={[s.freezeText, { color: '#3b82f6' }]}>
              🛡️ Dondur ({freezeTokens} hak)
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 28, borderWidth: 1,
    flexDirection: 'row', alignItems: 'flex-end',
    padding: 16, gap: 14,
    overflow: 'hidden', marginBottom: 0,
  },
  fireGlowBg: {
    position: 'absolute', bottom: -40, left: '50%',
    width: 280, height: 200, borderRadius: 140,
    backgroundColor: 'transparent',
    // radial glow not possible without LinearGradient, kept minimal
  },
  plantGlowBg: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 80, opacity: 0.5,
  },
  mascotSide: { flexShrink: 0 },
  infoSide: { flex: 1, paddingBottom: 6, gap: 6 },
  typeLabel: { fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase' },
  moodMsg: { fontSize: 17, lineHeight: 22, fontFamily: 'Georgia' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaVal: { fontSize: 16 },
  metaSep: { width: 1, height: 12 },
  metaHint: { fontSize: 12 },
  progressBg: { height: 4, borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 99 },
  freezeBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: 'rgba(59,130,246,0.12)',
    borderRadius: 12,
  },
  freezeText: { fontSize: 12, fontWeight: '700' },
});
