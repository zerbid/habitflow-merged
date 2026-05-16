import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
  Share,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../context/AppContext';
import { darkColors, lightColors, Colors } from '../theme/colors';
import { calcLevel } from '../utils/helpers';
import { requestNotificationPermissions } from '../services/screenTime';

export default function SettingsScreen() {
  const ctx = useAppContext();
  const colors = ctx.theme === 'dark' ? darkColors : lightColors;
  const { level, currentXP } = calcLevel(ctx.userXP);
  const s = makeStyles(colors);

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
    try {
      await ctx.signIn();
    } catch {
      Alert.alert('Hata', 'Google ile giriş başarısız oldu.');
    }
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
    } catch {
      Alert.alert('Hata', 'Dışa aktarma başarısız.');
    }
  }

  function handleReset() {
    Alert.alert(
      'Tüm Verileri Sil',
      'TÜM verilerini silmek istediğine emin misin? Bu işlem geri alınamaz!',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil', style: 'destructive',
          onPress: async () => {
            await ctx.resetAllData();
            Alert.alert('Tamamlandı', 'Tüm veriler silindi.');
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.bgMain }]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Profile Hero ── */}
        <LinearGradient
          colors={[colors.gradientA, colors.gradientB]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={s.profileCard}
        >
          <View style={s.avatarWrap}>
            <Text style={s.avatarEmoji}>
              {ctx.user ? '👤' : '🌱'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.profileName}>
              {ctx.user ? (ctx.user.displayName ?? 'Kullanıcı') : 'Misafir Kullanıcı'}
            </Text>
            <Text style={s.profileSub}>
              {ctx.user ? (ctx.user.email ?? '') : 'Verilerini yedeklemek için giriş yap'}
            </Text>
            <View style={s.levelBadgeRow}>
              <View style={s.levelBadge}>
                <Text style={s.levelBadgeText}>⚡ Seviye {level}</Text>
              </View>
              <Text style={s.xpText}>{ctx.userXP} XP</Text>
            </View>
            <View style={s.xpBarBg}>
              <View style={[s.xpBarFill, { width: `${currentXP}%` as any }]} />
            </View>
          </View>
        </LinearGradient>

        {/* ── Auth button ── */}
        <View style={s.authRow}>
          <TouchableOpacity
            style={[s.authBtn, {
              backgroundColor: ctx.user ? colors.bgContent : colors.accent,
              borderColor: colors.border,
            }]}
            onPress={ctx.user ? handleSignOut : handleSignIn}
          >
            <Text style={[s.authBtnText, { color: ctx.user ? colors.danger : '#fff' }]}>
              {ctx.user ? '🚪  Hesaptan Çık' : '🔑  Google ile Giriş Yap'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Appearance ── */}
        <SectionLabel label="GÖRÜNÜM" colors={colors} />
        <View style={[s.card, { backgroundColor: colors.bgContent, borderColor: colors.border }]}>
          <View style={s.row}>
            <View style={[s.rowIcon, { backgroundColor: '#7c3aed22' }]}>
              <Text>🌙</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.rowTitle, { color: colors.textMain }]}>Karanlık Mod</Text>
              <Text style={[s.rowSub, { color: colors.textMuted }]}>
                {ctx.theme === 'dark' ? 'Aktif' : 'Kapalı'}
              </Text>
            </View>
            <Switch
              value={ctx.theme === 'dark'}
              onValueChange={val => ctx.setTheme(val ? 'dark' : 'light')}
              trackColor={{ true: colors.accent, false: colors.border }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* ── Notifications ── */}
        <SectionLabel label="BİLDİRİMLER" colors={colors} />
        <View style={[s.card, { backgroundColor: colors.bgContent, borderColor: colors.border }]}>
          <View style={[s.row, ctx.notificationsEnabled && { borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 16 }]}>
            <View style={[s.rowIcon, { backgroundColor: '#f59e0b22' }]}>
              <Text>🔔</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.rowTitle, { color: colors.textMain }]}>Günlük Hatırlatıcı</Text>
              <Text style={[s.rowSub, { color: colors.textMuted }]}>
                {ctx.notificationsEnabled ? `Her gün ${ctx.notificationTime}` : 'Kapalı'}
              </Text>
            </View>
            <Switch
              value={ctx.notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{ true: colors.accent, false: colors.border }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* ── Data ── */}
        <SectionLabel label="VERİ YÖNETİMİ" colors={colors} />
        <View style={[s.card, { backgroundColor: colors.bgContent, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[s.row, { borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 16 }]}
            onPress={handleExport}
          >
            <View style={[s.rowIcon, { backgroundColor: '#22c55e22' }]}>
              <Text>📤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.rowTitle, { color: colors.textMain }]}>Verileri Dışa Aktar</Text>
              <Text style={[s.rowSub, { color: colors.textMuted }]}>JSON formatında yedekle</Text>
            </View>
            <Text style={{ color: colors.textMuted, fontSize: 18 }}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.row} onPress={handleReset}>
            <View style={[s.rowIcon, { backgroundColor: '#f8514922' }]}>
              <Text>🗑</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.rowTitle, { color: colors.danger }]}>Tüm Verileri Sıfırla</Text>
              <Text style={[s.rowSub, { color: colors.textMuted }]}>Bu işlem geri alınamaz</Text>
            </View>
            <Text style={{ color: colors.textMuted, fontSize: 18 }}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ── App info ── */}
        <View style={s.footer}>
          <Text style={[s.footerText, { color: colors.textMuted }]}>HabitFlow v1.0.0</Text>
          <Text style={[s.footerText, { color: colors.textMuted }]}>Her gün bir adım 🚀</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({ label, colors }: { label: string; colors: Colors }) {
  return (
    <Text style={[secStyle.label, { color: colors.textMuted }]}>{label}</Text>
  );
}
const secStyle = StyleSheet.create({
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 1, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
});

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    container: { flex: 1 },

    // Profile card
    profileCard: {
      marginHorizontal: 20, marginTop: 20,
      borderRadius: 24, padding: 20,
      flexDirection: 'row', gap: 16, alignItems: 'flex-start',
    },
    avatarWrap: {
      width: 54, height: 54, borderRadius: 27,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center', alignItems: 'center',
    },
    avatarEmoji: { fontSize: 26 },
    profileName: { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 2 },
    profileSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 10 },
    levelBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    levelBadge: {
      paddingHorizontal: 8, paddingVertical: 3,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 10,
    },
    levelBadgeText: { fontSize: 12, fontWeight: '700', color: '#fff' },
    xpText: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
    xpBarBg: {
      height: 5, borderRadius: 3,
      backgroundColor: 'rgba(255,255,255,0.2)',
      overflow: 'hidden',
    },
    xpBarFill: {
      height: 5, borderRadius: 3,
      backgroundColor: 'rgba(255,255,255,0.9)',
    },

    // Auth button
    authRow: { paddingHorizontal: 20, marginTop: 12 },
    authBtn: {
      paddingVertical: 14, borderRadius: 16,
      alignItems: 'center', borderWidth: 1,
    },
    authBtnText: { fontSize: 15, fontWeight: '700' },

    // Cards
    card: {
      marginHorizontal: 20, borderRadius: 20,
      borderWidth: 1, overflow: 'hidden',
    },
    row: {
      flexDirection: 'row', alignItems: 'center',
      padding: 16, gap: 14,
    },
    rowIcon: {
      width: 40, height: 40, borderRadius: 13,
      justifyContent: 'center', alignItems: 'center',
    },
    rowTitle: { fontSize: 15, fontWeight: '600' },
    rowSub: { fontSize: 12, marginTop: 1 },

    // Footer
    footer: { alignItems: 'center', paddingTop: 32, gap: 4 },
    footerText: { fontSize: 12 },
  });
}
