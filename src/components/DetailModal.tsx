import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Habit } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { getDateStr, isHabitDoneOnDate, calcMascotStage } from '../utils/helpers';
import Plant from './mascots/Plant';
import Campfire from './mascots/Campfire';

interface Props {
  visible: boolean;
  habit: Habit;
  colors: Colors;
  onClose: () => void;
}

export default function DetailModal({ visible, habit, colors, onClose }: Props) {
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = getDateStr(d);
    return {
      dateStr,
      done: isHabitDoneOnDate(habit, dateStr),
      label: d.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' }),
    };
  });

  const doneCount = days.filter(d => d.done).length;
  const stage = calcMascotStage(habit);
  const isFire = (habit.mascot ?? 'plant') === 'fire';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.bgContent }]}>

          {/* Mascot hero */}
          <View style={styles.mascotHero}>
            {isFire
              ? <Campfire stage={stage} size={140} animate />
              : <Plant    stage={stage} size={140} animate />
            }
          </View>

          <Text style={[styles.title, { color: colors.textMain }]}>{habit.name}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Son 30 günde {doneCount} kez tamamlandı
          </Text>

          {/* Heatmap */}
          <View style={styles.heatmap}>
            {days.map(day => (
              <View
                key={day.dateStr}
                style={[
                  styles.cell,
                  { backgroundColor: day.done ? habit.color : colors.border },
                ]}
              />
            ))}
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={[styles.legendDot, { backgroundColor: colors.border }]} />
            <Text style={[styles.legendText, { color: colors.textMuted }]}>Yapılmadı</Text>
            <View style={[styles.legendDot, { backgroundColor: habit.color }]} />
            <Text style={[styles.legendText, { color: colors.textMuted }]}>Tamamlandı</Text>
          </View>

          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: colors.bgMain }]}
            onPress={onClose}
          >
            <Text style={[styles.closeBtnText, { color: colors.textMain }]}>Kapat</Text>
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
  mascotHero: { alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 13, marginBottom: 20 },
  heatmap: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 14 },
  cell: { width: 24, height: 24, borderRadius: 5 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  legendDot: { width: 14, height: 14, borderRadius: 4 },
  legendText: { fontSize: 12 },
  closeBtn: { padding: 14, borderRadius: 12, alignItems: 'center' },
  closeBtnText: { fontSize: 15, fontWeight: '600' },
});
