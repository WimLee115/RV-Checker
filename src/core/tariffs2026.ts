/**
 * Regeling beloning curatoren, bewindvoerders en mentoren — tarieven geldig per 1 januari 2026
 * (Staatscourant). Jaarlijks geïndexeerd: dit is de enige plek waar deze bedragen staan, zodat
 * een update bij een volgende indexering één bestand raakt.
 *
 * Alle bedragen in gehele centen, exclusief btw.
 */
export const TARIEVEN_2026 = {
  jaarlijksFamilie: {
    curator: 159_300,
    bewindvoerder: 88_300,
    mentor: 88_300,
  },
  jaarlijksProfessioneel: {
    curator: 299_300,
    bewindvoerder: 163_000,
    mentor: 160_300,
  },
  jaarlijksBewindProblematischeSchulden: 210_700,

  vermogensgrensVoorPercentageTarief: 100_000_000, // €1.000.000,00
  percentageTariefBovenVermogensgrens: 0.0075,

  eenmaligIntake: 76_700,
  eenmaligIntakeBijEerderBudgetbeheer: 57_400,
  eenmaligBoedelovernameVerhuizing: 47_800,
  eenmaligPgbBeheer: 71_800,
  eenmaligOpstellenEindrekening: 28_800,

  /**
   * Marge boven het basistarief voordat de app signaleert. Btw alleen al is 21%; eenmalige
   * vergoedingen (intake, PGB-beheer, ...) kunnen legitiem bovenop het jaartarief komen. Een
   * exacte-gelijkheid-check zou dus voortdurend vals alarm slaan — vandaar deze marge.
   */
  signaleringsMargeFactor: 1.3,
} as const;
