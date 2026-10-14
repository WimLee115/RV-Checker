import type { Rule } from '../types';

export const volledigheidRules: Rule[] = [
  {
    id: 'schulden-ja-zonder-schuldeisers',
    severity: 'rode-vlag',
    section: 'schulden',
    i18nBaseKey: 'rules.schuldenZonderSchuldeisers',
    check: ({ data }) => {
      if (data.schulden.heeftSchulden !== true) return [];
      if (data.schulden.schuldeisers.length > 0) return [];
      return [{}];
    },
  },
  {
    id: 'pgb-ja-zonder-gegevens',
    severity: 'rode-vlag',
    section: 'pgb',
    i18nBaseKey: 'rules.pgbZonderGegevens',
    check: ({ data }) => {
      if (data.pgb.heeftPgb !== true) return [];
      const onvolledig = data.pgb.iban.trim() === '' || data.pgb.ontvangenBedrag === null;
      if (!onvolledig) return [];
      return [{}];
    },
  },
  {
    id: 'nalatenschap-ja-zonder-gegevens',
    severity: 'rode-vlag',
    section: 'nalatenschap',
    i18nBaseKey: 'rules.nalatenschapZonderGegevens',
    check: ({ data }) => {
      if (data.nalatenschap.heeftOnverdeeldeNalatenschap !== true) return [];
      const onvolledig = data.nalatenschap.naamOverledene.trim() === '' || data.nalatenschap.wijzeVanAanvaarding === null;
      if (!onvolledig) return [];
      return [{}];
    },
  },
];
