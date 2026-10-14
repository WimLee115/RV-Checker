import type { BeloningCategorie, Bewindvoerder, BewindRol, RVData } from '../../core/types';
import { formatEuro } from '../../core/format';
import { TARIEVEN_2026 } from '../../core/tariffs2026';
import type { Rule } from '../types';

function tariefVoorRol(categorie: BeloningCategorie, rol: BewindRol, problematischeSchulden: boolean): number {
  if (rol === 'bewind' && problematischeSchulden) {
    return TARIEVEN_2026.jaarlijksBewindProblematischeSchulden;
  }
  const tabel = categorie === 'familie' ? TARIEVEN_2026.jaarlijksFamilie : TARIEVEN_2026.jaarlijksProfessioneel;
  if (rol === 'curatele') return tabel.curator;
  if (rol === 'mentorschap') return tabel.mentor;
  return tabel.bewindvoerder;
}

/** Eerste bewindvoerder (1, dan 2) met de gevraagde rol en een bekende beloningcategorie. */
function bewindvoerderMetRol(data: RVData, rol: BewindRol): Bewindvoerder | null {
  const kandidaten = [data.persoonsgegevens.bewindvoerder1, data.persoonsgegevens.bewindvoerder2];
  for (const bv of kandidaten) {
    if (bv && bv.rol === rol && bv.beloningCategorie !== null) return bv;
  }
  return null;
}

function maakBeloningscheck(
  mogelijkeRollen: BewindRol[],
  haalBeloning: (data: RVData) => number | null,
  detailLabelKey: string,
): Rule['check'] {
  return ({ data }) => {
    const bedrag = haalBeloning(data);
    if (bedrag === null || bedrag <= 0) return [];

    const bv = mogelijkeRollen.map((rol) => bewindvoerderMetRol(data, rol)).find((kandidaat) => kandidaat !== null);
    if (!bv || bv.rol === null || bv.beloningCategorie === null) return [];

    const grens = tariefVoorRol(bv.beloningCategorie, bv.rol, data.dossiergegevens.redenProblematischeSchulden === true);
    const signaleringsgrens = Math.round(grens * TARIEVEN_2026.signaleringsMargeFactor);
    if (bedrag <= signaleringsgrens) return [];

    return [
      {
        params: { bedrag: formatEuro(bedrag), tarief: formatEuro(grens) },
        detail: {
          kind: 'amount-pair',
          labelKey: detailLabelKey,
          expectedCents: grens,
          actualCents: bedrag,
          differenceCents: bedrag - grens,
        },
      },
    ];
  };
}

export const tarievenRules: Rule[] = [
  {
    id: 'beloning-bewindvoerder-curator-boven-tarief',
    severity: 'rode-vlag',
    section: 'uitgaven',
    i18nBaseKey: 'rules.beloningBovenTarief',
    check: maakBeloningscheck(
      ['bewind', 'curatele'],
      (data) => data.uitgaven.beloningCuratorBewindvoerder,
      'rules.beloningBovenTarief.detailLabel',
    ),
  },
  {
    id: 'beloning-mentor-boven-tarief',
    severity: 'rode-vlag',
    section: 'uitgaven',
    i18nBaseKey: 'rules.beloningMentorBovenTarief',
    check: maakBeloningscheck(
      ['mentorschap'],
      (data) => data.uitgaven.beloningMentor,
      'rules.beloningMentorBovenTarief.detailLabel',
    ),
  },
];
