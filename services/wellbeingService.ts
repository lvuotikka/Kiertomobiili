import {
  ref,
  onValue,
  set,
} from 'firebase/database';

import { database } from '../firebaseConfig';
import type { WellbeingEntry } from '../types/wellbeing';

// Haetaan hyvinvointimerkinnät Firebase-tietokannasta
export function subscribeToWellbeingEntries(
  onEntriesChange: (entries: Record<string, WellbeingEntry>) => void,
  onError: (error: Error) => void
) {
  const entriesRef = ref(database, 'wellbeingEntries');

  return onValue(
    entriesRef,
    (snapshot) => {
      const data = snapshot.val();
      onEntriesChange(data ?? {});
    },
    onError
  );
}

// Tallennetaan hyvinvointimerkintä Firebaseen
export function saveWellbeingEntry(
  date: string,
  entry: WellbeingEntry
) {
  const entryRef = ref(
    database,
    `wellbeingEntries/${date}`
  );

  return set(entryRef, entry);
}