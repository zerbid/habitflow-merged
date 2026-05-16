import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppContext } from '../context/AppContext';
import { darkColors, lightColors } from '../theme/colors';
import DashboardScreen from '../screens/DashboardScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, label, focused, colors }: {
  emoji: string; label: string; focused: boolean;
  colors: typeof darkColors;
}) {
  return (
    <View style={[styles.tabItem, focused && { backgroundColor: colors.accentSoft }]}>
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
      <Text style={[styles.tabLabel, { color: focused ? colors.accent : colors.textMuted }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 18, paddingVertical: 6,
    borderRadius: 16, gap: 2,
  },
  tabLabel: { fontSize: 10, fontWeight: '700' },
});

export default function AppNavigator() {
  const { theme } = useAppContext();
  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgContent,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📋" label="Alışkanlıklar" focused={focused} colors={colors} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚙️" label="Ayarlar" focused={focused} colors={colors} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
