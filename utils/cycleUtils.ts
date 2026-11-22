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