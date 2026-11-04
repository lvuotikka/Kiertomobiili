import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  PaperProvider,
  Text,
  TextInput,
  MD3LightTheme,
} from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import type { DateData } from 'react-native-calendars';

//teema
const kiertoTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#9AA58B',
    secondary: '#702D3C',
    background: '#292A27',
    surface: '#F0E5CB',
    onSurface: '#292A27',
    outline: '#C9BFAE',
  },
};

//kalenterin kuukaudet ja päivät
LocaleConfig.locales.fi = {
  monthNames: [
    'Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu',
    'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu',
    'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu',
  ],
  monthNamesShort: [
    'Tammi', 'Helmi', 'Maalis', 'Huhti', 'Touko', 'Kesä',
    'Heinä', 'Elo', 'Syys', 'Loka', 'Marras', 'Joulu',
  ],
  dayNames: [
    'Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko',
    'Torstai', 'Perjantai', 'Lauantai',
  ],
  dayNamesShort: ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'],
  today: 'Tänään',
};

LocaleConfig.defaultLocale = 'fi';

// Kierron vaiheet ja värit
function getCyclePhase(day: number, cycleLength: number) {
  if (day <= 5) {
    return {
      name: 'Kuukautiset',
      color: '#702D3C',
    };
  }

  if (day <= cycleLength - 15) {
    return {
      name: 'Follikulaarivaihe',
      color: '#C5C5C0',
    };
  }

  if (day <= cycleLength - 12) {
    return {
      name: 'Arvioitu ovulaatio',
      color: '#C8BDA8',
    };
  }

  return {
    name: 'Luteaalivaihe',
    color: '#594131',
  };
}

// Kierron vaiheiden tiedot
const cyclePhases = [
  {
    name: 'Kuukautiset',
    color: '#702D3C',
    days: 'Kiertopäivät 1-5',
    description: '*',
  },
  {
    name: 'Follikulaarivaihe',
    color: '#C5C5C0',
    days: 'Kuukautisten jälkeen',
    description: '*',
  },
  {
    name: 'Ovulaatio',
    color: '#C8BDA8',
    days: 'Keskellä kiertoa, arviolta',
    description: '*',
  },
  {
    name: 'Luteaalivaihe',
    color: '#594131',
    days: 'Ovulaation jälkeen',
    description: '*',
  },
];

