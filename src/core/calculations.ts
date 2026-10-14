import type { RVData, Rekening, WaardeItem } from './types';
import { sumCents } from './format';

/** Som van alle inkomenscategorieën — "Totaal (A)". */
export function totaalInkomen(data: RVData): number {
  const i = data.inkomen;
  return sumCents(
    i.salaris,
    i.uitkering,
    i.pensioen,
    i.vakantiegeld,
    i.inkomenUitOnderneming,
    i.bijzondereBijstandBewindMentorCurator,
    i.bijzondereBijstandOverig,
    i.huurinkomsten,
    i.belastingteruggave,
    i.toeslagenHuurtoeslag,
    i.toeslagenZorgtoeslag,
    i.toeslagenKinderopvangtoeslag,
    i.toeslagenKindgebondenBudget,
    i.tegemoetkomingReiskosten,
    i.tegemoetkomingZiektekostenWlz,
    i.rente,
    i.dividend,
    i.schenkingen,
    i.nalatenschapUitkering,
    i.alimentatieOntvangen,
    i.kinderbijslag,
    i.studiefinancieringBetrokkene,
    i.terugstortingDerden,
    i.vrijwilligersvergoeding,
    i.overigeInkomsten,
  );
}

/** Som van alle uitgavencategorieën — "Totaal (B)". */
export function totaalUitgaven(data: RVData): number {
  const u = data.uitgaven;
  return sumCents(
    u.leefgeldZakgeld,
    u.huurKostgeld,
    u.hypotheekRenteAflossing,
    u.energie,
    u.water,
    u.vasteTelefoonTvInternet,
    u.mobieleTelefoon,
    u.servicekosten,
    u.premieZiektekostenverzekering,
    u.premieBrandInboedelAansprakelijkheid,
    u.premieAutoverzekering,
    u.premieUitvaartverzekering,
    u.premiePakketverzekeringOverig,
    u.kledingEnSchoenen,
    u.persoonlijkeVerzorging,
    u.renteAflossingSchuldenAndersDanHypotheek,
    u.bankkosten,
    u.debetrente,
    u.inkomstenbelasting,
    u.motorrijtuigenbelasting,
    u.gemeentelijkeHeffingen,
    u.waterschapsbelastingen,
    u.overigeBelastingen,
    u.eigenBijdrageWlzZiektekosten,
    u.eigenRisicoZvw,
    u.eigenBijdrageWmoCak,
    u.kostenAutoOverig,
    u.reiskostenBetrokkene,
    u.reiskostenDerden,
    u.hobbysContributiesAbonnementen,
    u.vakantie,
    u.boetes,
    u.cadeaus,
    u.giftenEnSchenkingen,
    u.uitgaveIngevolgeMachtiging,
    u.beloningCuratorBewindvoerder,
    u.beloningMentor,
    u.kinderopvang,
    u.juridischeKosten,
    u.medischeKostenMedicatie,
    u.alimentatieBetaald,
    u.kinderbijslagGestortOpLeefgeldrekening,
    u.boedelafdrachtMsnpWsnp,
    u.kostenDieren,
    u.ouderbijdrageLbio,
    u.overigeUitgaven,
  );
}

/** Verschil inkomen - uitgaven — "(C)". */
export function verschilInkomenUitgaven(data: RVData): number {
  return totaalInkomen(data) - totaalUitgaven(data);
}

function alleRekeningen(data: RVData): Rekening[] {
  return [...data.bezittingen.bankSpaarrekeningen, ...data.bezittingen.leefgeldrekeningen];
}

/** Som van alle begindatum-saldi op bank-, spaar- en leefgeldrekeningen — "(D)". */
export function totaalSaldoBegindatum(data: RVData): number {
  return sumCents(...alleRekeningen(data).map((r) => r.saldoBegindatum));
}

/** Som van alle einddatum-saldi op bank-, spaar- en leefgeldrekeningen — "(E)". */
export function totaalSaldoEinddatum(data: RVData): number {
  return sumCents(...alleRekeningen(data).map((r) => r.saldoEinddatum));
}

/** Verschil rekeningsaldi eind - begin — "(F)". */
export function verschilRekeningenEindBegin(data: RVData): number {
  return totaalSaldoEinddatum(data) - totaalSaldoBegindatum(data);
}

/**
 * Check 1 ("Afwijking totalen", zoals in het officiële formulier): F - C.
 * Hoort exact 0 te zijn — elke euro die op de rekeningen bijkomt/afgaat moet terug te
 * voeren zijn op een inkomsten- of uitgavenpost. Een afwijking is een harde, objectieve
 * fout: geen interpretatie nodig.
 */
export function afwijkingTotalen(data: RVData): number {
  return verschilRekeningenEindBegin(data) - verschilInkomenUitgaven(data);
}

function waardeTotaal(items: WaardeItem[], key: 'waardeBegindatum' | 'waardeEinddatum'): number {
  return sumCents(...items.map((item) => item[key]));
}

