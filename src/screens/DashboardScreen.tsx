import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext, Habit } from '../context/AppContext';
import { darkColors, lightColors, Colors } from '../theme/colors';
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

const { width } = Dimensions.get('window');

const TIME_GROUPS: { key: Habit['timeOfDay']; label: string; icon: string }[] = [
  { key: 'morning', label: 'Sabah Rutini', icon: '☀️' },
  { key: 'afternoon', label: 'Öğle Rutini', icon: '🌤' },
  { key: 'evening', label: 'Akşam Rutini', icon: '🌙' },
  { key: 'anytime', label: 'Esnek Görevler', icon: '🔄' },
];

export default function DashboardScreen() {
  const ctx = useAppContext();
  const colors = ctx.theme === 'dark' ? darkColors : lightColors;
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  const today = getTodayStr();
  const streak = calcGlobalMaxStreak(ctx.habits);
  const streakBroke = isStreakBroken(ctx.habits);
  const completed = calcCompletedToday(ctx.habits, today);
  const total = ctx.habits.length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const { level, currentXP } = calcLevel(ctx.userXP);

  const todayLabel = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  const selectedHabit = ctx.habits.find(h => h.id === selectedHabitId) ?? null;
  const s = makeStyles(colors);

  function handleDelete(id: string) {
    Alert.alert(
      'Alışkanlığı Sil',
      'Bu alışkanlığı silmek istediğine emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: () => ctx.deleteHabit(id) },
      ],
    );
  }

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.bgMain }]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View>
            <Text style={[s.greeting, { color: colors.textMuted }]}>
              {todayLabel}
            </Text>
            <Text style={[s.appName, { color: colors.textMain }]}>HabitFlow</Text>
          </View>
          <TouchableOpacity
            onPress={() => ctx.setTheme(ctx.theme === 'dark' ? 'light' : 'dark')}
            style={[s.themeBtn, { backgroundColor: colors.bgContent, borderColor: colors.border }]}
          >
            <Text style={{ fontSize: 18 }}>{ctx.theme === 'dark' ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Hero Progress Card ── */}
        <LinearGradient
          colors={[colors.gradientA, colors.gradientB]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.heroCard}
        >
          {/* Circular progress ring */}
          <View style={s.heroLeft}>
            <View style={s.ringOuter}>
              <View style={s.ringInner}>
                <Text style={s.ringPercent}>{percentage}%</Text>
                <Text style={s.ringLabel}>bugün</Text>
              </View>
            </View>
          </View>

          {/* Right side stats */}
          <View style={s.heroRight}>
            <Text style={s.heroTitle}>
              {ctx.user?.displayName
                ? `Merhaba, ${ctx.user.displayName.split(' ')[0]}!`
                : 'Merhaba!'}
            </Text>
            <Text style={s.heroSub}>
              {completed}/{total} alışkanlık tamamlandı
            </Text>

            {/* XP bar */}
            <View style={s.xpSection}>
              <View style={s.xpRow}>
                <Text style={s.xpLevelText}>Seviye {level}</Text>
                <Text style={s.xpValueText}>{currentXP}/100 XP</Text>
              </View>
              <View style={s.xpBarBg}>
                <View style={[s.xpBarFill, { width: `${currentXP}%` as any }]} />
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* ── Stat Pills ── */}
        <View style={s.pillsRow}>
          <StatPill icon="🔥" label="Seri" value={`${streak} gün`} colors={colors} accent={colors.danger} />
          <StatPill icon="✅" label="Tamamlanan" value={`${completed}/${total}`} colors={colors} accent={colors.success} />
          <StatPill icon="⚡" label="XP" value={`${ctx.userXP}`} colors={colors} accent={colors.accent} />
        </View>

        {/* ── Mascot ── */}
        <View style={{ paddingHorizontal: 20 }}>
          <MascotCard
            percentage={percentage}
            streak={streak}
            streakBroken={streakBroke}
            level={level}
            colors={colors}
          />
        </View>

        {/* ── Habit Groups ── */}
        <View style={s.habitsSection}>
          {total === 0 ? (
            <View style={[s.emptyCard, { backgroundColor: colors.bgContent, borderColor: colors.border }]}>
              <Text style={s.emptyEmoji}>🌱</Text>
              <Text style={[s.emptyTitle, { color: colors.textMain }]}>İlk adımı at!</Text>
              <Text style={[s.emptySubtitle, { color: colors.textMuted }]}>
                Sağ alttaki + butonuna basarak{'\n'}ilk alışkanlığını ekle.
              </Text>
            </View>
          ) : (
            TIME_GROUPS.map(group => {
              const items = ctx.habits.filter(h => h.timeOfDay === group.key);
              if (items.length === 0) return null;
              return (
                <View key={group.key} style={s.group}>
                  <View style={s.groupHeader}>
                    <Text style={s.groupIcon}>{group.icon}</Text>
                    <Text style={[s.groupLabel, { color: colors.textMuted }]}>{group.label}</Text>
                    <View style={[s.groupBadge, { backgroundColor: colors.accentSoft }]}>
                      <Text style={[s.groupBadgeText, { color: colors.accent }]}>{items.length}</Text>
                    </View>
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
            })
          )}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── FAB ── */}
      <LinearGradient
        colors={[colors.gradientA, colors.gradientB]}
        style={s.fab}
      >
        <TouchableOpacity onPress={() => setShowAddModal(true)} style={s.fabInner}>
          <Text style={s.fabIcon}>+</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* ── Modals ── */}
      <AddHabitModal
        visible={showAddModal}
        colors={colors}
        onClose={() => setShowAddModal(false)}
        onAdd={(name, color, timeOfDay, type, target) => {
          ctx.addHabit(name, color, timeOfDay, type, target);
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

function StatPill({
  icon, label, value, colors, accent,
}: {
  icon: string; label: string; value: string; colors: Colors; accent: string;
}) {
  return (
    <View style={[pillStyles.pill, { backgroundColor: colors.bgContent, borderColor: colors.border }]}>
      <View style={[pillStyles.iconWrap, { backgroundColor: `${accent}22` }]}>
        <Text style={{ fontSize: 16 }}>{icon}</Text>
      </View>
      <Text style={[pillStyles.value, { color: colors.textMain }]}>{value}</Text>
      <Text style={[pillStyles.label, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const pillStyles = StyleSheet.create({
  pill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 18,
    borderWidth: 1,
    gap: 4,
  },
  iconWrap: {
    width: 36, height: 36, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 2,
  },
  value: { fontSize: 15, fontWeight: '700' },
  label: { fontSize: 11, fontWeight: '500' },
});

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
    },
    greeting: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
    appName: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
    themeBtn: {
      width: 42, height: 42, borderRadius: 21,
      justifyContent: 'center', alignItems: 'center',
      borderWidth: 1,
    },

    // Hero card
    heroCard: {
      marginHorizontal: 20,
      borderRadius: 24,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      marginBottom: 16,
    },
    heroLeft: { alignItems: 'center' },
    ringOuter: {
      width: 88, height: 88, borderRadius: 44,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center', alignItems: 'center',
    },
    ringInner: {
      width: 68, height: 68, borderRadius: 34,
      backgroundColor: 'rgba(0,0,0,0.25)',
      justifyContent: 'center', alignItems: 'center',
    },
    ringPercent: { fontSize: 20, fontWeight: '800', color: '#fff' },
    ringLabel: { fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
    heroRight: { flex: 1 },
    heroTitle: { fontSize: 17, fontWeight: '700', color: '#fff', marginBottom: 2 },
    heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 12 },
    xpSection: {},
    xpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    xpLevelText: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
    xpValueText: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
    xpBarBg: {
      height: 6, borderRadius: 3,
      backgroundColor: 'rgba(255,255,255,0.2)',
      overflow: 'hidden',
    },
    xpBarFill: {
      height: 6, borderRadius: 3,
      backgroundColor: 'rgba(255,255,255,0.9)',
    },

    // Stat pills
    pillsRow: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      gap: 10,
      marginBottom: 24,
    },

    // Habit groups
    habitsSection: { paddingHorizontal: 20 },
    group: { marginBottom: 24 },
    groupHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    groupIcon: { fontSize: 16 },
    groupLabel: { fontSize: 13, fontWeight: '600', flex: 1, textTransform: 'uppercase', letterSpacing: 0.5 },
    groupBadge: {
      paddingHorizontal: 8, paddingVertical: 2,
      borderRadius: 10,
    },
    groupBadgeText: { fontSize: 12, fontWeight: '700' },

    // Empty state
    emptyCard: {
      alignItems: 'center',
      paddingVertical: 48,
      paddingHorizontal: 32,
      borderRadius: 24,
      borderWidth: 1,
      borderStyle: 'dashed',
      marginTop: 8,
    },
    emptyEmoji: { fontSize: 52, marginBottom: 16 },
    emptyTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
    emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 22 },

    // FAB
    fab: {
      position: 'absolute', bottom: 28, right: 24,
      width: 58, height: 58, borderRadius: 29,
      elevation: 8,
      shadowColor: colors.gradientA,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4, shadowRadius: 12,
    },
    fabInner: {
      flex: 1, justifyContent: 'center', alignItems: 'center',
    },
    fabIcon: { fontSize: 30, color: '#fff', lineHeight: 34, fontWeight: '300' },
  });
}
