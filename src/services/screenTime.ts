import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleBackgroundFetch(notificationTime: string): Promise<void> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    const [hours, minutes] = notificationTime.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'HabitFlow Hatırlatıcısı',
        body: 'Bugün tamamlanmamış hedeflerin var! Hemen kontrol et!',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      },
    });
  } catch (e) {
    console.warn('Notification scheduling failed:', e);
  }
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
