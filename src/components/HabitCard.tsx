import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Habit } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { isHabitDoneOnDate, getCurrentVal, calcMascotStage } from '../utils/helpers';
import Plant from './mascots/Plant';
import Campfire from './mascots/Campfire';

interface Props {
  habit: Habit;
  today: string;
  colors: Colors;
  onToggle: () => void;
  onUpdate: (amount: number) => void;
  onDelete: () => void;
  onPress: () => void;
}

export default function HabitCard({
  habit, today, colors, onToggle, onUpdate, onDelete, onPress,
}: Props) {
  const done = isHabitDoneOnDate(habit, today);
  const currentVal = getCurrentVal(habit, today);
  const progress = habit.type === 'numeric' && habit.target > 0
    ? Math.min(currentVal / habit.target, 1)
    : done ? 1 : 0;

  const stage = calcMascotStage(habit);
  const isFire = (habit.mascot ?? 'plant') === 'fire';

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.bgContent,
          borderColor: done ? `${habit.color}55` : colors.border,
        },
        done && { backgroundColor: `${habit.color}12` },
      ]}
    >
      {/* Left mascot */}
      <View style={styles.mascotWrap}>
        {isFire
          ? <Campfire stage={stage} size={52} animate={false} />
          : <Plant    stage={stage} size={52} animate={false} />
        }
      </View>

      {/* Content */}
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text
            style={[
              styles.name,
              { color: done ? colors.textMuted : colors.textMain },
              done && styles.nameDone,
            ]}
            numberOfLines={1}
          >
            {habit.name}
          </Text>

          {habit.type === 'boolean' ? (
            <TouchableOpacity
              onPress={onToggle}
              style={[
                styles.checkbox,
                {
                  borderColor: done ? habit.color : colors.border,
                  backgroundColor: done ? habit.color : 'transparent',
                },
              ]}
            >
              {done && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ) : (
            <View style={styles.numericRow}>
              <TouchableOpacity
                onPress={() => onUpdate(-1)}
                style={[styles.numBtn, { borderColor: colors.border, backgroundColor: colors.bgPanel }]}
              >
                <Text style={[styles.numBtnText, { color: colors.textMain }]}>−</Text>
              </TouchableOpacity>
              <Text style={[styles.numValue, { color: colors.textMain }]}>
                {currentVal}/{habit.target}
              </Text>
              <TouchableOpacity
                onPress={() => onUpdate(1)}
                style={[styles.numBtn, { backgroundColor: habit.color }]}
              >
                <Text style={[styles.numBtnText, { color: '#fff' }]}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress * 100}%` as any, backgroundColor: habit.color },
            ]}
          />
        </View>

        <View style={styles.footer}>
          <View style={[styles.tag, { backgroundColor: colors.bgPanel }]}>
            <Text style={[styles.tagText, { color: colors.textMuted }]}>
              {habit.type === 'boolean' ? '✓ Günlük' : `🎯 ${habit.target} hedef`}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.deleteIcon, { color: colors.textMuted }]}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
    alignItems: 'center',
  },
  mascotWrap: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingLeft: 4,
  },
  body: {
    flex: 1,
    padding: 14,
    paddingLeft: 8,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  nameDone: {
    textDecorationLine: 'line-through',
  },
  checkbox: {
    width: 28, height: 28, borderRadius: 9,
    borderWidth: 2,
    justifyContent: 'center', alignItems: 'center',
  },
  checkmark: { color: '#fff', fontSize: 15, fontWeight: '800' },
  numericRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  numBtn: {
    width: 30, height: 30, borderRadius: 9,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'transparent',
  },
  numBtnText: { fontSize: 18, fontWeight: '600', lineHeight: 22 },
  numValue: { fontSize: 13, fontWeight: '700', minWidth: 48, textAlign: 'center' },
  progressBg: { height: 3, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 3, borderRadius: 2 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagText: { fontSize: 11, fontWeight: '500' },
  deleteIcon: { fontSize: 22, fontWeight: '300', lineHeight: 24 },
});
