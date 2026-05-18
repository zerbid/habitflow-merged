import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  Switch, Alert, Share, ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useAppContext } from '../context/AppContext';
import { darkColors, lightColors, Colors } from '../theme/colors';
import { calcLevel } from '../utils/helpers';
import { MascotType } from '../context/AppContext';
import { requestNotificationPermissions } from '../services/screenTime';
import Plant from '../components/mascots/Plant';
import Campfire from '../components/mascots/Campfire';

export default function SettingsScreen() {
  const ctx    = useAppContext();
  const colors = ctx.theme === 'dark' ? darkColors : lightColors;
  const { level, currentXP } = calcLevel(ctx.userXP);

  async function handleNotificationsToggle(enabled: boolean) {
    if (enabled) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert('İzin Reddedildi', 'Sistem ayarlarından bildirim iznini etkinleştirmelisiniz.');
        return;
      }
    }
    ctx.setNotifications(enabled);
  }

  async function handleSignIn() {
    try { await ctx.signIn(); }
    catch { Alert.alert('Hata', 'Google ile giriş başarısız oldu.'); }
  }

  function handleSignOut() {
    Alert.alert('Çıkış Yap', 'Hesabından çıkmak istediğine emin misin?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Çıkış', style: 'destructive', onPress: () => ctx.signOut() },
    ]);
  }

  async function handleExport() {
    try {
      const json = JSON.stringify(ctx.exportData(), null, 2);
      await Share.share({ message: json, title: 'HabitFlow Yedek' });
    } catch { Alert.alert('Hata', 'Dışa aktarma başarısız.'); }
  }

  function handleReset() {
    Alert.alert(
      'Tüm Verileri Sil',
      'TÜM verilerini silmek istediğine emin misin? Bu işlem geri alınamaz!',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: async () => {
          await ctx.resetAllData();
          Alert.alert('Tamamlandı', 'Tüm veriler silindi.');
        }},
      ],
    );
  }

  const firstName = ctx.user?.displayName?.split(' ')[0];
  const initials  = ctx.user?.displayName?.charAt(0).toUpperCase() ?? '·';
  const totalHabits = ctx.habits.length;

  return (
    <SafeAreaView style={[s.root, { backgroundColor: colors.bgMain }]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={[s.headerTitle, { color: colors.textMain, fontFamily: 'Georgia' }]}>
            Senin alanın
          </Text>
          <Text style={[s.headerSub, { color: colors.textMuted }]}>
            {ctx.user ? `${firstName ?? 'Kullanıcı'} · ${ctx.user.email ?? ''}` : 'Giriş yapılmadı'}
          </Text>
        </View>

        {/* ── Profile card ── */}
        <View style={[s.profileCard, { backgroundColor: colors.bgContent, borderColor: colors.hairline }]}>
          <View style={s.profileTop}>
            <View style={[s.avatar, { backgroundColor: colors.primarySoft }]}>
              <Text style={[s.avatarText, { color: colors.primary, fontFamily: 'Georgia' }]}>
                {initials}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.since, { color: colors.textMuted }]}>Seviye {level}</Text>
              <Text style={[s.stepsCount, { color: colors.textMain, fontFamily: 'Georgia' }]}>
                {ctx.userXP} XP kazanıldı
              </Text>
            </View>
          </View>
          <View style={[s.statStrip, { borderTopColor: colors.hairline }]}>
            {[
              { v: `${ctx.habits.filter(h => {
                const today = new Date().toISOString().slice(0,10);
                const val = h.history[today];
                return val === true || (typeof val === 'number' && val >= h.target);
              }).length}/${totalHabits}`, l: 'bugün' },
              { v: String(totalHabits), l: 'alışkanlık' },
              { v: `%${currentXP}`, l: 'seviye ilerleme' },
            ].map((stat, i) => (
              <View key={i} style={[s.statCell, i > 0 && { borderLeftWidth: 1, borderLeftColor: colors.hairline }]}>
                <Text style={[s.statVal, { color: colors.textMain, fontFamily: 'Georgia' }]}>{stat.v}</Text>
                <Text style={[s.statLabel, { color: colors.textMuted }]}>{stat.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Auth ── */}
        <TouchableOpacity
          style={[s.authBtn, { backgroundColor: colors.bgContent, borderColor: colors.hairline }]}
          onPress={ctx.user ? handleSignOut : handleSignIn}
        >
          <Text style={[s.authBtnText, { color: ctx.user ? colors.danger : colors.primary }]}>
            {ctx.user ? 'Hesaptan çık' : 'Google ile giriş yap'}
          </Text>
          <Svg width={14} height={14} viewBox="0 0 14 14">
            <Path d="M5 3l4 4-4 4" stroke={ctx.user ? colors.danger : colors.primary}
              strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>

        {/* ── Görünüm ── */}
        <SectionTitle label="Görünüm" colors={colors} />
        <View style={[s.listCard, { backgroundColor: colors.bgContent, borderColor: colors.hairline }]}>
          <View style={s.listRow}>
            <View style={{ flex: 1 }}>
              <Text style={[s.rowTitle, { color: colors.textMain }]}>Karanlık mod</Text>
              <Text style={[s.rowSub, { color: colors.textMuted }]}>
                {ctx.theme === 'dark' ? 'Aktif' : 'Otomatik · gün batımında'}
              </Text>
            </View>
            <Switch
              value={ctx.theme === 'dark'}
              onValueChange={val => ctx.setTheme(val ? 'dark' : 'light')}
              trackColor={{ true: colors.primary, false: colors.bgPanel }}
              thumbColor={colors.bgContent}
            />
          </View>
        </View>

        {/* ── Maskot kişiliği ── */}
        <SectionTitle label="Maskot kişiliği" colors={colors} />
        <View style={s.mascotRow}>
          <MascotOption
            type="plant" selected={ctx.mascotType === 'plant'}
            colors={colors} onPress={() => ctx.setMascotType('plant')}
          />
          <MascotOption
            type="campfire" selected={ctx.mascotType === 'campfire'}
            colors={colors} onPress={() => ctx.setMascotType('campfire')}
          />
        </View>

        {/* ── Bildirimler ── */}
        <SectionTitle label="Hatırlatma" colors={colors} />
        <View style={[s.listCard, { backgroundColor: colors.bgContent, borderColor: colors.hairline }]}>
          <View style={s.listRow}>
            <View style={{ flex: 1 }}>
              <Text style={[s.rowTitle, { color: colors.textMain }]}>Yumuşak hatırlatıcı</Text>
              <Text style={[s.rowSub, { color: colors.textMuted }]}>
                {ctx.notificationsEnabled ? `Her gün ${ctx.notificationTime}` : 'Kapalı · isteğe bağlı'}
              </Text>
            </View>
            <Switch
              value={ctx.notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{ true: colors.primary, false: colors.bgPanel }}
              thumbColor={colors.bgContent}
            />
          </View>
        </View>

        {/* ── Seri koruma ── */}
        <SectionTitle label="Seri koruma" colors={colors} />
        <View style={[s.listCard, { backgroundColor: colors.bgContent, borderColor: colors.hairline }]}>
          <View style={s.listRow}>
            <View style={{ flex: 1 }}>
              <Text style={[s.rowTitle, { color: colors.textMain }]}>Streak dondurma</Text>
              <Text style={[s.rowSub, { color: colors.textMuted }]}>
                {ctx.freezeTokens > 0
                  ? `${ctx.freezeTokens} hak kaldı — seri kırılınca aktifleştir`
                  : 'Hak kalmadı. 7 günlük seri tamamlayarak kazan.'}
              </Text>
            </View>
            <View style={[s.freezeBadge, {
              backgroundColor: ctx.freezeTokens > 0 ? '#3b82f620' : colors.bgPanel,
            }]}>
              <Text style={[s.freezeNum, { color: ctx.freezeTokens > 0 ? '#3b82f6' : colors.textMuted }]}>
                {ctx.freezeTokens}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Veri ── */}
        <SectionTitle label="Veri" colors={colors} />
        <View style={[s.listCard, { backgroundColor: colors.bgContent, borderColor: colors.hairline }]}>
          <TouchableOpacity
            style={[s.listRow, { borderBottomWidth: 1, borderBottomColor: colors.hairline }]}
            onPress={handleExport}
          >
            <View style={{ flex: 1 }}>
              <Text style={[s.rowTitle, { color: colors.textMain }]}>Yedeği dışa aktar</Text>
              <Text style={[s.rowSub, { color: colors.textMuted }]}>JSON dosyası</Text>
            </View>
            <Svg width={14} height={14} viewBox="0 0 14 14">
              <Path d="M5 3l4 4-4 4" stroke={colors.textMuted}
                strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity style={s.listRow} onPress={handleReset}>
            <View style={{ flex: 1 }}>
              <Text style={[s.rowTitle, { color: colors.danger }]}>Yeniden başla</Text>
              <Text style={[s.rowSub, { color: colors.textMuted }]}>Tüm geçmişi temizle</Text>
            </View>
            <Svg width={14} height={14} viewBox="0 0 14 14">
              <Path d="M5 3l4 4-4 4" stroke={colors.danger}
                strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* ── Footer ── */}
        <Text style={[s.footer, { color: colors.textMuted, fontFamily: 'Georgia' }]}>
          Her gün bir nefes.
        </Text>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Mascot option ─────────────────────────────────────────────────────────────

const FIRE_BG     = '#251D17';
const FIRE_BORDER = '#3A2F25';
const FIRE_TEXT   = '#FBF7EF';

function MascotOption({
  type, selected, colors, onPress,
}: { type: MascotType; selected: boolean; colors: Colors; onPress: () => void }) {
  const isPlant = type === 'plant';
  const cardBg  = isPlant
    ? (selected ? colors.bgContent : colors.bgMain)
    : (selected ? FIRE_BG : '#181210');
  const cardBorder = isPlant
    ? (selected ? colors.primary : colors.hairline)
    : (selected ? '#E08456' : FIRE_BORDER);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        mo.card,
        { backgroundColor: cardBg, borderColor: cardBorder, borderWidth: selected ? 2 : 1 },
      ]}
    >
      {isPlant
        ? <Plant    stage={3} size={80} animate={false} />
        : <Campfire stage={3} size={80} animate={false} />
      }
      <Text style={[mo.name, { color: isPlant ? colors.textMain : FIRE_TEXT, fontFamily: 'Georgia' }]}>
        {isPlant ? 'Bitki' : 'Ateş'}
      </Text>
      <Text style={[mo.desc, { color: isPlant ? colors.textMuted : '#9A8F80' }]}>
        {isPlant ? 'Sessiz. Sabit hızda.' : 'Canlı. Hareketli.'}
      </Text>
      {selected && (
        <View style={[mo.check, { backgroundColor: isPlant ? colors.primary : '#E08456' }]}>
          <Svg width={12} height={12} viewBox="0 0 12 12">
            <Path d="M2 6l3 3 5-5" stroke="#FBF7EF"
              strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
      )}
    </TouchableOpacity>
  );
}

