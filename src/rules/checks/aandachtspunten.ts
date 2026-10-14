import { totaalUitgaven } from '../../core/calculations';
import { formatEuro } from '../../core/format';
import type { RVData, Uitgaven } from '../../core/types';
import type { Rule } from '../types';

/** Drempel vanaf waar "Giften en schenkingen" wordt gesignaleerd (vereist een machtiging). */
const GIFTEN_DREMPEL_CENTS = 50_000; // €500,00

/** Vanaf welk aandeel van de totale uitgaven een "overige"-post wordt gesignaleerd. */
const OVERIGE_AANDEEL_DREMPEL = 0.15;

/** Categorieën die normaliter niet een heel jaar op exact €0,00 staan (expliciet ingevuld, niet leeg). */
const ONVERWACHT_NUL_CATEGORIEEN: { veld: keyof Uitgaven; i18nBaseKey: string }[] = [
  { veld: 'kledingEnSchoenen', i18nBaseKey: 'rules.onverwachtNulKleding' },
];

const onverwachtNulRules: Rule[] = ONVERWACHT_NUL_CATEGORIEEN.map(
  ({ veld, i18nBaseKey }): Rule => ({
    id: `onverwacht-nul-${veld}`,
    severity: 'aandachtspunt',
    section: 'uitgaven',
    i18nBaseKey,
    check: ({ data }) => (data.uitgaven[veld] === 0 ? [{}] : []),
  }),
);

const boetesRule: Rule = {
  id: 'boetes-aanwezig',
  severity: 'aandachtspunt',
  section: 'uitgaven',
  i18nBaseKey: 'rules.boetesAanwezig',
  check: ({ data }) => {
    const boetes = data.uitgaven.boetes;
    if (boetes === null || boetes <= 0) return [];
    return [{ params: { bedrag: formatEuro(boetes) } }];
  },
};

const giftenRule: Rule = {
  id: 'giften-boven-drempel',
  severity: 'rode-vlag',
  section: 'uitgaven',
  i18nBaseKey: 'rules.giftenBovenDrempel',
  check: ({ data }) => {
    const bedrag = data.uitgaven.giftenEnSchenkingen;
    if (bedrag === null || bedrag < GIFTEN_DREMPEL_CENTS) return [];
    return [{ params: { bedrag: formatEuro(bedrag) } }];
  },
};

function maakOverigeAandeelRule(
  id: string,
  i18nBaseKey: string,
  section: 'inkomen' | 'uitgaven',
  haalOverig: (data: RVData) => number | null,
  haalTotaal: (data: RVData) => number,
): Rule {
  return {
    id,
    severity: 'aandachtspunt',
    section,
    i18nBaseKey,
    check: ({ data }) => {
      const overig = haalOverig(data);
      const totaal = haalTotaal(data);
      if (overig === null || overig <= 0 || totaal <= 0) return [];
      const aandeel = overig / totaal;
      if (aandeel < OVERIGE_AANDEEL_DREMPEL) return [];
      return [
        {
          params: {
            bedrag: formatEuro(overig),
            percentage: Math.round(aandeel * 100),
          },
        },
      ];
    },
  };
}

const overigeUitgavenRule = maakOverigeAandeelRule(
  'overige-uitgaven-groot-aandeel',
  'rules.overigeUitgavenGrootAandeel',
  'uitgaven',
  (data) => data.uitgaven.overigeUitgaven,
  (data) => totaalUitgaven(data),
);

export const aandachtspuntenRules: Rule[] = [...onverwachtNulRules, boetesRule, giftenRule, overigeUitgavenRule];
