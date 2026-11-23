// Kierron vaiheen laskeminen kiertopäivän perusteella

export function getCyclePhase(day: number, cycleLength: number) {
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
export function getCycleDay(periodStartDate: string, cycleLength: number) {
  if (!periodStartDate || cycleLength < 21 || cycleLength > 38) {
    return null;
  }

  // Käytetään päivämäärissä UTC-aikaa aikavyöhykeongelmien välttämiseksi
  const [year, month, day] = periodStartDate.split('-').map(Number);
  const startDate = new Date(Date.UTC(year, month - 1, day));

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

export function createMarkedDates(
  periodStartDate: string,
  cycleLength: number
): Record<string, any> {
  const markedDates: Record<string, any> = {};

  if (!periodStartDate || cycleLength < 21 || cycleLength > 38) {
    return markedDates;
  }

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

    const cycleDay = (offset % cycleLength) + 1;
    const phase = getCyclePhase(cycleDay, cycleLength);

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

  return markedDates;
}