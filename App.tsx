import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider, useAppContext } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import { scheduleBackgroundFetch } from './src/services/screenTime';

function AppContent() {
  const { notificationTime, notificationsEnabled, isLoading } = useAppContext();

  useEffect(() => {
    if (isLoading || !notificationsEnabled) return;
    scheduleBackgroundFetch(notificationTime).catch(() => {});
  }, [isLoading, notificationsEnabled, notificationTime]);

  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AppProvider>
  );
}
