
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import type { DateData } from 'react-native-calendars';

import { cyclePhases } from '../data/cyclePhases';

// Kalenterin suomenkieliset kuukaudet ja päivät
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

type CycleCalendarProps = {
  periodStartDate: string;
  selectedDate: string;
  cycleLength: string;
  setCycleLength: (value: string) => void;
  validCycleLength: boolean;
  markedDates: Record<string, any>;
  onSelectDate: (date: string) => void;
  onSetPeriodStartDate: (date: string) => void;
};

export default function CycleCalendar({
  periodStartDate,
  selectedDate,
  cycleLength,
  setCycleLength,
  validCycleLength,
  markedDates,
  onSelectDate,
  onSetPeriodStartDate,
}: CycleCalendarProps) {

  // Säilytetään kierron värit ja lisätään valitun päivän reunus
  const calendarMarkedDates = { ...markedDates };

  if (selectedDate) {
    const existing = calendarMarkedDates[selectedDate] ?? {
      customStyles: {
        container: {},
        text: {},
      },
    };

    calendarMarkedDates[selectedDate] = {
      ...existing,
      customStyles: {
        ...existing.customStyles,
        container: {
          ...existing.customStyles?.container,
          borderWidth: 2,
          borderColor: '#78816B',
        },
      },
    };
  }

  return (
    <>
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>*</Text>
        <Text style={styles.bodyText}>*</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Kiertokalenteri</Text>

        <Text style={styles.bodyText}>
          Valitse päivä nähdäksesi sen hyvinvointimerkinnät.
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
          firstDay={1}
          onDayPress={(day: DateData) => {
            onSelectDate(day.dateString);
          }}
          markingType="custom"
          markedDates={calendarMarkedDates}
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

        {selectedDate !== '' && (
          <View style={styles.selectedDateBox}>
            <Text style={styles.selectedDateLabel}>
              Valittu päivä
            </Text>

            <Text style={styles.selectedDate}>
              {selectedDate}
            </Text>

            {selectedDate !== periodStartDate && (
              <Button
                mode="outlined"
                textColor="#51483F"
                onPress={() => onSetPeriodStartDate(selectedDate)}
              >
                Aseta kuukautisten alkamispäiväksi
              </Button>
            )}
          </View>
        )}

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

const styles = StyleSheet.create({
  welcomeCard: {
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
    gap: 8,
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
});