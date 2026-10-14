import type { RVData } from '../../core/types';
import { formatEuro } from '../../core/format';
import type { Rule } from '../types';

interface GekoppeldPaar {
  /** Elk paar krijgt een eigen i18nBaseKey, zodat de categorienamen in de vertaalde tekst zelf
   *  staan — params dragen alleen bedragen, nooit een vertaalsleutel als waarde. */
  i18nBaseKey: string;
  haalInkomsten: (data: RVData) => number | null;
  haalUitgaven: (data: RVData) => number | null;
}

/**
 * Geoormerkte vergoedingen die normaliter (deels) doorbetaald horen te worden aan de
 * bijbehorende uitgavenpost. Ontvangen > 0 maar doorbetaald = €0,00 is geen bewijs van iets
 * mis, maar wel iets om naar te vragen — zie plan §3 (R8), gevalideerd tegen een reëel
 * voorbeeld waarin dit patroon daadwerkelijk voorkwam.
 */
const GEKOPPELDE_PAREN: GekoppeldPaar[] = [
  {
    i18nBaseKey: 'rules.gekoppeldReiskosten',
    haalInkomsten: (data) => data.inkomen.tegemoetkomingReiskosten,
    haalUitgaven: (data) => data.uitgaven.reiskostenBetrokkene,
  },
  {
    i18nBaseKey: 'rules.gekoppeldKinderopvang',
    haalInkomsten: (data) => data.inkomen.toeslagenKinderopvangtoeslag,
    haalUitgaven: (data) => data.uitgaven.kinderopvang,
  },
];

export const gekoppeldePostenRules: Rule[] = GEKOPPELDE_PAREN.map(
  (paar): Rule => ({
    id: `${paar.i18nBaseKey}-niet-doorbetaald`,
    severity: 'aandachtspunt',
    section: 'uitgaven',
    i18nBaseKey: paar.i18nBaseKey,
    check: ({ data }) => {
      const inkomsten = paar.haalInkomsten(data);
      const uitgaven = paar.haalUitgaven(data);
      if (inkomsten === null || inkomsten <= 0) return [];
      if ((uitgaven ?? 0) > 0) return [];

      return [{ params: { bedrag: formatEuro(inkomsten) } }];
    },
  }),
);
