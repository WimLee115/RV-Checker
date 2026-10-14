import type { Rule } from '../types';

/**
 * Checklist van bijlagen die het officiële format op specifieke plekken vereist. De
 * gebruiker vinkt zelf af wat daadwerkelijk is bijgevoegd; een regel vuurt alleen bij een
 * expliciete "nee" (false) — niet bij "nog niet nagekeken" (null), want dat is geen fout.
 */
export const bijlagenRules: Rule[] = [
  {
    id: 'bijlage-rekeningafschriften-ontbreekt',
    severity: 'aandachtspunt',
    section: 'bijlagen',
    i18nBaseKey: 'rules.bijlageRekeningafschriftenOntbreekt',
    check: ({ data }) => {
      const relevant = [...data.bezittingen.bankSpaarrekeningen, ...data.bezittingen.leefgeldrekeningen].length > 0;
      if (!relevant || data.bijlagen.rekeningafschriftenAanwezig !== false) return [];
      return [{}];
    },
  },
  {
    id: 'bijlage-pgb-beschikking-ontbreekt',
    severity: 'rode-vlag',
    section: 'bijlagen',
    i18nBaseKey: 'rules.bijlagePgbBeschikkingOntbreekt',
    check: ({ data }) => {
      const relevant = data.pgb.heeftPgb === true;
      if (!relevant || data.bijlagen.pgbBeschikkingAanwezig !== false) return [];
      return [{}];
    },
  },
  {
    id: 'bijlage-machtigingen-ontbreekt',
    severity: 'rode-vlag',
    section: 'bijlagen',
    i18nBaseKey: 'rules.bijlageMachtigingenOntbreekt',
    check: ({ data }) => {
      const relevant = (data.uitgaven.giftenEnSchenkingen ?? 0) > 0 || (data.uitgaven.uitgaveIngevolgeMachtiging ?? 0) > 0;
      if (!relevant || data.bijlagen.machtigingenAanwezig !== false) return [];
      return [{}];
    },
  },
  {
    id: 'bijlage-woz-hypotheek-ontbreekt',
    severity: 'rode-vlag',
    section: 'bijlagen',
    i18nBaseKey: 'rules.bijlageWozHypotheekOntbreekt',
    check: ({ data }) => {
      const relevant = data.bezittingen.onroerendGoed.length > 0;
      if (!relevant || data.bijlagen.wozBeschikkingEnHypotheekoverzichtAanwezig !== false) return [];
      return [{}];
    },
  },
  {
    id: 'bijlage-nalatenschap-documenten-ontbreekt',
    severity: 'rode-vlag',
    section: 'bijlagen',
    i18nBaseKey: 'rules.bijlageNalatenschapDocumentenOntbreekt',
    check: ({ data }) => {
      const relevant = data.nalatenschap.heeftOnverdeeldeNalatenschap === true;
      if (!relevant || data.bijlagen.nalatenschapDocumentenAanwezig !== false) return [];
      return [{}];
    },
  },
];
