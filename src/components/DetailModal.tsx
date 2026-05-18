import React from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { Habit } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { getDateStr, isHabitDoneOnDate, calcMascotStage, calcHabitStreak } from '../utils/helpers';
import Plant from './mascots/Plant';
import Campfire from './mascots/Campfire';

interface Props {
  visible: boolean;
  habit: Habit;
  colors: Colors;
  onClose: () => void;
}

const DAY_ABBR = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];

export default function DetailModal({ visible, habit, colors, onClose }: Props) {
  // 35 days = 5 weeks
  const cells = Array.from({ length: 35 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    return { dateStr: getDateStr(d), done: isHabitDoneOnDate(habit, getDateStr(d)) };
  });

  // 30-day window for stats
  const last30 = cells.slice(5);
  const done30 = last30.filter(c => c.done).length;
  const pct30  = Math.round((done30 / 30) * 100);

  const streak  = calcHabitStreak(habit);
  const stage   = calcMascotStage(habit);
  const isFire  = (habit.mascot ?? 'plant') === 'fire';

  const totalDone = Object.values(habit.history).filter(v =>
    v === true || (typeof v === 'number' && v > 0)
  ).length;

  const stats = [
    { v: `${streak}`,   l: 'günlük akış',  sub: 'şu anki seri' },
    { v: `%${pct30}`,   l: 'son 30 gün',   sub: `${done30} / 30` },
    { v: `${totalDone}`,l: 'toplam',        sub: 'tüm zamanlar' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={[s.sheet, { backgroundColor: colors.bgContent }]}>
          {/* Handle */}
          <View style={[s.handle, { backgroundColor: colors.border }]} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Mascot hero */}
            <View style={s.mascotHero}>
              {isFire
                ? <Campfire stage={stage} size={130} animate />
                : <Plant    stage={stage} size={130} animate />}
            </View>

            {/* Title block */}
            <View style={s.titleBlock}>
              <View style={s.titleRow}>
                <View style={[s.habitDot, { backgroundColor: habit.color }]} />
                <Text style={[s.typeLabel, { color: colors.textMuted }]}>
                  {habit.type === 'numeric' ? 'sayarak' : 'günlük'}
                </Text>
              </View>
              <Text style={[s.title, { color: colors.textMain, fontFamily: 'Georgia' }]}>
                {habit.name}
              </Text>
            </View>

            {/* Stats strip */}
            <View style={[s.statsCard, { backgroundColor: colors.bgMain, borderColor: colors.hairline }]}>
              {stats.map((stat, i) => (
                <View
                  key={i}
                  style={[
                    s.statCell,
                    i > 0 && { borderLeftWidth: 1, borderLeftColor: colors.hairline },
                  ]}
                >
                  <Text style={[s.statVal, { color: colors.textMain, fontFamily: 'Georgia' }]}>
                    {stat.v}
                  </Text>
                  <Text style={[s.statLabel, { color: colors.textSub }]}>{stat.l}</Text>
                  <Text style={[s.statSub,   { color: colors.textMuted }]}>{stat.sub}</Text>
                </View>
              ))}
            </View>

            {/* 5-week heatmap */}
            <View style={[s.heatmapCard, { backgroundColor: colors.bgMain, borderColor: colors.hairline }]}>
              <View style={s.heatmapHeader}>
                <Text style={[s.heatmapTitle, { color: colors.textMain, fontFamily: 'Georgia' }]}>
                  Son 5 hafta
                </Text>
              </View>
              <View style={s.grid}>
                {cells.map((cell, i) => (
                  <View
                    key={i}
                    style={[
                      s.cell,
                      {
                        backgroundColor: cell.done ? habit.color : colors.bgPanel,
                        opacity: cell.done ? (0.45 + ((i % 4) * 0.18)) : 1,
                      },
                    ]}
                  />
                ))}
              </View>
              <View style={s.heatmapFooter}>
                <Text style={[s.dayRow, { color: colors.textMuted }]}>
                  {DAY_ABBR.join('  ')}
                </Text>
                <View style={s.legendRow}>
                  <Text style={[s.legendText, { color: colors.textMuted }]}>az</Text>
                  {[0.3, 0.55, 0.8, 1].map(o => (
                    <View
                      key={o}
                      style={[s.legendDot, { backgroundColor: habit.color, opacity: o }]}
                    />
                  ))}
                  <Text style={[s.legendText, { color: colors.textMuted }]}>çok</Text>
                </View>
              </View>
            </View>

            {/* Reflection note */}
            <View style={[s.reflectCard, { backgroundColor: colors.accentSoft }]}>
              <Text style={[s.reflectQuote, { color: colors.accent, fontFamily: 'Georgia' }]}>"</Text>
              <Text style={[s.reflectText, { color: colors.textMain, fontFamily: 'Georgia' }]}>
                {streak >= 7
                  ? `${streak} günlük serin var. Bu basit değil.`
                  : streak > 0
                  ? `${streak} günlük iyi bir başlangıç.`
                  : 'Bugün başlamak için iyi bir gün.'}
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[s.closeBtn, { backgroundColor: colors.textMain }]}
            onPress={onClose}
          >
            <Text style={[s.closeBtnText, { color: colors.bgMain }]}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 20, paddingBottom: 36,
    maxHeight: '92%',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    alignSelf: 'center', marginBottom: 16,
  },
  mascotHero: { alignItems: 'center', marginBottom: 8 },
  titleBlock: { paddingHorizontal: 4, marginBottom: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  habitDot: { width: 8, height: 8, borderRadius: 99 },
  typeLabel: { fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase' },
  title: { fontSize: 28, letterSpacing: -0.6, lineHeight: 32 },

  statsCard: {
    borderRadius: 24, borderWidth: 1,
    flexDirection: 'row', marginBottom: 14,
    paddingVertical: 18,
  },
  statCell: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  statVal:  { fontSize: 26, lineHeight: 30 },
  statLabel:{ fontSize: 11, letterSpacing: 0.3, marginTop: 6 },
  statSub:  { fontSize: 10, marginTop: 2 },

  heatmapCard: {
    borderRadius: 24, borderWidth: 1,
    padding: 18, marginBottom: 14,
  },
  heatmapHeader: { marginBottom: 14 },
  heatmapTitle: { fontSize: 17 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 5,
  },
  cell: { width: '12%', aspectRatio: 1, borderRadius: 6 },
  heatmapFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 10,
  },
  dayRow: { fontSize: 10, letterSpacing: 2 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendText: { fontSize: 10 },
  legendDot: { width: 10, height: 10, borderRadius: 3 },

  reflectCard: {
    borderRadius: 24, padding: 20, marginBottom: 16, position: 'relative',
  },
  reflectQuote: {
    position: 'absolute', top: 8, right: 16,
    fontSize: 50, opacity: 0.4, lineHeight: 56,
  },
  reflectText: { fontSize: 17, lineHeight: 24, paddingRight: 30 },

  closeBtn: {
    padding: 15, borderRadius: 16,
    alignItems: 'center', marginTop: 4,
  },
  closeBtnText: { fontSize: 15, fontWeight: '600' },
});