// Sovelluksen pääkomponentti
export default function App() {
  const [periodStartDate, setPeriodStartDate] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [activeTab, setActiveTab] = useState('calendar');

  // Kierron pituuden validointi
  const validCycleLength =
    /^\d+$/.test(cycleLength) &&
    Number(cycleLength) >= 21 &&
    Number(cycleLength) <= 38;

  const markedDates: Record<string, any> = {};

  // Väritetään kierron päivät alkamispäivästä eteenpäin
  if (periodStartDate && validCycleLength) {
    const [year, month, day] = periodStartDate.split('-').map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, day));

    for (let offset = 0; offset < 366; offset++) {
      const date = new Date(startDate);
      date.setUTCDate(startDate.getUTCDate() + offset);

      const dateKey = [
        date.getUTCFullYear(),
        String(date.getUTCMonth() + 1).padStart(2, '0'),
        String(date.getUTCDate()).padStart(2, '0'),
      ].join('-');

      const cycleDay = (offset % Number(cycleLength)) + 1;
      const phase = getCyclePhase(cycleDay, Number(cycleLength));

      markedDates[dateKey] = {
        customStyles: {
          container: {
            backgroundColor: phase.color,
            borderRadius: 18,
            ...(offset === 0
              ? { borderWidth: 2, borderColor: '#9AA58B' }
              : {}),
          },
          text: {
            color:
              phase.name === 'Kuukautiset' ||
              phase.name === 'Luteaalivaihe'
                ? '#FFFFFF'
                : '#292A27',
            fontWeight: offset === 0 ? 'bold' : 'normal',
          },
        },
      };
    }
  }

  // Etusivun kalenterinäkymä
  function renderCalendar() {
    return (
      <>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>* </Text>
          <Text style={styles.bodyText}>
            *
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Kiertokalenteri</Text>

          <Text style={styles.bodyText}>
            Valitse viimeisimpien kuukautistesi alkamispäivä.
          </Text>

          <Text style={styles.inputLabel}>
            Kierron pituus päivinä (21-38)
          </Text>

          <TextInput
            style={styles.cycleInput}
            value={cycleLength}
            onChangeText={setCycleLength}
            keyboardType="number-pad"
            placeholder="28"
            maxLength={2}
            mode="outlined"
            outlineColor="#C9BFAE"
            activeOutlineColor="#78816B"
            textColor="#292A27"
          />

          {!validCycleLength && (
            <Text style={styles.errorText}>
              Anna kokonaisluku väliltä 21-38.
            </Text>
          )}

          <Calendar
            onDayPress={(day: DateData) => {
              setPeriodStartDate(day.dateString);
            }}
            markingType="custom"
            markedDates={markedDates}
            enableSwipeMonths
            theme={{
              calendarBackground: '#F0E5CB',
              textSectionTitleColor: '#51483F',
              monthTextColor: '#292A27',
              arrowColor: '#51483F',
              todayTextColor: '#78816B',
              dayTextColor: '#292A27',
              textDayFontSize: 15,
              textMonthFontSize: 18,
              textMonthFontWeight: 'bold',
            }}
          />

          {periodStartDate !== '' && (
            <View style={styles.selectedDateBox}>
              <Text style={styles.selectedDateLabel}>
                Kuukautisten alkamispäivä
              </Text>

              <Text style={styles.selectedDate}>
                {periodStartDate}
              </Text>

              <Text style={styles.bodyText}>
                Kiertopäivä 1 - kierron laskenta alkaa tästä.
              </Text>
            </View>
          )}

          <Text style={styles.legendTitle}>Kierron vaiheet</Text>

          {cyclePhases.map((phase) => (
            <View key={phase.name} style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: phase.color },
                ]}
              />
              <Text style={styles.bodyText}>{phase.name}</Text>
            </View>
          ))}

          <Text style={styles.disclaimer}>
            Vaiheet ja ovulaatio ovat arvioita. Todellinen kierto voi
            poiketa kalenterin ennusteesta.
          </Text>
        </View>
      </>
    );
  }

  // Kierron vaiheiden tietonäkymä
  function renderPhases() {
    return (
      <>
        <View style={styles.introCard}>
          <Text style={styles.welcomeTitle}>Tutustu kiertoosi</Text>
          <Text style={styles.bodyText}>
            *
          </Text>
        </View>

        {cyclePhases.map((phase) => (
          <View
            key={phase.name}
            style={[
              styles.phaseCard,
              { borderLeftColor: phase.color },
            ]}
          >
            <View style={styles.phaseHeading}>
              <View style={styles.phaseHeadingText}>
                <Text style={styles.phaseTitle}>{phase.name}</Text>
                <Text style={styles.phaseDays}>{phase.days}</Text>
              </View>
            </View>

            <Text style={styles.bodyText}>{phase.description}</Text>
          </View>
        ))}
      </>
    );
  }

  // Hyvinvointinäkymä
  function renderWellbeing() {
    return (
      <>
        <View style={styles.introCard}>
          <Text style={styles.welcomeTitle}>*</Text>
          <Text style={styles.bodyText}>
            *
          </Text>
        </View>

        <View style={styles.wellbeingCard}>
          <Text style={styles.phaseTitle}>Ravinto</Text>
          <Text style={styles.bodyText}>
            *
          </Text>
        </View>

        <View style={styles.wellbeingCard}>
          <Text style={styles.phaseTitle}>*</Text>
          <Text style={styles.bodyText}>
            *
          </Text>
        </View>

        <View style={styles.wellbeingCard}>
          <Text style={styles.phaseTitle}>*</Text>
          <Text style={styles.bodyText}>
            *
          </Text>
        </View>

        <View style={styles.wellbeingCard}>
          <Text style={styles.phaseTitle}>*</Text>
          <Text style={styles.bodyText}>
            *
          </Text>
        </View>
      </>
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
            {activeTab === 'phases' && renderPhases()}
            {activeTab === 'wellbeing' && renderWellbeing()}
          </ScrollView>

          <View style={styles.bottomNav}>
            <Pressable
              style={[
                styles.navButton,
                activeTab === 'calendar' && styles.activeNavButton,
              ]}
              onPress={() => setActiveTab('calendar')}
            >
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={24}
                color={activeTab === 'calendar' ? '#51483F' : '#85857C'}
              />
              <Text
                style={[
                  styles.navLabel,
                  activeTab === 'calendar' && styles.activeNavLabel,
                ]}
              >
                Kalenteri
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.navButton,
                activeTab === 'phases' && styles.activeNavButton,
              ]}
              onPress={() => setActiveTab('phases')}
            >
              <MaterialCommunityIcons
                name="chart-donut"
                size={24}
                color={activeTab === 'phases' ? '#51483F' : '#85857C'}
              />
              <Text
                style={[
                  styles.navLabel,
                  activeTab === 'phases' && styles.activeNavLabel,
                ]}
              >
                Kierron vaiheet
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.navButton,
                activeTab === 'wellbeing' && styles.activeNavButton,
              ]}
              onPress={() => setActiveTab('wellbeing')}
            >
              <MaterialCommunityIcons
                name="heart-outline"
                size={24}
                color={activeTab === 'wellbeing' ? '#51483F' : '#85857C'}
              />
              <Text
                style={[
                  styles.navLabel,
                  activeTab === 'wellbeing' && styles.activeNavLabel,
                ]}
              >
                Hyvinvointi
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

//tyylit
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
  welcomeCard: {
    backgroundColor: '#F0E5CB',
    padding: 20,
    borderRadius: 20,
    gap: 8,
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
  card: {
    backgroundColor: '#F0E5CB',
    padding: 14,
    borderRadius: 20,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#292A27',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#51483F',
    marginTop: 4,
  },
  cycleInput: {
    backgroundColor: '#F0E5CB',
    borderWidth: 1,
    borderColor: '#C9BFAE',
    borderRadius: 10,
    padding: 12,
    color: '#292A27',
  },
  errorText: {
    fontSize: 13,
    color: '#B42345',
  },
  selectedDateBox: {
    backgroundColor: '#E5D8B8',
    padding: 14,
    borderRadius: 12,
    marginTop: 6,
    gap: 4,
  },
  selectedDateLabel: {
    fontSize: 13,
    color: '#625E56',
  },
  selectedDate: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#51483F',
    marginTop: 4,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#51483F',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  disclaimer: {
    fontSize: 12,
    lineHeight: 18,
    color: '#625E56',
    marginTop: 4,
  },
  phaseCard: {
    backgroundColor: '#F0E5CB',
    padding: 18,
    borderRadius: 18,
    borderLeftWidth: 5,
    gap: 12,
  },
  phaseHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  phaseHeadingText: {
    flex: 1,
    gap: 3,
  },
  phaseEmoji: {
    fontSize: 32,
  },
  phaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#51483F',
  },
  phaseDays: {
    fontSize: 12,
    color: '#625E56',
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#51483F',
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#625E56',
  },
  wellbeingCard: {
    backgroundColor: '#F0E5CB',
    padding: 20,
    borderRadius: 18,
    gap: 10,
  },
  wellbeingEmoji: {
    fontSize: 30,
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