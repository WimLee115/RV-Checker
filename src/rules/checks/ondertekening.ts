import type { OndertekendAntwoord } from '../../core/types';
import type { Rule } from '../types';

/**
 * Signalen rond het wel/niet (kunnen) ondertekenen door betrokkene. Deze wegen procedureel
 * zwaar, los van of de cijfers kloppen — het rapport haalt alles met deze tag naar voren,
 * zie plan §4/§6. Zie ook de los vermelde waarschuwing dat de bewindvoerder zelf de
 * doorgeefluik naar de rechtbank is: bij twijfel neemt betrokkene zelf contact op met de
 * rechtbank, niet alleen met de bewindvoerder.
 *
 * Elke reden krijgt een eigen regel/i18nBaseKey (in plaats van de enum als param door te
 * geven) zodat de vertaalde tekst de reden al specifiek benoemt — consistent met hoe
 * gekoppeldeposten.ts dit aanpakt.
 */
const NIET_ONDERTEKEND_REDENEN: { antwoord: OndertekendAntwoord; i18nBaseKey: string }[] = [
  { antwoord: 'neeNietGereageerd', i18nBaseKey: 'rules.nietOndertekendNietGereageerd' },
  { antwoord: 'neeAfgewezen', i18nBaseKey: 'rules.nietOndertekendAfgewezen' },
  { antwoord: 'neeNietInStaat', i18nBaseKey: 'rules.nietOndertekendNietInStaat' },
  { antwoord: 'neeNietAkkoord', i18nBaseKey: 'rules.nietOndertekendNietAkkoord' },
];

const nietOndertekendRules: Rule[] = NIET_ONDERTEKEND_REDENEN.map(
  ({ antwoord, i18nBaseKey }): Rule => ({
    id: `betrokkene-niet-ondertekend-${antwoord}`,
    severity: 'rode-vlag',
    section: 'ondertekeningBewindvoerder',
    i18nBaseKey,
    tags: ['betrokkene-signaal'],
    check: ({ data }) => (data.ondertekeningBewindvoerder.ondertekend === antwoord ? [{}] : []),
  }),
);

export const ondertekeningRules: Rule[] = [
  {
    id: 'betrokkene-kan-niet-beoordelen',
    severity: 'rode-vlag',
    section: 'ondertekeningBewindvoerder',
    i18nBaseKey: 'rules.betrokkeneKanNietBeoordelen',
    tags: ['betrokkene-signaal'],
    check: ({ data }) => (data.ondertekeningBewindvoerder.kanBegrijpenEnBeoordelen === false ? [{}] : []),
  },
  ...nietOndertekendRules,
  {
    id: 'betrokkene-niet-eens-met-antwoorden',
    severity: 'rode-vlag',
    section: 'meningBetrokkene',
    i18nBaseKey: 'rules.betrokkeneNietEensMetAntwoorden',
    tags: ['betrokkene-signaal'],
    check: ({ data }) => (data.meningBetrokkene.eensMetAntwoorden === false ? [{}] : []),
  },
];
