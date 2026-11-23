import { useState, useEffect } from 'react';

import {
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
  ref,
  onValue,
  set,
} from 'firebase/database';

import { database } from './firebaseConfig';

import { createMarkedDates } from './utils/cycleUtils';
import kiertoTheme from './theme/kiertoTheme';

import CyclePhases from './components/CyclePhases';
import CycleCalendar from './components/CycleCalendar';
import WellBeing, {
  type WellbeingEntry,
} from './components/WellBeing';
import BottomNavigation from './components/BottomNavigation';

// Sovelluksen pääkomponentti
export default function App() {
  const [periodStartDate, setPeriodStartDate] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [activeTab, setActiveTab] = useState('calendar');

  const [selectedDate, setSelectedDate] = useState('');

  // Hyvinvointipäiväkirjan merkinnät
  const [wellbeingEntries, setWellbeingEntries] = useState<
    Record<string, WellbeingEntry>
  >({});

  // Haetaan hyvinvointimerkinnät Firebase-tietokannasta
  useEffect(() => {
    const entriesRef = ref(database, 'wellbeingEntries');

    const unsubscribe = onValue(
      entriesRef,
      (snapshot) => {
        const data = snapshot.val();

        setWellbeingEntries(data ?? {});
      },
      (error) => {
        console.error(
          'Merkintöjen hakeminen epäonnistui:',
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  // Tallennetaan hyvinvointimerkintä Firebaseen
  function saveWellbeingEntry(entry: WellbeingEntry) {
    if (!selectedDate) {
      return;
    }

    const entryRef = ref(
      database,
      `wellbeingEntries/${selectedDate}`
    );

    set(entryRef, entry)
      .then(() => {
        // Päivitetään myös sovelluksen paikallinen tila
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

  const markedDates = validCycleLength
    ? createMarkedDates(periodStartDate, Number(cycleLength))
    : {};

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
                onSave={saveWellbeingEntry}
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
  introCard: {
    backgroundColor: '#F0E5CB',
    padding: 20,
    borderRadius: 20,
    gap: 8,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#51483F',
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#625E56',
  },
  phaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#51483F',
  },
  wellbeingCard: {
    backgroundColor: '#F0E5CB',
    padding: 20,
    borderRadius: 18,
    gap: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#F0E5CB',
    borderTopWidth: 1,
    borderTopColor: '#C9BFAE',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 8,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 3,
    borderRadius: 12,
    gap: 4,
  },
  activeNavButton: {
    backgroundColor: '#E5D8B8',
  },
  navLabel: {
    fontSize: 11,
    color: '#625E56',
    textAlign: 'center',
  },
  activeNavLabel: {
    color: '#51483F',
    fontWeight: 'bold',
  },
});