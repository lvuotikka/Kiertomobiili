// Kierron vaiheiden tiedot
export const cyclePhases = [
  {
    name: 'Kuukautiset',
    color: '#702D3C',
    days: 'Kiertopäivät 1-5',
    description: 'Kuukautisten (vuotovaiheen) aikana kehossa tapahtuu useita hormonaalisia ja fysiologisia muutoksia. Koska edellisen kierron aikana mahdollisesti kehittynyt munasolu ei ole hedelmöittynyt, elimistön estrogeeni- ja progesteronitasot laskevat matalimmalle tasolleen. Tämän seurauksena paksuuntunut kohdun limakalvo alkaa irrota ja poistuu emättimen kautta. Vuoto sisältää verta, kohdun limakalvon jäänteitä ja limaa. Vuodon määrä on normaalisti noin 20–80 millilitraa, ja se kestää keskimäärin 2–8 päivää (useimmiten 3–5 päivää). Kierron alussa sukupuolihormonien (estrogeenin ja progesteronin) määrä on pienimmillään. Aivolisäke alkaa samalla erittää munarakkulaa kypsyttävää hormonia (FSH), mikä käynnistää uuden munasolun kehittymisen munasarjassa.',
    recipeSearchTerms: ['lentils', 'beef', 'spinach'],
  },
  {
    name: 'Follikulaarivaihe',
    color: '#C5C5C0',
    days: 'Kuukautisten jälkeen',
    description: `Follikulaarivaihe (follikkelivaihe) on kuukautiskierron ensimmäinen vaihe, joka alkaa kuukautisvuodon ensimmäisestä päivästä ja päättyy ovulaatioon. Vaihe kestää tyypillisesti noin 10–21 päivää riippuen kierron pituudesta.
    Aivolisäke alkaa erittää follikkelia stimuloivaa hormonia (FSH), joka kulkeutuu munasarjoihin.`,
    recipeSearchTerms: ['chicken', 'broccoli', 'eggs'],
  },
  {
    name: 'Ovulaatio',
    color: '#C8BDA8',
    days: 'Keskellä kiertoa, arviolta',
    description: '*',
    recipeSearchTerms: ['salmon', 'avocado', 'quinoa'],
  },
  {
    name: 'Luteaalivaihe',
    color: '#594131',
    days: 'Ovulaation jälkeen',
    description: '*',
    recipeSearchTerms: ['sweet potato', 'oats', 'banana'],
  },
];