const mo = StyleSheet.create({
  card: {
    flex: 1, alignItems: 'center',
    paddingVertical: 16, paddingHorizontal: 10,
    borderRadius: 26, gap: 4,
  },
  name: { fontSize: 20 },
  desc: { fontSize: 11, textAlign: 'center' },
  check: {
    position: 'absolute', top: 12, right: 12,
    width: 22, height: 22, borderRadius: 11,
    justifyContent: 'center', alignItems: 'center',
  },
});

// ── Section title ─────────────────────────────────────────────────────────────

function SectionTitle({ label, colors }: { label: string; colors: Colors }) {
  return (
    <Text style={[st.label, { color: colors.textSub, fontFamily: 'Georgia' }]}>{label}</Text>
  );
}
const st = StyleSheet.create({
  label: { fontSize: 18, paddingHorizontal: 22, paddingTop: 26, paddingBottom: 10, letterSpacing: -0.2 },
});

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 6 },
  headerTitle: { fontSize: 32, letterSpacing: -0.8, lineHeight: 36 },
  headerSub: { fontSize: 13, marginTop: 4 },

  profileCard: {
    marginHorizontal: 18, marginTop: 20,
    borderRadius: 28, borderWidth: 1, overflow: 'hidden',
  },
  profileTop: {
    flexDirection: 'row', alignItems: 'center',
    gap: 16, padding: 22,
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 26 },
  since: { fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 2 },
  stepsCount: { fontSize: 22, lineHeight: 26 },

  statStrip: {
    flexDirection: 'row', borderTopWidth: 1,
    paddingVertical: 16,
  },
  statCell: { flex: 1, alignItems: 'flex-start', paddingHorizontal: 22 },
  statVal: { fontSize: 22, lineHeight: 26 },
  statLabel: { fontSize: 11, marginTop: 4 },

  authBtn: {
    marginHorizontal: 18, marginTop: 14,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16, borderRadius: 16, borderWidth: 1,
  },
  authBtnText: { fontSize: 14, fontWeight: '500' },

  listCard: {
    marginHorizontal: 18,
    borderRadius: 22, borderWidth: 1,
    overflow: 'hidden',
  },
  listRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14, gap: 14,
  },
  rowTitle: { fontSize: 14, fontWeight: '500' },
  rowSub: { fontSize: 11, marginTop: 2 },

  mascotRow: {
    flexDirection: 'row', paddingHorizontal: 18, gap: 14,
  },

  freezeBadge: {
    width: 32, height: 32, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  freezeNum: { fontSize: 16, fontWeight: '800' },

  footer: {
    textAlign: 'center', fontSize: 14, fontStyle: 'italic',
    marginTop: 36, marginBottom: 0,
  },
});