/** Overige bezittingen (alles behalve kale rekeningsaldi) op de begindatum. */
export function totaalOverigeBezittingenBegindatum(data: RVData): number {
  const b = data.bezittingen;
  return sumCents(
    waardeTotaal(b.aandelenObligaties, 'waardeBegindatum'),
    sumCents(...b.verzekeringen.map((v) => v.waardeBegindatum)),
    sumCents(...b.onroerendGoed.map((o) => o.wozWaardeActueel)),
    waardeTotaal(b.waardevolleRoerendeGoederen, 'waardeBegindatum'),
    sumCents(...b.vorderingen.map((v) => v.standBegindatum)),
  );
}

/** Overige bezittingen (alles behalve kale rekeningsaldi) op de einddatum. */
export function totaalOverigeBezittingenEinddatum(data: RVData): number {
  const b = data.bezittingen;
  return sumCents(
    waardeTotaal(b.aandelenObligaties, 'waardeEinddatum'),
    sumCents(...b.verzekeringen.map((v) => v.waardeEinddatum)),
    sumCents(...b.onroerendGoed.map((o) => o.wozWaardeActueel)),
    waardeTotaal(b.waardevolleRoerendeGoederen, 'waardeEinddatum'),
    sumCents(...b.vorderingen.map((v) => v.standEinddatum)),
  );
}

/** Totale schulden (hypotheken + overige schuldeisers) op de begindatum. */
export function totaalSchuldenBegindatum(data: RVData): number {
  const hypotheken = sumCents(...data.bezittingen.onroerendGoed.map((o) => o.hypotheekstandBegindatum));
  const overig = sumCents(...data.schulden.schuldeisers.map((s) => s.bedragBegindatum));
  return hypotheken + overig;
}

/** Totale schulden (hypotheken + overige schuldeisers) op de einddatum. */
export function totaalSchuldenEinddatum(data: RVData): number {
  const hypotheken = sumCents(...data.bezittingen.onroerendGoed.map((o) => o.hypotheekstandEinddatum));
  const overig = sumCents(...data.schulden.schuldeisers.map((s) => s.bedragEinddatum));
  return hypotheken + overig;
}

/** Berekend totaal vermogen (bezittingen - schulden) op basis van de ingevulde detailtabellen. */
export function totaalVermogenBerekend(data: RVData, moment: 'begin' | 'eind'): number {
  const rekeningen = moment === 'begin' ? totaalSaldoBegindatum(data) : totaalSaldoEinddatum(data);
  const overigeBezittingen =
    moment === 'begin' ? totaalOverigeBezittingenBegindatum(data) : totaalOverigeBezittingenEinddatum(data);
  const schulden = moment === 'begin' ? totaalSchuldenBegindatum(data) : totaalSchuldenEinddatum(data);
  return rekeningen + overigeBezittingen - schulden;
}

/**
 * Check 2 ("Controle" vermogensopstelling, zoals in het officiële formulier): het
 * verschil tussen wat het brondocument zélf als totaal vermogen begin/eind vermeldt
 * (`gerapporteerdeVermogenstotalen`) en wat deze app berekent uit de ingevulde
 * detailtabellen (bezittingen/schulden). Op het officiële papieren formulier is dit een
 * cross-check tussen twee apart ingevulde onderdelen van hetzelfde document — en dus
 * een reële controle op de eigen rekenkunde van de bewindvoerder, niet een tautologie.
 *
 * Geeft `null` terug als de gebruiker de gerapporteerde totalen niet heeft overgenomen
 * (dan wordt de check overgeslagen in plaats van een vals alarm te geven).
 */
export function controleVermogensopstelling(data: RVData): number | null {
  const { totaalVermogenBegindatum, totaalVermogenEinddatum } = data.gerapporteerdeVermogenstotalen;
  if (totaalVermogenBegindatum === null || totaalVermogenEinddatum === null) return null;

  const begin = totaalVermogenBegindatum - totaalVermogenBerekend(data, 'begin');
  const eind = totaalVermogenEinddatum - totaalVermogenBerekend(data, 'eind');
  return begin + eind;
}

/**
 * Cross-check tussen het door deze app berekende Totaal (A) en wat het brondocument
 * zelf als Totaal (A) vermeldt (`inkomen.gerapporteerdTotaal`). Vangt een rekenfout van
 * de bewindvoerder bij het optellen van de eigen inkomstenregels. `null` als niet
 * ingevuld — dan wordt de check overgeslagen.
 */
export function afwijkingGerapporteerdTotaalInkomen(data: RVData): number | null {
  if (data.inkomen.gerapporteerdTotaal === null) return null;
  return totaalInkomen(data) - data.inkomen.gerapporteerdTotaal;
}

/** Zelfde cross-check als hierboven, voor Totaal (B) / uitgaven. */
export function afwijkingGerapporteerdTotaalUitgaven(data: RVData): number | null {
  if (data.uitgaven.gerapporteerdTotaal === null) return null;
  return totaalUitgaven(data) - data.uitgaven.gerapporteerdTotaal;
}
