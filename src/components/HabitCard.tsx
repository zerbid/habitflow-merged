import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Habit } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { isHabitDoneOnDate, getCurrentVal } from '../utils/helpers';

interface Props {
  habit: Habit;
  today: string;
  colors: Colors;
  onToggle: () => void;
  onUpdate: (amount: number) => void;
  onDelete: () => void;
  onPress: () => void;
}

function CompletionRing({ done, progress, color, bg }: {
  done: boolean; progress: number; color: string; bg: string;
}) {
  const r = 12;
  const c = 2 * Math.PI * r;
  return (
    <Svg width={28} height={28}>
      <Circle cx={14} cy={14} r={r} fill="none" stroke={bg} strokeWidth={2} />
      <Circle
        cx={14} cy={14} r={r}
        fill="none" stroke={color} strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={c * (1 - progress)}
        rotation="-90" originX={14} originY={14}
      />
      {done && (
        <>
          <Circle cx={14} cy={14} r={10} fill={color} />
          <Path
            d="M9.5 14l3 3 5-5"
            stroke="#FBF7EF" strokeWidth={1.8}
            strokeLinecap="round" strokeLinejoin="round"
          />
        </>
      )}
    </Svg>
  );
}

export default function HabitCard({
  habit, today, colors, onToggle, onUpdate, onDelete, onPress,
}: Props) {
  const done       = isHabitDoneOnDate(habit, today);
  const currentVal = getCurrentVal(habit, today);
  const progress   = habit.type === 'numeric' && habit.target > 0
    ? Math.min(currentVal / habit.target, 1)
    : done ? 1 : 0;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        s.card,
        { backgroundColor: colors.bgContent, borderColor: colors.hairline },
      ]}
    >
      {/* Completion ring */}
      <View style={s.ringWrap}>
        <CompletionRing
          done={done}
          progress={progress}
          color={habit.color}
          bg={colors.bgPanel}
        />
      </View>

      {/* Content */}
      <View style={s.body}>
        <View style={s.topRow}>
          <Text
            style={[
              s.name,
              { color: done ? colors.textMuted : colors.textMain },
              done && s.nameDone,
            ]}
            numberOfLines={1}
          >
            {habit.name}
          </Text>

          {habit.type === 'boolean' ? (
            <TouchableOpacity
              onPress={onToggle}
              style={[
                s.checkbox,
                {
                  borderColor: done ? habit.color : colors.border,
                  backgroundColor: done ? habit.color : 'transparent',
                },
              ]}
            >
              {done && (
                <Svg width={13} height={13} viewBox="0 0 13 13">
                  <Path
                    d="M2.5 6.5L5.5 9.5L10.5 3.5"
                    stroke="#FBF7EF" strokeWidth={2}
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                </Svg>
              )}
            </TouchableOpacity>
          ) : (
            <View style={s.numericRow}>
              <TouchableOpacity
                onPress={() => onUpdate(-1)}
                style={[s.numBtn, { backgroundColor: colors.bgPanel }]}
              >
                <Text style={[s.numBtnText, { color: colors.textMain }]}>−</Text>
              </TouchableOpacity>
              <Text style={[s.numValue, { color: colors.textSub }]}>
                {currentVal}/{habit.target}
              </Text>
              <TouchableOpacity
                onPress={() => onUpdate(1)}
                style={[s.numBtn, { backgroundColor: habit.color }]}
              >
                <Text style={[s.numBtnText, { color: '#FBF7EF' }]}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={[s.progressBg, { backgroundColor: colors.bgPanel }]}>
          <View
            style={[
              s.progressFill,
              { width: `${progress * 100}%` as any, backgroundColor: habit.color },
            ]}
          />
        </View>
      </View>

      {/* Delete */}
      <TouchableOpacity
        onPress={onDelete}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={s.deleteBtn}
      >
        <Text style={[s.deleteIcon, { color: colors.textMuted }]}>×</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 22, borderWidth: 1,
    padding: 14, gap: 14, marginBottom: 8,
  },
  ringWrap: { flexShrink: 0 },
  body: { flex: 1, gap: 8 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { flex: 1, fontSize: 15, fontWeight: '500', letterSpacing: -0.1 },
  nameDone: { textDecorationLine: 'line-through' },
  checkbox: {
    width: 28, height: 28, borderRadius: 99,
    borderWidth: 1.5,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  numericRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  numBtn: {
    width: 30, height: 30, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  numBtnText: { fontSize: 18, fontWeight: '500', lineHeight: 22 },
  numValue: { fontSize: 12, minWidth: 46, textAlign: 'center', fontVariant: ['tabular-nums'] },
  progressBg: { height: 3, borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: 3, borderRadius: 99 },
  deleteBtn: { flexShrink: 0, paddingLeft: 4 },
  deleteIcon: { fontSize: 22, fontWeight: '300', lineHeight: 24 },
});
