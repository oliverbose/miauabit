export const languages = {
  en: {
    brand: 'meowabit', domain: 'meowabit.de', other: 'miauabit.de', otherLanguage: 'Deutsch',
    title: 'Two cats. One big map.', intro: 'Jacques & Xena’s journey to Berlin-Moabit',
    description: 'Follow two cats from Washington, D.C., across the Atlantic and on to Berlin-Moabit.',
    nextStop: 'Next stop', planned: 'Early 2027 · Planned', skip: 'Skip to the journey',
    map: 'Journey map', atlantic: 'Atlantic', usa: 'US East Coast', berlin: 'Berlin',
    ocean: 'NORTH ATLANTIC', play: 'Play journey', pause: 'Pause journey', replay: 'Replay journey',
    previous: 'Previous stop', next: 'Next stop', timeline: 'Journey timeline', gallery: 'From the photo album',
    previousPhoto: 'Previous photo', nextPhoto: 'Next photo', close: 'Close photo',
    photoNote: 'From the family album', cast: 'Jacques, 14 · Tuxedo\nXena, 8 · Brown tabby',
    distant: 'Schematic map', home: 'Home base', sideTrip: 'Side trip', siteLine: 'A family travelogue, told in pawprints.',
  },
  de: {
    brand: 'miauabit', domain: 'miauabit.de', other: 'meowabit.de', otherLanguage: 'English',
    title: 'Zwei Katzen. Eine große Reise.', intro: 'Jacques & Xena auf dem Weg nach Berlin-Moabit',
    description: 'Zwei Katzen reisen von Washington, D.C., über den Atlantik bis nach Berlin-Moabit.',
    nextStop: 'Nächster Halt', planned: 'Anfang 2027 · Geplant', skip: 'Zur Reise springen',
    map: 'Karte der Reise', atlantic: 'Atlantik', usa: 'US-Ostküste', berlin: 'Berlin',
    ocean: 'NORDATLANTIK', play: 'Reise abspielen', pause: 'Reise pausieren', replay: 'Reise erneut abspielen',
    previous: 'Vorheriger Halt', next: 'Nächster Halt', timeline: 'Stationen der Reise', gallery: 'Aus dem Fotoalbum',
    previousPhoto: 'Vorheriges Foto', nextPhoto: 'Nächstes Foto', close: 'Foto schließen',
    photoNote: 'Aus dem Familienalbum', cast: 'Jacques, 14 · Schwarz-weiß\nXena, 8 · Braun getigert',
    distant: 'Schematische Karte', home: 'Zuhause', sideTrip: 'Ausflug', siteLine: 'Eine Familienreise auf vier Pfoten. Na gut, auf acht.',
  },
};

