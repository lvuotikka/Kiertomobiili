import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Switch } from 'react-native-paper';

// Hyvinvointimerkinnän tietorakenne
export type WellbeingEntry = {
  sleep: string;
  mood: number;
  symptoms: string;
  notes: string;
};

// Komponentille välitettävät tiedot
type WellbeingProps = {
  selectedDate: string;
  savedEntry?: WellbeingEntry;
  onSave: (entry: WellbeingEntry) => void;
  wellbeingReminder: boolean;
  periodReminder: boolean;
  onWellbeingReminderChange: (enabled: boolean) => void;
  onPeriodReminderChange: (enabled: boolean) => void;
};

export default function WellBeing({
  selectedDate,
  savedEntry,
  onSave,
  wellbeingReminder,
  periodReminder,
  onWellbeingReminderChange,
  onPeriodReminderChange,
}: WellbeingProps) {
  const [sleep, setSleep] = useState('');
  const [mood, setMood] = useState(3);
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');

  // Haetaan valitun päivän aiemmat merkinnät
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

  return (
    <View style={styles.container}>
      <View style={styles.introCard}>
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
        <Text style={styles.welcomeTitle}>
          Hyvinvointipäiväkirja
        </Text>

        <Text style={styles.bodyText}>
          Seuraa päivittäistä hyvinvointiasi ja huomaa,
          miten kierron eri vaiheet vaikuttavat oloosi.
        </Text>

        <Text style={styles.dateText}>
          {selectedDate}
        </Text>
      </View>

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
        style={styles.saveButton}
        contentStyle={styles.saveButtonContent}
      >
        Tallenna merkintä
      </Button>
    </View>
  );
}

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
});