import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Habit } from '../context/AppContext';
import { Colors } from '../theme/colors';

interface Props {
  visible: boolean;
  habits: Habit[];
  periodPrefix: string;
  title: string;
  colors: Colors;
  onClose: () => void;
}

export default function ReportModal({ visible, habits, periodPrefix, title, colors, onClose }: Props) {
  let totalDone = 0;
  let bestHabit = { name: '—', count: 0 };

  habits.forEach(habit => {
    let count = 0;
    Object.keys(habit.history).forEach(dateStr => {
      if (dateStr.startsWith(periodPrefix)) count++;
    });
    totalDone += count;
    if (count > bestHabit.count) bestHabit = { name: habit.name, count };
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.bgContent }]}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={[styles.title, { color: colors.textMain }]}>{title}</Text>

          <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Tamamlanan Toplam Görev</Text>
            <Text style={[styles.statValue, { color: colors.textMain }]}>{totalDone}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>En Başarılı Alışkanlık</Text>
            <Text style={[styles.statValue, { color: colors.textMain }]} numberOfLines={2}>
              {bestHabit.name}
              {bestHabit.count > 0 ? ` (${bestHabit.count}×)` : ''}
            </Text>
          </View>

          <Text style={[styles.message, { color: colors.textMuted }]}>
            Geçtiğimiz dönemdeki çabaların için tebrikler! Bu motivasyonu koru. 💪
          </Text>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.primary }]}
            onPress={onClose}
          >
            <Text style={[styles.btnText, { color: colors.bgMain }]}>Harika!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center', padding: 24,
  },
  card: { borderRadius: 24, padding: 24 },
  emoji: { fontSize: 48, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  statRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1,
  },
  statLabel: { fontSize: 14, flex: 1, marginRight: 8 },
  statValue: { fontSize: 16, fontWeight: '700' },
  message: { fontSize: 14, lineHeight: 22, marginVertical: 16 },
  btn: { padding: 14, borderRadius: 14, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '700' },
});
