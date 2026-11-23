import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';

export type WellbeingEntry = {
  sleep: string;
  mood: number;
  symptoms: string;
  notes: string;
};

type WellBeingProps = {
  selectedDate: string;
  savedEntry?: WellbeingEntry;
  onSave: (entry: WellbeingEntry) => void;
};

export default function Wellbeing({
  selectedDate,
  savedEntry,
  onSave,
}: WellBeingProps) {
  const [sleep, setSleep] = useState(savedEntry?.sleep ?? '');
  const [mood, setMood] = useState(savedEntry?.mood ?? 3);
  const [symptoms, setSymptoms] = useState(savedEntry?.symptoms ?? '');
  const [notes, setNotes] = useState(savedEntry?.notes ?? '');

  function handleSave() {
    onSave({
      sleep,
      mood,
      symptoms,
      notes,
    });
  }

  return (
    <>
      <View style={styles.introCard}>
        <Text style={styles.welcomeTitle}>Hyvinvointipäiväkirja</Text>
        <Text style={styles.bodyText}>
          Seuraa omaa hyvinvointiasi ja huomaa, miten kierron eri
          vaiheet voivat vaikuttaa oloosi.
        </Text>
      </View>

      <View style={styles.wellbeingCard}>
        <Text style={styles.phaseTitle}>Päivän merkintä</Text>

        <Text style={styles.bodyText}>
          Valittu päivä: {selectedDate || 'Ei valittua päivää'}
        </Text>

        {!selectedDate ? (
          <Text style={styles.bodyText}>
            Valitse ensin päivä kalenterista, jotta voit tehdä merkinnän.
          </Text>
        ) : (
          <>
            <Text style={styles.inputLabel}>Unen määrä (tuntia)</Text>
            <TextInput
              mode="outlined"
              value={sleep}
              onChangeText={setSleep}
              keyboardType="decimal-pad"
              placeholder="Esim. 8"
              outlineColor="#C9BFAE"
              activeOutlineColor="#78816B"
              textColor="#292A27"
              style={styles.input}
            />

            <Text style={styles.inputLabel}>Mieliala</Text>
            <View style={styles.moodContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  mode={mood === value ? 'contained' : 'outlined'}
                  onPress={() => setMood(value)}
                  buttonColor={mood === value ? '#78816B' : undefined}
                  textColor={mood === value ? '#FFFFFF' : '#51483F'}
                  style={styles.moodButton}
                  compact
                >
                  {String(value)}
                </Button>
              ))}
            </View>

            <Text style={styles.bodyText}>
              1 = erittäin huono, 5 = erittäin hyvä
            </Text>

            <Text style={styles.inputLabel}>Oireet ja tuntemukset</Text>
            <TextInput
              mode="outlined"
              value={symptoms}
              onChangeText={setSymptoms}
              placeholder="Esim. päänsärky, väsymys, vatsakipu..."
              multiline
              outlineColor="#C9BFAE"
              activeOutlineColor="#78816B"
              textColor="#292A27"
              style={styles.input}
            />

            <Text style={styles.inputLabel}>Muistiinpanot</Text>
            <TextInput
              mode="outlined"
              value={notes}
              onChangeText={setNotes}
              placeholder="Miltä päivä tuntui?"
              multiline
              numberOfLines={4}
              outlineColor="#C9BFAE"
              activeOutlineColor="#78816B"
              textColor="#292A27"
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleSave}
              buttonColor="#78816B"
              textColor="#FFFFFF"
              style={styles.saveButton}
            >
              Tallenna merkintä
            </Button>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#51483F',
    marginTop: 4,
  },
  input: {
    backgroundColor: '#F0E5CB',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  moodButton: {
    flex: 1,
    borderColor: '#C9BFAE',
  },
  saveButton: {
    marginTop: 12,
    borderRadius: 10,
  },
});