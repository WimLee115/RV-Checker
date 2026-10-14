import {
  afwijkingGerapporteerdTotaalInkomen,
  afwijkingGerapporteerdTotaalUitgaven,
  afwijkingTotalen,
  controleVermogensopstelling,
} from '../../core/calculations';
import { formatEuro } from '../../core/format';
import type { Rule } from '../types';

export const reconciliationRules: Rule[] = [
  {
    id: 'afwijking-totalen',
    severity: 'fout',
    section: 'samenvatting',
    i18nBaseKey: 'rules.afwijkingTotalen',
    check: ({ data }) => {
      const afwijking = afwijkingTotalen(data);
      if (afwijking === 0) return [];
      return [
        {
          params: { bedrag: formatEuro(Math.abs(afwijking)) },
          detail: { kind: 'amount', labelKey: 'rules.afwijkingTotalen.detailLabel', amountCents: afwijking },
        },
      ];
    },
  },
  {
    id: 'controle-vermogensopstelling',
    severity: 'fout',
    section: 'samenvatting',
    i18nBaseKey: 'rules.controleVermogensopstelling',
    check: ({ data }) => {
      const afwijking = controleVermogensopstelling(data);
      if (afwijking === null || afwijking === 0) return [];
      return [
        {
          params: { bedrag: formatEuro(Math.abs(afwijking)) },
          detail: { kind: 'amount', labelKey: 'rules.controleVermogensopstelling.detailLabel', amountCents: afwijking },
        },
      ];
    },
  },
  {
    id: 'afwijking-gerapporteerd-totaal-inkomen',
    severity: 'fout',
    section: 'inkomen',
    i18nBaseKey: 'rules.afwijkingGerapporteerdInkomen',
    check: ({ data }) => {
      const afwijking = afwijkingGerapporteerdTotaalInkomen(data);
      if (afwijking === null || afwijking === 0) return [];
      return [
        {
          params: { bedrag: formatEuro(Math.abs(afwijking)) },
          detail: { kind: 'amount', labelKey: 'rules.afwijkingGerapporteerdInkomen.detailLabel', amountCents: afwijking },
        },
      ];
    },
  },
  {
    id: 'afwijking-gerapporteerd-totaal-uitgaven',
    severity: 'fout',
    section: 'uitgaven',
    i18nBaseKey: 'rules.afwijkingGerapporteerdUitgaven',
    check: ({ data }) => {
      const afwijking = afwijkingGerapporteerdTotaalUitgaven(data);
      if (afwijking === null || afwijking === 0) return [];
      return [
        {
          params: { bedrag: formatEuro(Math.abs(afwijking)) },
          detail: { kind: 'amount', labelKey: 'rules.afwijkingGerapporteerdUitgaven.detailLabel', amountCents: afwijking },
        },
      ];
    },
  },
];
