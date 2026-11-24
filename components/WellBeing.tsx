import { useEffect, useState } from 'react';

import {
  Pressable,
  View,
  StyleSheet,
} from 'react-native';

import {
  Text,
  TextInput,
  Button,
  Switch,
} from 'react-native-paper';

import type { WellbeingEntry } from '../types/wellbeing';

// Komponentille välitettävät tiedot
type WellbeingProps = {
  selectedDate: string;
  savedEntry?: WellbeingEntry;
  entries: Record<string, WellbeingEntry>;
  onSave: (entry: WellbeingEntry) => void;
  wellbeingReminder: boolean;
  periodReminder: boolean;
  onWellbeingReminderChange: (enabled: boolean) => void;
  onPeriodReminderChange: (enabled: boolean) => void;
};

// Päivämäärän muotoilu suomalaiseen muotoon
function formatDate(date: string) {
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}`;
}
// Hyvinvointipäiväkirjan komponentti
export default function WellBeing({
  selectedDate,
  savedEntry,
  entries,
  onSave,
  wellbeingReminder,
  periodReminder,
  onWellbeingReminderChange,
  onPeriodReminderChange,
}: WellbeingProps) {
  // Oletusarvona mielialalle käytetään arvoa 3 asteikolla 1–5
  const [sleep, setSleep] = useState('');
  const [mood, setMood] = useState(3);
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');

  // Valitun historiamerkinnän päivämäärä
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  // Haetaan valitun päivän merkintä lomakkeeseen
  useEffect(() => {
    setSleep(savedEntry?.sleep ?? '');
    setMood(savedEntry?.mood ?? 3);
    setSymptoms(savedEntry?.symptoms ?? '');
    setNotes(savedEntry?.notes ?? '');
  }, [savedEntry, selectedDate]);

  // Tallennetaan merkintä
  const handleSave = () => {
    onSave({
      sleep,
      mood,
      symptoms,
      notes,
    });
  };

  // Aiemmat merkinnät uusimmasta vanhimpaan
  const previousEntries = Object.entries(entries)
    .filter(([date]) => date !== selectedDate)
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA));

  return (
    <View style={styles.container}>

      {/* Muistutusten asetukset */}
      <View style={styles.reminderCard}>
        <Text style={styles.phaseTitle}>Muistutukset</Text>

        <Text style={styles.bodyText}>
          Valitse, mistä asioista haluat saada muistutuksen.
        </Text>

        <View style={styles.reminderRow}>
          <View style={styles.reminderText}>
            <Text style={styles.reminderTitle}>
              Hyvinvointipäiväkirja
            </Text>

            <Text style={styles.reminderDescription}>
              Päivittäinen muistutus klo 20
            </Text>
          </View>

          <Switch
            value={wellbeingReminder}
            onValueChange={onWellbeingReminderChange}
            color="#702D3C"
          />
        </View>

        <View style={styles.reminderDivider} />

        <View style={styles.reminderRow}>
          <View style={styles.reminderText}>
            <Text style={styles.reminderTitle}>
              Kuukautisten lähestyminen
            </Text>

            <Text style={styles.reminderDescription}>
              Muistutus päivää ennen arvioitua alkamista
            </Text>
          </View>

          <Switch
            value={periodReminder}
            onValueChange={onPeriodReminderChange}
            color="#702D3C"
          />
        </View>
      </View>

      {/* Päiväkirjan esittely */}
      <View style={styles.introCard}>
        <Text style={styles.welcomeTitle}>
          Hyvinvointipäiväkirja
        </Text>

        <Text style={styles.bodyText}>
          Seuraa päivittäistä hyvinvointiasi ja huomaa,
          miten kierron eri vaiheet vaikuttavat oloosi.
        </Text>

        <Text style={styles.dateText}>
          {selectedDate ? formatDate(selectedDate) : 'Valitse päivä kalenterista'}
        </Text>
      </View>

      {/* Unen määrä */}
      <View style={styles.wellbeingCard}>
        <Text style={styles.phaseTitle}>Uni</Text>

        <Text style={styles.bodyText}>
          Kuinka monta tuntia nukuit viime yönä?
        </Text>

        <TextInput
          mode="outlined"
          label="Unen määrä (tuntia)"
          value={sleep}
          onChangeText={setSleep}
          keyboardType="decimal-pad"
          style={styles.input}
        />
      </View>

      {/* Mieliala */}
      <View style={styles.wellbeingCard}>
        <Text style={styles.phaseTitle}>Mieliala</Text>

        <Text style={styles.bodyText}>
          Millainen mielialasi on tänään?
        </Text>

        <View style={styles.moodContainer}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Button
              key={value}
              mode={mood === value ? 'contained' : 'outlined'}
              onPress={() => setMood(value)}
              compact
              style={styles.moodButton}
            >
              {value.toString()}
            </Button>
          ))}
        </View>

        <Text style={styles.bodyText}>
          1 = Erittäin huono · 5 = Erittäin hyvä
        </Text>
      </View>

      {/* Oireet */}
      <View style={styles.wellbeingCard}>
        <Text style={styles.phaseTitle}>Oireet ja tuntemukset</Text>

        <TextInput
          mode="outlined"
          label="Kirjaa päivän oireet"
          value={symptoms}
          onChangeText={setSymptoms}
          multiline
          numberOfLines={3}
          style={styles.input}
        />
      </View>

      {/* Muistiinpanot */}
      <View style={styles.wellbeingCard}>
        <Text style={styles.phaseTitle}>Muistiinpanot</Text>

        <TextInput
          mode="outlined"
          label="Muita huomioita päivästäsi..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          style={styles.input}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleSave}
        disabled={!selectedDate}
        style={styles.saveButton}
        contentStyle={styles.saveButtonContent}
      >
        Tallenna merkintä
      </Button>

      {/* Aiemmat merkinnät */}
      <View style={styles.historyCard}>
        <Text style={styles.historyTitle}>
          Aiemmat merkinnät
        </Text>

        <Text style={styles.bodyText}>
          Voit avata aiemman merkinnän ja tarkastella sen tietoja.
        </Text>

        {previousEntries.length === 0 ? (
          <Text style={styles.emptyText}>
            Aiemmin tallennettuja merkintöjä ei vielä ole.
          </Text>
        ) : (
          previousEntries.map(([date, entry]) => {
            const isExpanded = expandedDate === date;

            return (
              <View key={date} style={styles.historyItem}>
                <Pressable
                  onPress={() =>
                    setExpandedDate(isExpanded ? null : date)
                  }
                  style={styles.historyPressable}
                >
                  <View style={styles.historyHeader}>
                    <View style={styles.historyDateContainer}>
                      <Text style={styles.historyDate}>
                        {formatDate(date)}
                      </Text>

                      <Text style={styles.historySummary}>
                        Uni {entry.sleep || '–'} h
                        {'  ·  '}
                        Mieliala {entry.mood}/5
                      </Text>
                    </View>

                    <Text style={styles.expandIcon}>
                      {isExpanded ? '−' : '+'}
                    </Text>
                  </View>

                  <Text style={styles.historySymptoms}>
                    {entry.symptoms || 'Ei kirjattuja oireita'}
                  </Text>
                </Pressable>

                {isExpanded && (
                  <View style={styles.detailContainer}>
                    <View style={styles.detailDivider} />

                    <Text style={styles.detailLabel}>
                      Unen määrä
                    </Text>
                    <Text style={styles.detailText}>
                      {entry.sleep ? `${entry.sleep} tuntia` : 'Ei merkintää'}
                    </Text>

                    <Text style={styles.detailLabel}>
                      Mieliala
                    </Text>
                    <Text style={styles.detailText}>
                      {entry.mood}/5
                    </Text>

                    <Text style={styles.detailLabel}>
                      Oireet ja tuntemukset
                    </Text>
                    <Text style={styles.detailText}>
                      {entry.symptoms || 'Ei merkintää'}
                    </Text>

                    <Text style={styles.detailLabel}>
                      Muistiinpanot
                    </Text>
                    <Text style={styles.detailText}>
                      {entry.notes || 'Ei merkintää'}
                    </Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}
// Tyylit
const styles = StyleSheet.create({
  container: {
    gap: 14,
    paddingBottom: 24,
  },
  introCard: {
    backgroundColor: '#F5F0E8',
    padding: 20,
    borderRadius: 16,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#702D3C',
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 14,
    color: '#625B55',
    lineHeight: 21,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#702D3C',
    marginTop: 8,
  },
  wellbeingCard: {
    backgroundColor: '#F5F0E8',
    padding: 18,
    borderRadius: 16,
  },
  phaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#702D3C',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    marginTop: 6,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  moodButton: {
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: '#702D3C',
    borderRadius: 12,
  },
  saveButtonContent: {
    paddingVertical: 7,
  },
  reminderCard: {
    backgroundColor: '#F5F0E8',
    padding: 18,
    borderRadius: 16,
    gap: 12,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  reminderText: {
    flex: 1,
    gap: 4,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#51483F',
  },
  reminderDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: '#625B55',
  },
  reminderDivider: {
    height: 1,
    backgroundColor: '#D8CCBA',
  },
  historyCard: {
    backgroundColor: '#F5F0E8',
    padding: 18,
    borderRadius: 16,
    gap: 12,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#702D3C',
  },
  emptyText: {
    fontSize: 14,
    color: '#625B55',
    lineHeight: 21,
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  historyPressable: {
    padding: 14,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyDateContainer: {
    flex: 1,
    gap: 5,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#702D3C',
  },
  historySummary: {
    fontSize: 13,
    color: '#51483F',
  },
  historySymptoms: {
    fontSize: 13,
    color: '#625B55',
    marginTop: 8,
  },
  expandIcon: {
    fontSize: 25,
    color: '#702D3C',
    paddingHorizontal: 8,
  },
  detailContainer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 5,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#D8CCBA',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#702D3C',
    marginTop: 7,
  },
  detailText: {
    fontSize: 14,
    color: '#51483F',
    lineHeight: 21,
  },
});