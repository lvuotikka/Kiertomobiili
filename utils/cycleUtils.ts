// Kierron vaiheen tietotyyppi
type CyclePhase = {
  name: string;
  color: string;
};

// Kalenterin yksittäisen merkinnän tietotyyppi
type MarkedDate = {
  customStyles: {
    container: {
      backgroundColor: string;
      borderRadius: number;
      borderWidth?: number;
      borderColor?: string;
    };
    text: {
      color: string;
      fontWeight: 'bold' | 'normal';
    };
  };
};

// Tarkistetaan, että kierron pituus on sallituissa rajoissa
function isValidCycleLength(cycleLength: number): boolean {
  return (
    Number.isInteger(cycleLength) &&
    cycleLength >= 21 &&
    cycleLength <= 38
  );
}

// Muutetaan päivämäärä UTC-muotoon
function parseDate(dateString: string): Date | null {
  const dateParts = dateString.split('-');

  if (dateParts.length !== 3) {
    return null;
  }

  const [year, month, day] = dateParts.map(Number);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return null;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  // Tarkistetaan, että päivämäärä on oikeasti olemassa
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

// Kierron vaiheen laskeminen kiertopäivän perusteella
export function getCyclePhase(
  day: number,
  cycleLength: number
): CyclePhase {
  if (day <= 5) {
    return {
      name: 'Kuukautiset',
      color: '#702D3C',
    };
  } else if (day <= cycleLength - 15) {
    return {
      name: 'Follikulaarivaihe',
      color: '#C5C5C0',
    };
  } else if (day <= cycleLength - 12) {
    return {
      name: 'Arvioitu ovulaatio',
      color: '#C8BDA8',
    };
  } else {
    return {
      name: 'Luteaalivaihe',
      color: '#594131',
    };
  }
}

// Lasketaan tämänhetkinen kiertopäivä
export function getCycleDay(
  periodStartDate: string,
  cycleLength: number
): number | null {
  if (!periodStartDate || !isValidCycleLength(cycleLength)) {
    return null;
  }

  const startDate = parseDate(periodStartDate);

  if (!startDate) {
    return null;
  }

  // Käytetään UTC-aikaa aikavyöhykeongelmien välttämiseksi
  const today = new Date();

  const todayDate = new Date(
    Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )
  );

  const difference = Math.floor(
    (todayDate.getTime() - startDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Aloituspäivä ei voi olla tulevaisuudessa
  if (difference < 0) {
    return null;
  }

  return (difference % cycleLength) + 1;
}

// Luodaan kalenterin värilliset päivämäärämerkinnät
export function createMarkedDates(
  periodStartDate: string,
  cycleLength: number
): Record<string, MarkedDate> {
  const markedDates: Record<string, MarkedDate> = {};

  if (!periodStartDate || !isValidCycleLength(cycleLength)) {
    return markedDates;
  }

  const startDate = parseDate(periodStartDate);

  if (!startDate) {
    return markedDates;
  }

  // Luodaan merkinnät seuraavalle 366 päivälle
  for (let offset = 0; offset < 366; offset++) {
    const date = new Date(startDate);

    date.setUTCDate(startDate.getUTCDate() + offset);

    const dateKey = [
      date.getUTCFullYear(),
      String(date.getUTCMonth() + 1).padStart(2, '0'),
      String(date.getUTCDate()).padStart(2, '0'),
    ].join('-');

    // Lasketaan kiertopäivä ja sitä vastaava vaihe
    const cycleDay = (offset % cycleLength) + 1;
    const phase = getCyclePhase(cycleDay, cycleLength);

    markedDates[dateKey] = {
      customStyles: {
        container: {
          backgroundColor: phase.color,
          borderRadius: 18,
          ...(offset === 0
            ? {
                borderWidth: 2,
                borderColor: '#9AA58B',
              }
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

  return markedDates;
}