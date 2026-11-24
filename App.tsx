import { useState, useEffect } from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  PaperProvider,
  Text,
} from 'react-native-paper';

import {
  subscribeToWellbeingEntries,
  saveWellbeingEntry as saveEntryToFirebase,
} from './services/wellbeingService';

import {
  loadCycleSettings,
  saveCycleSettings,
  loadReminderSettings,
  saveReminderSettings,
} from './services/settingsService';

import {
  createMarkedDates,
  getCycleDay,
  getCyclePhase,
} from './utils/cycleUtils';

import kiertoTheme from './theme/kiertoTheme';

import CyclePhases from './components/CyclePhases';
import CycleCalendar from './components/CycleCalendar';

import WellBeing from './components/WellBeing';
import type { WellbeingEntry } from './types/wellbeing';

import BottomNavigation from './components/BottomNavigation';

import {
  requestNotificationPermission,
  scheduleWellbeingReminder,
  schedulePeriodReminder,
  cancelWellbeingReminder,
  cancelPeriodReminder,
} from './services/notificationService';

// Sovelluksen pääkomponentti
export default function App() {
  const [periodStartDate, setPeriodStartDate] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [activeTab, setActiveTab] = useState('calendar');
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Muistutusten asetukset
  const [wellbeingReminder, setWellbeingReminder] = useState(false);
  const [periodReminder, setPeriodReminder] = useState(false);

  const [selectedDate, setSelectedDate] = useState('');

  // Hyvinvointipäiväkirjan merkinnät
  const [wellbeingEntries, setWellbeingEntries] = useState<
    Record<string, WellbeingEntry>
  >({});

  // Haetaan hyvinvointimerkinnät Firebase-tietokannasta
  useEffect(() => {
    const unsubscribe = subscribeToWellbeingEntries(
      (entries) => {
        setWellbeingEntries(entries);
      },
      (error) => {
        console.error(
          'Hyvinvointimerkintöjen hakeminen epäonnistui:',
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  // Haetaan tallennetut kierron ja muistutusten asetukset
  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await loadCycleSettings();

        if (settings) {
          setPeriodStartDate(settings.periodStartDate ?? '');
          setCycleLength(settings.cycleLength ?? '28');
        }

        const reminders = await loadReminderSettings();

        if (reminders) {
          setWellbeingReminder(
            reminders.wellbeingReminder ?? false
          );

          setPeriodReminder(
            reminders.periodReminder ?? false
          );
        }
      } catch (error) {
        console.error(
          'Asetusten hakeminen epäonnistui:',
          error
        );
      } finally {
        setSettingsLoaded(true);
      }
    }

    loadSettings();
  }, []);

  // Tallennetaan kierron tiedot aina niiden muuttuessa
  useEffect(() => {
    if (!settingsLoaded) {
      return;
    }

    saveCycleSettings({
      periodStartDate,
      cycleLength,
    }).catch((error) => {
      console.error(
        'Kierron tietojen tallennus epäonnistui:',
        error
      );
    });
  }, [periodStartDate, cycleLength, settingsLoaded]);

  // Tallennetaan hyvinvointimerkintä Firebaseen
  function saveWellbeingEntry(entry: WellbeingEntry) {
    if (!selectedDate) {
      return;
    }

    saveEntryToFirebase(selectedDate, entry)
      .then(() => {
        setWellbeingEntries((prev) => ({
          ...prev,
          [selectedDate]: entry,
        }));
      })
      .catch((error) => {
        console.error(
          'Merkinnän tallennus epäonnistui:',
          error
        );
      });
  }

  // Kierron pituuden validointi
  const validCycleLength =
    /^\d+$/.test(cycleLength) &&
    Number(cycleLength) >= 21 &&
    Number(cycleLength) <= 38;

  // Kalenterin merkinnät
  const markedDates = validCycleLength
    ? createMarkedDates(periodStartDate, Number(cycleLength))
    : {};

  // Lasketaan tämänhetkinen kiertopäivä ja kierron vaihe
  const currentCycleDay = validCycleLength
    ? getCycleDay(periodStartDate, Number(cycleLength))
    : null;

  const currentPhase =
    currentCycleDay !== null
      ? getCyclePhase(currentCycleDay, Number(cycleLength))
      : null;

  // Hyvinvointipäiväkirjan muistutuksen kytkeminen
  async function handleWellbeingReminder(enabled: boolean) {
    if (enabled) {
      const permissionGranted = await requestNotificationPermission();

      if (!permissionGranted) {
        Alert.alert(
          'Ilmoituslupa tarvitaan',
          'Salli ilmoitukset puhelimen asetuksista, jotta voit ottaa muistutuksen käyttöön.'
        );
        return;
      }
    }

    setWellbeingReminder(enabled);

    try {
      await saveReminderSettings({
        wellbeingReminder: enabled,
        periodReminder,
      });
    } catch (error) {
      console.error(
        'Muistutusasetusten tallennus epäonnistui:',
        error
      );
    }
  }

  // Kuukautismuistutuksen kytkeminen
  async function handlePeriodReminder(enabled: boolean) {
    if (enabled) {
      if (!periodStartDate || !validCycleLength) {
        Alert.alert(
          'Kierron tiedot puuttuvat',
          'Aseta ensin kuukautisten alkamispäivä ja kelvollinen kierron pituus kalenterissa.'
        );
        return;
      }

      const permissionGranted = await requestNotificationPermission();

      if (!permissionGranted) {
        Alert.alert(
          'Ilmoituslupa tarvitaan',
          'Salli ilmoitukset puhelimen asetuksista, jotta voit ottaa muistutuksen käyttöön.'
        );
        return;
      }
    }

    setPeriodReminder(enabled);

    try {
      await saveReminderSettings({
        wellbeingReminder,
        periodReminder: enabled,
      });
    } catch (error) {
      console.error(
        'Muistutusasetusten tallennus epäonnistui:',
        error
      );
    }
  }

  // Ajastetaan tai perutaan päivittäinen hyvinvointimuistutus
  useEffect(() => {
    if (!settingsLoaded) {
      return;
    }

    if (wellbeingReminder) {
      scheduleWellbeingReminder().catch((error: unknown) => {
        console.error(
          'Hyvinvointimuistutuksen ajastaminen epäonnistui:',
          error
        );
      });
    } else {
      cancelWellbeingReminder().catch((error: unknown) => {
        console.error(
          'Hyvinvointimuistutuksen peruuttaminen epäonnistui:',
          error
        );
      });
    }
  }, [wellbeingReminder, settingsLoaded]);

  // Ajastetaan tai perutaan kuukautismuistutus
  useEffect(() => {
    if (!settingsLoaded) {
      return;
    }

    if (periodReminder && periodStartDate && validCycleLength) {
      schedulePeriodReminder(
        periodStartDate,
        Number(cycleLength)
      ).catch((error: unknown) => {
        console.error(
          'Kuukautismuistutuksen ajastaminen epäonnistui:',
          error
        );
      });
    } else {
      cancelPeriodReminder().catch((error: unknown) => {
        console.error(
          'Kuukautismuistutuksen peruuttaminen epäonnistui:',
          error
        );
      });
    }
  }, [
    periodReminder,
    periodStartDate,
    cycleLength,
    validCycleLength,
    settingsLoaded,
  ]);

  // Etusivun kalenterinäkymä
  function renderCalendar() {
    return (
      <CycleCalendar
        periodStartDate={periodStartDate}
        selectedDate={selectedDate}
        cycleLength={cycleLength}
        setCycleLength={setCycleLength}
        validCycleLength={validCycleLength}
        markedDates={markedDates}
        onSelectDate={setSelectedDate}
        onSetPeriodStartDate={setPeriodStartDate}
        currentCycleDay={currentCycleDay}
        currentPhase={currentPhase}
      />
    );
  }

  // Otsikko vaihtuu valitun välilehden mukaan
  const pageTitle =
    activeTab === 'calendar'
      ? 'Kierto.'
      : activeTab === 'phases'
        ? 'Kierron vaiheet'
        : 'Hyvinvointi';

  return (
    <PaperProvider theme={kiertoTheme}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.app}>
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>{pageTitle}</Text>

              <Text style={styles.subtitle}>
                Kuukautiskierron kalenteri
              </Text>
            </View>

            {activeTab === 'calendar' && renderCalendar()}

            {activeTab === 'phases' && <CyclePhases />}

            {activeTab === 'wellbeing' && (
              <WellBeing
                selectedDate={selectedDate}
                savedEntry={wellbeingEntries[selectedDate]}
                entries={wellbeingEntries}
                onSave={saveWellbeingEntry}
                wellbeingReminder={wellbeingReminder}
                periodReminder={periodReminder}
                onWellbeingReminderChange={handleWellbeingReminder}
                onPeriodReminderChange={handlePeriodReminder}
              />
            )}
          </ScrollView>

          <BottomNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

// Tyylit
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#292A27',
  },
  app: {
    flex: 1,
    backgroundColor: '#292A27',
  },
  container: {
    padding: 18,
    paddingBottom: 24,
    gap: 18,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#F0E5CB',
  },
  subtitle: {
    fontSize: 15,
    color: '#C5C5C0',
    marginTop: 6,
    textAlign: 'center',
  },
});