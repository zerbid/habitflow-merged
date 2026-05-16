import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Habit } from '../context/AppContext';
import { Colors, HABIT_COLORS } from '../theme/colors';

interface Props {
  visible: boolean;
  colors: Colors;
  onClose: () => void;
  onAdd: (
    name: string,
    color: string,
    timeOfDay: Habit['timeOfDay'],
    type: Habit['type'],
    target: number,
  ) => void;
}

const TIME_OPTIONS: { value: Habit['timeOfDay']; label: string; icon: string }[] = [
  { value: 'morning', label: 'Sabah', icon: '☀️' },
  { value: 'afternoon', label: 'Öğle', icon: '🌤' },
  { value: 'evening', label: 'Akşam', icon: '🌙' },
  { value: 'anytime', label: 'Esnek', icon: '🔄' },
];

export default function AddHabitModal({ visible, colors, onClose, onAdd }: Props) {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);
  const [timeOfDay, setTimeOfDay] = useState<Habit['timeOfDay']>('anytime');
  const [type, setType] = useState<Habit['type']>('boolean');
  const [target, setTarget] = useState('1');

  function reset() {
    setName('');
    setSelectedColor(HABIT_COLORS[0]);
    setTimeOfDay('anytime');
    setType('boolean');
    setTarget('1');
  }

  function handleAdd() {
    if (!name.trim()) return;
    onAdd(name.trim(), selectedColor, timeOfDay, type, parseInt(target) || 1);
    reset();
  }

  function handleClose() {
    reset();
    onClose();
  }

  const s = makeStyles(colors);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={handleClose} />
        <View style={[s.sheet, { backgroundColor: colors.bgContent }]}>
          {/* Handle */}
          <View style={[s.handle, { backgroundColor: colors.border }]} />

          {/* Title row */}
          <View style={s.titleRow}>
            <Text style={[s.title, { color: colors.textMain }]}>Yeni Alışkanlık</Text>
            <TouchableOpacity onPress={handleClose} style={[s.closeBtn, { backgroundColor: colors.bgPanel }]}>
              <Text style={[s.closeBtnText, { color: colors.textMuted }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Name input */}
            <Text style={[s.label, { color: colors.textMuted }]}>Alışkanlık Adı</Text>
            <TextInput
              style={[s.input, {
                backgroundColor: colors.bgPanel,
                color: colors.textMain,
                borderColor: colors.border,
              }]}
              placeholder="Örn: 30 dk okuma..."
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              returnKeyType="done"
              autoFocus
            />

            {/* Color picker */}
            <Text style={[s.label, { color: colors.textMuted }]}>Renk</Text>
            <View style={s.colorRow}>
              {HABIT_COLORS.map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setSelectedColor(c)}
                  style={[
                    s.colorDot,
                    { backgroundColor: c },
                    selectedColor === c && s.colorDotActive,
                  ]}
                >
                  {selectedColor === c && (
                    <Text style={styles.colorCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Time of day */}
            <Text style={[s.label, { color: colors.textMuted }]}>Ne Zaman?</Text>
            <View style={s.segmentRow}>
              {TIME_OPTIONS.map(opt => {
                const active = timeOfDay === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setTimeOfDay(opt.value)}
                    style={[
                      s.segment,
                      { borderColor: colors.border, backgroundColor: colors.bgPanel },
                      active && { backgroundColor: colors.accent, borderColor: colors.accent },
                    ]}
                  >
                    <Text style={{ fontSize: 14 }}>{opt.icon}</Text>
                    <Text style={[s.segmentText, { color: active ? '#fff' : colors.textMuted }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Type */}
            <Text style={[s.label, { color: colors.textMuted }]}>Tür</Text>
            <View style={s.typeRow}>
              {(['boolean', 'numeric'] as Habit['type'][]).map(t => {
                const active = type === t;
                return (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setType(t)}
                    style={[
                      s.typeBtn,
                      { backgroundColor: colors.bgPanel, borderColor: colors.border },
                      active && { backgroundColor: `${colors.accent}22`, borderColor: colors.accent },
                    ]}
                  >
                    <Text style={{ fontSize: 20 }}>{t === 'boolean' ? '✅' : '🔢'}</Text>
                    <Text style={[s.typeBtnTitle, { color: active ? colors.accent : colors.textMain }]}>
                      {t === 'boolean' ? 'Evet/Hayır' : 'Sayısal'}
                    </Text>
                    <Text style={[s.typeBtnSub, { color: colors.textMuted }]}>
                      {t === 'boolean' ? 'Yaptım / yapmadım' : 'Belirli bir hedef'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Target (numeric only) */}
            {type === 'numeric' && (
              <>
                <Text style={[s.label, { color: colors.textMuted }]}>Günlük Hedef</Text>
                <TextInput
                  style={[s.input, {
                    backgroundColor: colors.bgPanel,
                    color: colors.textMain,
                    borderColor: colors.border,
                  }]}
                  keyboardType="numeric"
                  value={target}
                  onChangeText={setTarget}
                  returnKeyType="done"
                  placeholder="10"
                  placeholderTextColor={colors.textMuted}
                />
              </>
            )}

            {/* Add button */}
            <LinearGradient
              colors={[colors.gradientA, colors.gradientB]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.addGradient}
            >
              <TouchableOpacity style={s.addBtn} onPress={handleAdd} disabled={!name.trim()}>
                <Text style={s.addBtnText}>Alışkanlık Ekle</Text>
              </TouchableOpacity>
            </LinearGradient>

            <View style={{ height: 16 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  colorCheck: { color: '#fff', fontSize: 14, fontWeight: '800' },
});

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
    sheet: {
      borderTopLeftRadius: 32, borderTopRightRadius: 32,
      paddingHorizontal: 24, paddingBottom: 0,
      maxHeight: '90%',
    },
    handle: {
      width: 36, height: 4, borderRadius: 2,
      alignSelf: 'center', marginTop: 14, marginBottom: 20,
    },
    titleRow: {
      flexDirection: 'row', alignItems: 'center',
      justifyContent: 'space-between', marginBottom: 24,
    },
    title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
    closeBtn: {
      width: 34, height: 34, borderRadius: 17,
      justifyContent: 'center', alignItems: 'center',
    },
    closeBtnText: { fontSize: 14, fontWeight: '700' },
    label: {
      fontSize: 12, fontWeight: '700', letterSpacing: 0.8,
      textTransform: 'uppercase', marginBottom: 10,
    },
    input: {
      borderWidth: 1.5, borderRadius: 14,
      padding: 14, fontSize: 16, marginBottom: 24,
      fontWeight: '500',
    },
    colorRow: {
      flexDirection: 'row', gap: 10, marginBottom: 24, flexWrap: 'wrap',
    },
    colorDot: {
      width: 36, height: 36, borderRadius: 12,
      justifyContent: 'center', alignItems: 'center',
    },
    colorDotActive: {
      transform: [{ scale: 1.15 }],
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3, shadowRadius: 4, elevation: 4,
    },
    segmentRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
    segment: {
      flex: 1, alignItems: 'center', paddingVertical: 10,
      borderRadius: 14, borderWidth: 1.5, gap: 4,
    },
    segmentText: { fontSize: 11, fontWeight: '700' },
    typeRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    typeBtn: {
      flex: 1, padding: 16, borderRadius: 18,
      borderWidth: 1.5, alignItems: 'center', gap: 6,
    },
    typeBtnTitle: { fontSize: 14, fontWeight: '700' },
    typeBtnSub: { fontSize: 11, textAlign: 'center' },
    addGradient: { borderRadius: 16, marginTop: 8 },
    addBtn: { paddingVertical: 16, alignItems: 'center' },
    addBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.2 },
  });
}
