import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useAppContext, Habit } from '../context/AppContext';
import { darkColors, lightColors } from '../theme/colors';
import {
  getTodayStr,
  calcGlobalMaxStreak,
  calcCompletedToday,
  calcLevel,
  isStreakBroken,
} from '../utils/helpers';
import HabitCard from '../components/HabitCard';
import AddHabitModal from '../components/AddHabitModal';
import DetailModal from '../components/DetailModal';
import ReportModal from '../components/ReportModal';
import MascotCard from '../components/MascotCard';

const TIME_GROUPS: { key: Habit['timeOfDay']; label: string; time: string }[] = [
  { key: 'morning',   label: 'Sabah',          time: '06:00 — 11:00' },
  { key: 'afternoon', label: 'Öğleden sonra',   time: '11:00 — 17:00' },
  { key: 'evening',   label: 'Akşam',           time: '17:00 — sonrası' },
  { key: 'anytime',   label: 'Esnek',           time: 'Her zaman' },
];

function ProgressRing({ pct, size = 92, stroke = 6, color, bg }: {
  pct: number; size?: number; stroke?: number; color: string; bg: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  return (
    <Svg width={size} height={size}>
      <Circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
      <Circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={off}
        rotation="-90"
        originX={size / 2}
        originY={size / 2}
      />
    </Svg>
  );
}

export default function DashboardScreen() {
  const ctx = useAppContext();
  const colors = ctx.theme === 'dark' ? darkColors : lightColors;
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  const today = getTodayStr();
  const streak = calcGlobalMaxStreak(ctx.habits);
  const streakBroke = isStreakBroken(ctx.habits);
  const yesterday = (() => {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  })();
  const shieldActive = streakBroke && ctx.lastFreezeUsedDate === yesterday;
  const completed  = calcCompletedToday(ctx.habits, today);
  const total      = ctx.habits.length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const { level }  = calcLevel(ctx.userXP);

  const dayName  = new Date().toLocaleDateString('tr-TR', { weekday: 'long' });
  const dateStr  = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
  const firstName = ctx.user?.displayName?.split(' ')[0] ?? null;

  const selectedHabit = ctx.habits.find(h => h.id === selectedHabitId) ?? null;

  function handleDelete(id: string) {
    Alert.alert('Alışkanlığı Sil', 'Bu alışkanlığı silmek istediğine emin misin?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => ctx.deleteHabit(id) },
    ]);
  }

  return (
    <SafeAreaView style={[s.root, { backgroundColor: colors.bgMain }]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View>
            <Text style={[s.dateLabel, { color: colors.textMuted }]}>
              {dayName} · {dateStr}
            </Text>
            <Text style={[s.greeting, { color: colors.textMain }]}>
              {firstName ? `Günaydın, ${firstName}.` : 'Günaydın.'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => ctx.setTheme(ctx.theme === 'dark' ? 'light' : 'dark')}
            style={[s.themeBtn, { backgroundColor: colors.bgContent, borderColor: colors.hairline }]}
          >
            <Text style={{ fontSize: 16 }}>{ctx.theme === 'dark' ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Ring progress hero ── */}
        <View style={[s.heroCard, { backgroundColor: colors.bgContent, borderColor: colors.hairline }]}>
          <View style={s.ringWrap}>
            <ProgressRing pct={percentage} color={colors.primary} bg={colors.bgPanel} />
            <View style={s.ringCenter}>
              <Text style={[s.ringNum, { color: colors.textMain, fontFamily: 'Georgia' }]}>
                {completed}
              </Text>
              <Text style={[s.ringDen, { color: colors.textMuted }]}>/ {total}</Text>
            </View>
          </View>
          <View style={s.heroText}>
            <Text style={[s.heroLine1, { color: colors.textSub }]}>
              {percentage === 100
                ? 'Mükemmel bir gün! 🌟'
                : percentage >= 50
                ? 'Güzel bir başlangıç.'
                : 'Henüz başlangıç — devam et.'}
            </Text>
            <Text style={[s.heroLine2, { color: colors.textMuted }]}>
              {total - completed} alışkanlık seni bekliyor.
            </Text>
            <View style={s.heroMeta}>
              <View style={[s.dot, { backgroundColor: colors.primary }]} />
              <Text style={[s.heroMetaText, { color: colors.textSub }]}>
                {streak} günlük akış
              </Text>
              <View style={[s.sep, { backgroundColor: colors.border }]} />
              <Text style={[s.heroMetaText, { color: colors.textSub }]}>
                Bu hafta · %{percentage}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Mascot card ── */}
        <View style={{ paddingHorizontal: 18, marginTop: 14 }}>
          <MascotCard
            percentage={percentage}
            streak={streak}
            streakBroken={streakBroke}
            shieldActive={shieldActive}
            freezeTokens={ctx.freezeTokens}
            mascotType={ctx.mascotType}
            level={level}
            colors={colors}
            onUseFreeze={ctx.useStreakFreeze}
          />
        </View>

        {/* ── Habit groups ── */}
        <View style={s.habitsSection}>
          {total === 0 ? (
            <TouchableOpacity
              onPress={() => setShowAddModal(true)}
              style={[s.emptyRow, { borderColor: colors.border }]}
            >
              <View style={[s.emptyPlus, { backgroundColor: colors.primarySoft }]}>
                <Text style={[s.emptyPlusText, { color: colors.primary }]}>+</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.emptyTitle, { color: colors.textMain }]}>
                  Yeni bir alışkanlık ekle
                </Text>
                <Text style={[s.emptySubtitle, { color: colors.textMuted }]}>
                  Küçük başla. Bir bardak su yeter.
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <>
              {TIME_GROUPS.map(group => {
                const items = ctx.habits.filter(h => h.timeOfDay === group.key);
                if (items.length === 0) return null;
                return (
                  <View key={group.key} style={s.group}>
                    <View style={s.groupHeader}>
                      <Text style={[s.groupLabel, { color: colors.textMain, fontFamily: 'Georgia' }]}>
                        {group.label}
                      </Text>
                      <Text style={[s.groupTime, { color: colors.textMuted }]}>
                        {group.time}
                      </Text>
                      <Text style={[s.groupCount, { color: colors.textMuted }]}>
                        {items.filter(h => {
                          const val = h.history[today];
                          if (h.type === 'boolean') return val === true;
                          return typeof val === 'number' && val >= h.target;
                        }).length}/{items.length}
                      </Text>
                    </View>
                    {items.map(habit => (
                      <HabitCard
                        key={habit.id}
                        habit={habit}
                        today={today}
                        colors={colors}
                        onToggle={() => ctx.toggleHabit(habit.id)}
                        onUpdate={amount => ctx.updateNumeric(habit.id, amount)}
                        onDelete={() => handleDelete(habit.id)}
                        onPress={() => setSelectedHabitId(habit.id)}
                      />
                    ))}
                  </View>
                );
              })}

              {/* Gentle add prompt */}
              <TouchableOpacity
                onPress={() => setShowAddModal(true)}
                style={[s.addPrompt, { borderColor: colors.border }]}
              >
                <View style={[s.emptyPlus, { backgroundColor: colors.primarySoft }]}>
                  <Text style={[s.emptyPlusText, { color: colors.primary }]}>+</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.emptyTitle, { color: colors.textMain }]}>
                    Yeni bir alışkanlık ekle
                  </Text>
                  <Text style={[s.emptySubtitle, { color: colors.textMuted }]}>
                    Küçük başla. Bir bardak su yeter.
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── FAB ── */}
      <TouchableOpacity
        onPress={() => setShowAddModal(true)}
        style={[s.fab, { backgroundColor: colors.textMain }]}
      >
        <Text style={[s.fabIcon, { color: colors.bgMain }]}>+</Text>
      </TouchableOpacity>

      {/* ── Modals ── */}
      <AddHabitModal
        visible={showAddModal}
        colors={colors}
        onClose={() => setShowAddModal(false)}
        onAdd={(name, color, timeOfDay, type, target, mascot) => {
          ctx.addHabit(name, color, timeOfDay, type, target, mascot);
          setShowAddModal(false);
        }}
      />

      {selectedHabit && (
        <DetailModal
          visible={!!selectedHabitId}
          habit={selectedHabit}
          colors={colors}
          onClose={() => setSelectedHabitId(null)}
        />
      )}

      {ctx.pendingReport && (
        <ReportModal
          visible
          habits={ctx.habits}
          periodPrefix={ctx.pendingReport.periodPrefix}
          title={ctx.pendingReport.title}
          colors={colors}
          onClose={ctx.clearPendingReport}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 22, paddingTop: 16, paddingBottom: 14,
  },
  dateLabel: { fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4 },
  greeting:  { fontSize: 30, letterSpacing: -0.8, lineHeight: 34 },
  themeBtn: {
    width: 38, height: 38, borderRadius: 99,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1,
  },

  // Ring hero
  heroCard: {
    marginHorizontal: 18,
    borderRadius: 28, borderWidth: 1,
    padding: 22,
    flexDirection: 'row', alignItems: 'center', gap: 18,
  },
  ringWrap: { position: 'relative' },
  ringCenter: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
  },
  ringNum: { fontSize: 26, lineHeight: 30 },
  ringDen: { fontSize: 10, letterSpacing: 0.4, marginTop: 2 },
  heroText: { flex: 1 },
  heroLine1: { fontSize: 14, lineHeight: 20, marginBottom: 4 },
  heroLine2: { fontSize: 12, marginBottom: 12 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 99 },
  sep: { width: 1, height: 10 },
  heroMetaText: { fontSize: 12 },

  // Habits
  habitsSection: { padding: '24px' as any, paddingHorizontal: 18, paddingTop: 24 },
  group: { marginBottom: 26 },
  groupHeader: {
    flexDirection: 'row', alignItems: 'baseline',
    gap: 8, marginBottom: 10, paddingHorizontal: 4,
  },
  groupLabel: { fontSize: 19, letterSpacing: -0.3, flex: 0 },
  groupTime:  { fontSize: 11, letterSpacing: 0.3, flex: 1 },
  groupCount: { fontSize: 11 },

  // Empty / add prompt
  emptyRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 16, borderRadius: 22,
    borderWidth: 1, borderStyle: 'dashed',
  },
  addPrompt: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 16, borderRadius: 22,
    borderWidth: 1, borderStyle: 'dashed',
    marginTop: 8,
  },
  emptyPlus: {
    width: 34, height: 34, borderRadius: 99,
    justifyContent: 'center', alignItems: 'center',
  },
  emptyPlusText: { fontSize: 22, lineHeight: 26, fontWeight: '300' },
  emptyTitle:    { fontSize: 13 },
  emptySubtitle: { fontSize: 11, marginTop: 2 },

  // FAB
  fab: {
    position: 'absolute', bottom: 28, right: 24,
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18, shadowRadius: 10,
    elevation: 6,
  },
  fabIcon: { fontSize: 30, fontWeight: '300', lineHeight: 34 },
});
