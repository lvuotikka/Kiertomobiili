import AsyncStorage from '@react-native-async-storage/async-storage';

// Asetusten tietorakenteet
export type CycleSettings = {
  periodStartDate: string;
  cycleLength: string;
};

export type ReminderSettings = {
  wellbeingReminder: boolean;
  periodReminder: boolean;
};

// Haetaan kierron asetukset
export async function loadCycleSettings(): Promise<CycleSettings | null> {
  const savedSettings = await AsyncStorage.getItem('cycleSettings');

  return savedSettings ? JSON.parse(savedSettings) : null;
}

// Tallennetaan kierron asetukset
export async function saveCycleSettings(settings: CycleSettings) {
  await AsyncStorage.setItem(
    'cycleSettings',
    JSON.stringify(settings)
  );
}

// Haetaan muistutusasetukset
export async function loadReminderSettings(): Promise<ReminderSettings | null> {
  const savedReminders = await AsyncStorage.getItem('reminderSettings');

  return savedReminders ? JSON.parse(savedReminders) : null;
}

// Tallennetaan muistutusasetukset
export async function saveReminderSettings(settings: ReminderSettings) {
  await AsyncStorage.setItem(
    'reminderSettings',
    JSON.stringify(settings)
  );
}