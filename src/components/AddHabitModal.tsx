import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Habit } from '../context/AppContext';
import { Colors, HABIT_COLORS } from '../theme/colors';
import Plant from './mascots/Plant';
import Campfire from './mascots/Campfire';
import Svg, { Path } from 'react-native-svg';

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
    mascot: 'plant' | 'fire',
  ) => void;
}

const TIME_OPTIONS: { value: Habit['timeOfDay']; label: string }[] = [
  { value: 'morning',   label: 'Sabah' },
  { value: 'afternoon', label: 'Öğle'  },
  { value: 'evening',   label: 'Akşam' },
  { value: 'anytime',   label: 'Esnek' },
];

export default function AddHabitModal({ visible, colors, onClose, onAdd }: Props) {
  const [name, setName]                   = useState('');
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);
  const [timeOfDay, setTimeOfDay]         = useState<Habit['timeOfDay']>('anytime');
  const [type, setType]                   = useState<Habit['type']>('boolean');
  const [target, setTarget]               = useState('1');
  const [mascot, setMascot]               = useState<'plant' | 'fire'>('plant');

  function reset() {
    setName(''); setSelectedColor(HABIT_COLORS[0]);
    setTimeOfDay('anytime'); setType('boolean');
    setTarget('1'); setMascot('plant');
  }

  function handleAdd() {
    if (!name.trim()) return;
    onAdd(name.trim(), selectedColor, timeOfDay, type, parseInt(target) || 1, mascot);
    reset();
  }

  function handleClose() { reset(); onClose(); }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={handleClose} />

        <View style={[s.sheet, { backgroundColor: colors.bgContent }]}>
          {/* Handle */}
          <View style={[s.handle, { backgroundColor: colors.border }]} />

          {/* Header */}
          <View style={s.header}>
            <View>
              <Text style={[s.headerSup, { color: colors.textMuted }]}>Yeni</Text>
              <Text style={[s.headerTitle, { color: colors.textMain, fontFamily: 'Georgia' }]}>
                Bir alışkanlık daha
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              style={[s.closeBtn, { backgroundColor: colors.bgPanel }]}
            >
              <Text style={[s.closeBtnText, { color: colors.textSub }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Name */}
            <Text style={[s.label, { color: colors.textMuted }]}>Ne yapmak istiyorsun?</Text>
            <TextInput
              style={[s.input, {
                backgroundColor: colors.bgMain,
                color: colors.textMain,
                borderColor: colors.hairline,
              }]}
              placeholder="10 dakika dışarıda yürümek…"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              returnKeyType="done"
              autoFocus
            />

            {/* Color */}
            <Text style={[s.label, { color: colors.textMuted }]}>Renk</Text>
            <View style={s.colorRow}>
              {HABIT_COLORS.map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setSelectedColor(c)}
                  style={[
                    s.colorSwatch,
                    { backgroundColor: c },
                    selectedColor === c && { transform: [{ scale: 1.12 }] },
                  ]}
                >
                  {selectedColor === c && (
                    <Svg width={13} height={13} viewBox="0 0 13 13">
                      <Path
                        d="M2.5 6.5L5.5 9.5L10.5 3.5"
                        stroke="#FBF7EF" strokeWidth={2}
                        strokeLinecap="round" strokeLinejoin="round"
                      />
                    </Svg>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Time of day */}
            <Text style={[s.label, { color: colors.textMuted }]}>Ne zaman?</Text>
            <View style={s.segmentRow}>
              {TIME_OPTIONS.map(opt => {
                const active = timeOfDay === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setTimeOfDay(opt.value)}
                    style={[
                      s.segment,
                      {
                        backgroundColor: active ? colors.textMain : colors.bgMain,
                        borderColor: active ? colors.textMain : colors.hairline,
                      },
                    ]}
                  >
                    <Text style={[s.segmentText, { color: active ? colors.bgMain : colors.textSub }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Type */}
            <Text style={[s.label, { color: colors.textMuted }]}>Nasıl ölçeceksin?</Text>
            <View style={s.typeRow}>
              <TouchableOpacity
                onPress={() => setType('boolean')}
                style={[
                  s.typeCard,
                  {
                    backgroundColor: colors.bgMain,
                    borderColor: type === 'boolean' ? colors.primary : colors.hairline,
                    borderWidth: type === 'boolean' ? 1.5 : 1,
                  },
                ]}
              >
                <Text style={[s.typeCardTitle, { color: colors.textMain, fontFamily: 'Georgia' }]}>
                  Yaptım
                </Text>
                <Text style={[s.typeCardSub, { color: colors.textMuted }]}>
                  Tek bir kutucuk. Bugün yaptın mı?
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setType('numeric')}
                style={[
                  s.typeCard,
                  {
                    backgroundColor: colors.bgMain,
                    borderColor: type === 'numeric' ? colors.primary : colors.hairline,
                    borderWidth: type === 'numeric' ? 1.5 : 1,
                  },
                ]}
              >
                <Text style={[s.typeCardTitle, { color: colors.textMain, fontFamily: 'Georgia' }]}>
                  Sayarak
                </Text>
                <Text style={[s.typeCardSub, { color: colors.textMuted }]}>
                  Bir hedef belirle. Adım, sayfa, dakika…
                </Text>
              </TouchableOpacity>
            </View>

            {/* Target (numeric only) */}
            {type === 'numeric' && (
              <>
                <Text style={[s.label, { color: colors.textMuted }]}>Günlük hedef</Text>
                <TextInput
                  style={[s.input, {
                    backgroundColor: colors.bgMain,
                    color: colors.textMain,
                    borderColor: colors.hairline,
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

            {/* Mascot picker */}
            <Text style={[s.label, { color: colors.textMuted }]}>Bir dost seç</Text>
            <View style={s.mascotRow}>
              <MascotChoice
                type="plant" selected={mascot === 'plant'} colors={colors}
                onPress={() => setMascot('plant')}
              />
              <MascotChoice
                type="fire" selected={mascot === 'fire'} colors={colors}
                onPress={() => setMascot('fire')}
              />
            </View>

            {/* Hint */}
            <View style={[s.hint, { backgroundColor: colors.primarySoft }]}>
              <Text style={[s.hintText, { color: colors.primary }]}>
                <Text style={{ fontFamily: 'Georgia', fontSize: 15 }}>Bir öneri — </Text>
                küçük başla. Beş dakikalık bir adım, bir saatten daha sürdürülebilirdir.
              </Text>
            </View>

            {/* Add button */}
            <TouchableOpacity
              onPress={handleAdd}
              disabled={!name.trim()}
              style={[
                s.addBtn,
                { backgroundColor: colors.textMain, opacity: name.trim() ? 1 : 0.4 },
              ]}
            >
              <Text style={[s.addBtnText, { color: colors.bgMain }]}>Listeme ekle</Text>
            </TouchableOpacity>

            <View style={{ height: 24 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Mascot choice card ────────────────────────────────────────────────────────

const FIRE_BG     = '#251D17';
const FIRE_BORDER = '#3A2F25';
const FIRE_TEXT   = '#FBF7EF';
const FIRE_MUTED  = '#D6CFC0';

function MascotChoice({
  type, selected, colors, onPress,
}: { type: 'plant' | 'fire'; selected: boolean; colors: Colors; onPress: () => void }) {
  const isPlant = type === 'plant';

  const cardBg     = isPlant
    ? (selected ? colors.bgContent : colors.bgMain)
    : (selected ? FIRE_BG : '#1A1410');
  const cardBorder = isPlant
    ? (selected ? colors.primary : colors.hairline)
    : (selected ? '#E08456' : FIRE_BORDER);
  const nameTxt = isPlant
    ? colors.textMain
    : FIRE_TEXT;
  const subTxt  = isPlant ? colors.textMuted : FIRE_MUTED;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        ms.card,
        {
          backgroundColor: cardBg,
          borderColor: cardBorder,
          borderWidth: selected ? 2 : 1,
        },
      ]}
    >
      {isPlant
        ? <Plant    stage={3} size={80} animate={false} />
        : <Campfire stage={3} size={80} animate={false} />
      }
      <Text style={[ms.name, { color: nameTxt, fontFamily: 'Georgia' }]}>
        {isPlant ? 'Bitki' : 'Ateş'}
      </Text>
      <Text style={[ms.desc, { color: subTxt }]}>
        {isPlant
          ? 'Sessiz. Sabit hızda.\nDüşmeyi affeder.'
          : 'Canlı. Hareketli.\nKöz bırakır, asla sönmez.'}
      </Text>
      {selected && (
        <View style={[ms.check, { backgroundColor: isPlant ? colors.primary : '#E08456' }]}>
          <Svg width={12} height={12} viewBox="0 0 12 12">
            <Path d="M2 6l3 3 5-5" stroke="#FBF7EF" strokeWidth={1.8}
              strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
      )}
    </TouchableOpacity>
  );
}

const ms = StyleSheet.create({
  card: {
    flex: 1, alignItems: 'center',
    paddingVertical: 16, paddingHorizontal: 10,
    borderRadius: 26, gap: 6,
  },
  name: { fontSize: 22 },
  desc: { fontSize: 12, textAlign: 'center', lineHeight: 17 },
  check: {
    position: 'absolute', top: 12, right: 12,
    width: 22, height: 22, borderRadius: 11,
    justifyContent: 'center', alignItems: 'center',
  },
});

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: {
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingHorizontal: 22, paddingBottom: 0,
    maxHeight: '94%',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    alignSelf: 'center', marginTop: 14, marginBottom: 18,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 22,
  },
  headerSup: {
    fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 2,
  },
  headerTitle: { fontSize: 28, letterSpacing: -0.5, lineHeight: 32 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  closeBtnText: { fontSize: 14 },
  label: {
    fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8,
  },
  input: {
    borderWidth: 1, borderRadius: 14,
    padding: 14, fontSize: 16, marginBottom: 22,
  },
  colorRow: { flexDirection: 'row', gap: 10, marginBottom: 22, flexWrap: 'wrap' },
  colorSwatch: {
    width: 32, height: 32, borderRadius: 11,
    justifyContent: 'center', alignItems: 'center',
  },
  segmentRow: { flexDirection: 'row', gap: 8, marginBottom: 22 },
  segment: {
    flex: 1, alignItems: 'center', paddingVertical: 12,
    borderRadius: 14, borderWidth: 1,
  },
  segmentText: { fontSize: 13, fontWeight: '500' },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 22 },
  typeCard: {
    flex: 1, padding: 14, borderRadius: 18, gap: 4,
  },
  typeCardTitle: { fontSize: 17 },
  typeCardSub: { fontSize: 12, lineHeight: 17 },
  mascotRow: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  hint: {
    borderRadius: 14, padding: 14, marginBottom: 18,
  },
  hintText: { fontSize: 12, lineHeight: 18 },
  addBtn: {
    borderRadius: 16, paddingVertical: 15,
    alignItems: 'center',
  },
  addBtnText: { fontSize: 15, fontWeight: '500', letterSpacing: 0.1 },
});
