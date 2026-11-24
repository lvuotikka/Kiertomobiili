import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Ilmoitusten näyttäminen sovelluksen ollessa auki
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Pyydetään lupa ilmoitusten lähettämiseen
export async function requestNotificationPermission() {
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Kierto-muistutukset',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return true;
}

// Perutaan tietyn tunnisteen mukaiset ilmoitukset
async function cancelReminder(tag: string) {
  const scheduled =
    await Notifications.getAllScheduledNotificationsAsync();

  const matchingNotifications = scheduled.filter(
    (notification) => notification.content.data?.tag === tag
  );

  for (const notification of matchingNotifications) {
    await Notifications.cancelScheduledNotificationAsync(
      notification.identifier
    );
  }
}

// Ajastetaan päivittäinen hyvinvointimuistutus klo 20
export async function scheduleWellbeingReminder() {
  await cancelReminder('wellbeing');

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Pieni hetki itsellesi',
      body: 'Muista kirjata tämän päivän kuulumiset Kiertoon.',
      data: { tag: 'wellbeing' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });
}

// Ajastetaan muistutus päivää ennen seuraavia kuukautisia
export async function schedulePeriodReminder(
  periodStartDate: string,
  cycleLength: number
) {
  await cancelReminder('period');

  if (!periodStartDate || cycleLength < 21 || cycleLength > 38) {
    return;
  }

  const [year, month, day] = periodStartDate.split('-').map(Number);

  const startDate = new Date(year, month - 1, day);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const daysSinceStart = Math.floor(
    (today.getTime() - startDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Selvitetään seuraavan kierron alkamispäivä
  const cyclesPassed =
    daysSinceStart < 0
      ? 0
      : Math.floor(daysSinceStart / cycleLength) + 1;

  const nextPeriodDate = new Date(startDate);

  nextPeriodDate.setDate(
    nextPeriodDate.getDate() + cyclesPassed * cycleLength
  );

  // Muistutus päivää ennen klo 10
  nextPeriodDate.setDate(nextPeriodDate.getDate() - 1);
  nextPeriodDate.setHours(10, 0, 0, 0);

  if (nextPeriodDate.getTime() <= Date.now()) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Kuukautiset lähestyvät',
      body: 'Kalenterisi mukaan kuukautisten arvioitu alkaminen lähestyy.',
      data: { tag: 'period' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: nextPeriodDate,
    },
  });
}

// Perutaan kaikki Kierto-sovelluksen muistutukset
export async function cancelAllKiertoReminders() {
  await cancelReminder('wellbeing');
  await cancelReminder('period');
}

// Perutaan vain hyvinvointimuistutus
export async function cancelWellbeingReminder() {
  await cancelReminder('wellbeing');
}

// Perutaan vain kuukautismuistutus
export async function cancelPeriodReminder() {
  await cancelReminder('period');
}