export const stops = [
  {
    id: 'jacques', view: 'usa',
    en: ['Takoma Park', 'January 2018', 'The case of the mystery meow', 'Jacques’s first five years are a mystery. The Washington D.C. Humane Society knew he’d been found in an apartment hallway. His new family adopted him in January 2018. He always meowed through Takoma Park on car rides, so naturally the family declared it the scene of the crime. Evidence? One very vocal witness.'],
    de: ['Takoma Park', 'Januar 2018', 'Der Fall des rätselhaften Miauens', 'Jacques’ erste fünf Jahre sind ein Rätsel. Das Tierheim der Washington D.C. Humane Society wusste nur, dass man ihn in einem Hausflur gefunden hatte. Im Januar 2018 zog er zu seiner neuen Familie. Bei Autofahrten durch Takoma Park miaute er immer so laut, dass die Familie den Ort kurzerhand zum Fundort erklärte. Beweislage? Ein sehr gesprächiger Zeuge.'],
  },
  {
    id: 'north-carolina', view: 'usa',
    en: ['North Carolina', '2018', 'Small cat, big weather', 'Xena was born in North Carolina and rescued after a hurricane. She made her way to a foster family in Bethesda, Maryland. The rest of the household had no idea what was coming.'],
    de: ['North Carolina', '2018', 'Kleine Katze, großer Sturm', 'Xena kam in North Carolina zur Welt und wurde nach einem Hurrikan gerettet. So kam sie zu einer Pflegefamilie in Bethesda, Maryland. Der Rest der Familie ahnte noch nicht, wer da bald einziehen würde.'],
  },
  {
    id: 'bethesda', view: 'usa',
    en: ['Bethesda', 'Fall 2018', 'Enter Xena', 'At five months old, Xena left her foster family in Bethesda and moved to Petworth. Jacques had already claimed his favorite spots. Xena was happy to inspect them all.'],
    de: ['Bethesda', 'Herbst 2018', 'Auftritt Xena', 'Mit fünf Monaten zog Xena von ihrer Pflegefamilie in Bethesda nach Petworth. Jacques hatte seine Lieblingsplätze längst besetzt. Xena nahm sie alle gründlich in Augenschein.'],
  },
  {
    id: 'petworth', view: 'usa',
    en: ['Petworth', '2018–November 2022', 'Home base, with detours', 'Jacques moved to this Washington, D.C., neighborhood in January 2018. Xena joined him that fall. Petworth was home until November 2022, with several month-long getaways to Brooklyn and Vermont along the way.'],
    de: ['Petworth', '2018–November 2022', 'Zuhause mit Umwegen', 'Jacques zog im Januar 2018 in dieses Viertel von Washington, D.C. Im Herbst kam Xena dazu. Bis November 2022 war Petworth ihr Zuhause, mit mehreren jeweils etwa einmonatigen Ausflügen nach Brooklyn und Vermont.'],
  },
  {
    id: 'brooklyn', view: 'usa',
    en: ['Brooklyn', '2018–2022 · Side trip', 'Two cats in the big city', 'Brooklyn was one of their getaways from Petworth. A whole new neighborhood, and somebody still had to make sure the luggage was suitable for sitting in.'],
    de: ['Brooklyn', '2018–2022 · Ausflug', 'Zwei Katzen in der Großstadt', 'Brooklyn war eines ihrer Reiseziele in den Jahren in Petworth. Ein ganz neues Viertel, und irgendwer musste trotzdem prüfen, ob man im Koffer gut sitzen kann.'],
  },
  {
    id: 'vermont', view: 'usa',
    en: ['Vermont', '2018–2022 · Side trip', 'A countryside inspection', 'Vermont was also on the cats’ vacation circuit. They kept Petworth as their home base between trips. The cats have yet to file their official review.'],
    de: ['Vermont', '2018–2022 · Ausflug', 'Landpartie mit Qualitätskontrolle', 'Auch Vermont stand auf dem Reiseplan. Zwischen den Ausflügen ging es immer wieder nach Petworth zurück. Der offizielle Reisebericht der beiden steht noch aus.'],
  },
  {
    id: 'flight', view: 'atlantic',
    en: ['The Atlantic', 'November 2022', 'Two cats. Cabin class.', 'Jacques and Xena crossed the Atlantic as pets in the cabin. Their destination was Berlin. For two passengers accustomed to a good window ledge, the ground was unusually far away.'],
    de: ['Der Atlantik', 'November 2022', 'Zwei Katzen. Kabinenklasse.', 'Jacques und Xena flogen in der Passagierkabine über den Atlantik. Das Ziel war Berlin. Für zwei Katzen, die gern auf der Fensterbank sitzen, war der Boden diesmal ungewöhnlich weit weg.'],
  },
  {
    id: 'friedrichshain', view: 'berlin',
    en: ['Friedrichshain', 'November 2022–present', 'Hallo, Berlin!', 'Friedrichshain became their first home in Berlin. The two settled into the important work of locating sunny spots, claiming furniture and supervising the neighborhood from the window.'],
    de: ['Friedrichshain', 'Seit November 2022', 'Hallo, Berlin!', 'Friedrichshain wurde ihr erstes Berliner Zuhause. Dort widmeten sich die beiden den wirklich wichtigen Aufgaben: Sonnenplätze finden, Möbel besetzen und das Viertel vom Fenster aus beaufsichtigen.'],
  },
  {
    id: 'moabit', view: 'berlin',
    en: ['Moabit', 'Early 2027 · Planned', 'From meow to Moabit', 'Another move is on the horizon, this time within Berlin. Next stop: Moabit. The boxes may still be empty, but management is ready to sit in them.'],
    de: ['Moabit', 'Anfang 2027 · Geplant', 'Von Miau nach Moabit', 'Der nächste Umzug steht bevor, diesmal innerhalb Berlins. Nächster Halt: Moabit. Die Kartons sind vielleicht noch leer, aber die Umzugsleitung sitzt schon mal Probe.'],
  },
];
