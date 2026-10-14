/**
 * Datamodel voor één Rekening en Verantwoording (R&V), gebaseerd op de officiële
 * veldstructuur (art. 1:445-1:446 BW / Rechtspraak-modelformulier) en gevalideerd
 * tegen reële software van bewindvoerders.
 *
 * Geldbedragen zijn altijd `CentAmount`: een geheel aantal cent, nooit een drijvende-
 * kommagetal met decimalen. `null` betekent "niet ingevuld" (geldig, geen fout) en is
 * met opzet onderscheiden van `0` (expliciet nul ingevuld) — zie core/format.ts.
 */

export type CentAmount = number | null;
export type ISODate = string; // "YYYY-MM-DD"
export type RowId = string;

export interface Dossiergegevens {
  dossiernummer: string;
  periodeVan: ISODate | null;
  periodeTotEnMet: ISODate | null;
  /** Nodig voor de tarieventoets (R4): schuldenbewind heeft een eigen, hoger jaartarief. */
  redenProblematischeSchulden: boolean | null;
}

export type BewindRol = 'bewind' | 'curatele' | 'mentorschap';
export type BeloningCategorie = 'familie' | 'professioneel';

export interface Bewindvoerder {
  achternaam: string;
  tussenvoegsel: string;
  voorletters: string;
  straat: string;
  huisnummer: string;
  toevoeging: string;
  postcode: string;
  woonplaats: string;
  telefoonnummer: string;
  email: string;
  rol: BewindRol | null;
  /** Nodig voor de tarieventoets (R4) tegen de Regeling beloning curatoren, bewindvoerders en mentoren. */
  beloningCategorie: BeloningCategorie | null;
}

export interface Betrokkene {
  achternaam: string;
  tussenvoegsel: string;
  voorletters: string;
  geboortedatum: ISODate | null;
  straat: string;
  huisnummer: string;
  toevoeging: string;
  postcode: string;
  woonplaats: string;
}

export interface Persoonsgegevens {
  bewindvoerder1: Bewindvoerder;
  bewindvoerder2: Bewindvoerder | null;
  betrokkene: Betrokkene;
}

/** Netto inkomen (A). */
export interface Inkomen {
  salaris: CentAmount;
  uitkering: CentAmount;
  pensioen: CentAmount;
  vakantiegeld: CentAmount;
  inkomenUitOnderneming: CentAmount;
  bijzondereBijstandBewindMentorCurator: CentAmount;
  bijzondereBijstandOverig: CentAmount;
  huurinkomsten: CentAmount;
  belastingteruggave: CentAmount;
  toeslagenHuurtoeslag: CentAmount;
  toeslagenZorgtoeslag: CentAmount;
  toeslagenKinderopvangtoeslag: CentAmount;
  toeslagenKindgebondenBudget: CentAmount;
  tegemoetkomingReiskosten: CentAmount;
  tegemoetkomingZiektekostenWlz: CentAmount;
  rente: CentAmount;
  dividend: CentAmount;
  schenkingen: CentAmount;
  /** "Nalatenschap" als inkomenspost — niet de sectie Onverdeelde nalatenschap (zie Nalatenschap). */
  nalatenschapUitkering: CentAmount;
  alimentatieOntvangen: CentAmount;
  kinderbijslag: CentAmount;
  studiefinancieringBetrokkene: CentAmount;
  terugstortingDerden: CentAmount;
  vrijwilligersvergoeding: CentAmount;
  overigeInkomsten: CentAmount;
  overigeInkomstenSpecificatie: string;
  /** Zoals het brondocument dit zelf als totaal vermeldt — voor cross-check, zie core/calculations.ts. */
  gerapporteerdTotaal: CentAmount;
}

/** Uitgaven (B). */
export interface Uitgaven {
  leefgeldZakgeld: CentAmount;
  huurKostgeld: CentAmount;
  hypotheekRenteAflossing: CentAmount;
  energie: CentAmount;
  water: CentAmount;
  vasteTelefoonTvInternet: CentAmount;
  mobieleTelefoon: CentAmount;
  servicekosten: CentAmount;
  premieZiektekostenverzekering: CentAmount;
  premieBrandInboedelAansprakelijkheid: CentAmount;
  premieAutoverzekering: CentAmount;
  premieUitvaartverzekering: CentAmount;
  premiePakketverzekeringOverig: CentAmount;
  kledingEnSchoenen: CentAmount;
  persoonlijkeVerzorging: CentAmount;
  renteAflossingSchuldenAndersDanHypotheek: CentAmount;
  bankkosten: CentAmount;
  debetrente: CentAmount;
  inkomstenbelasting: CentAmount;
  motorrijtuigenbelasting: CentAmount;
  gemeentelijkeHeffingen: CentAmount;
  waterschapsbelastingen: CentAmount;
  overigeBelastingen: CentAmount;
  eigenBijdrageWlzZiektekosten: CentAmount;
  eigenRisicoZvw: CentAmount;
  eigenBijdrageWmoCak: CentAmount;
  kostenAutoOverig: CentAmount;
  reiskostenBetrokkene: CentAmount;
  reiskostenDerden: CentAmount;
  hobbysContributiesAbonnementen: CentAmount;
  vakantie: CentAmount;
  boetes: CentAmount;
  cadeaus: CentAmount;
  giftenEnSchenkingen: CentAmount;
  uitgaveIngevolgeMachtiging: CentAmount;
  beloningCuratorBewindvoerder: CentAmount;
  beloningMentor: CentAmount;
  kinderopvang: CentAmount;
  juridischeKosten: CentAmount;
  medischeKostenMedicatie: CentAmount;
  alimentatieBetaald: CentAmount;
  kinderbijslagGestortOpLeefgeldrekening: CentAmount;
  boedelafdrachtMsnpWsnp: CentAmount;
  kostenDieren: CentAmount;
  ouderbijdrageLbio: CentAmount;
  overigeUitgaven: CentAmount;
  overigeUitgavenSpecificatie: string;
  /** Zoals het brondocument dit zelf als totaal vermeldt — voor cross-check, zie core/calculations.ts. */
  gerapporteerdTotaal: CentAmount;
}

export type PgbBeheerder = 'bewindvoerderCurator' | 'mentor' | 'overig';

export interface Pgb {
  heeftPgb: boolean | null;
  beheerder: PgbBeheerder | null;
  beheerderOverigOmschrijving: string;
  iban: string;
  ontvangenBedrag: CentAmount;
  volledigGebruikt: boolean | null;
  waaromNietVolledigGebruikt: string;
}

export interface Rekening {
  id: RowId;
  omschrijving: string;
  iban: string;
  saldoBegindatum: CentAmount;
  saldoEinddatum: CentAmount;
}

export interface WaardeItem {
  id: RowId;
  omschrijving: string;
  waardeBegindatum: CentAmount;
  waardeEinddatum: CentAmount;
}

export interface Verzekering {
  id: RowId;
  polisnummer: string;
  waardeBegindatum: CentAmount;
  waardeEinddatum: CentAmount;
}

export interface OnroerendGoed {
  id: RowId;
  omschrijving: string;
  wozWaardeActueel: CentAmount;
  hypotheekstandBegindatum: CentAmount;
  hypotheekstandEinddatum: CentAmount;
}

export interface Vordering {
  id: RowId;
  naamSchuldenaar: string;
  standBegindatum: CentAmount;
  standEinddatum: CentAmount;
}

export interface Bezittingen {
  /** "Kale" rekeningsaldi — samen de D/E-totalen uit Check 1 (afwijkingTotalen). */
  bankSpaarrekeningen: Rekening[];
  leefgeldrekeningen: Rekening[];
  /** Overige bezittingen — tellen niet mee in Check 1, wel in Check 2 (controleVermogensopstelling). */
  aandelenObligaties: WaardeItem[];
  verzekeringen: Verzekering[];
  onroerendGoed: OnroerendGoed[];
  waardevolleRoerendeGoederen: WaardeItem[];
  vorderingen: Vordering[];
}

export interface InterneOverboeking {
  id: RowId;
  omschrijving: string;
  vanRekening: string;
  naarRekening: string;
  bedrag: CentAmount;
}

export interface Schuldeiser {
  id: RowId;
  naam: string;
  bedragBegindatum: CentAmount;
  bedragEinddatum: CentAmount;
}

export type SchuldhulpverleningTraject = 'msnp' | 'wsnp' | null;

export interface Schulden {
  heeftSchulden: boolean | null;
  schuldeisers: Schuldeiser[];
  schuldhulpverlening: boolean | null;
  traject: SchuldhulpverleningTraject;
  msnpAanmelddatum: ISODate | null;
  msnpAkkoorddatum: ISODate | null;
  wsnpToelatingsdatum: ISODate | null;
  trajectBeeindigd: boolean | null;
  trajectBeeindigdDatum: ISODate | null;
  schoneLei: boolean | null;
}

export type WijzeVanAanvaarding = 'zuiver' | 'beneficiair' | 'verkoopMetToestemmingKantonrechter';

export interface Nalatenschap {
  heeftOnverdeeldeNalatenschap: boolean | null;
  naamOverledene: string;
  datumOverlijden: ISODate | null;
  familierelatie: string;
  wijzeVanAanvaarding: WijzeVanAanvaarding | null;
  notarisBetrokken: boolean | null;
  naamNotaris: string;
  plaatsNotaris: string;
  verklaringVanErfrecht: boolean | null;
  executeurAangewezen: boolean | null;
  naamExecuteur: string;
  boedelbeschrijving: boolean | null;
  boedelbeschrijvingTermijnMaanden: number | null;
}

export type BesprokenAntwoord = 'ja' | 'neeNietGereageerd' | 'neeAfgewezen' | 'neeNietInStaat';
export type OndertekendAntwoord =
  | 'ja'
  | 'neeNietGereageerd'
  | 'neeAfgewezen'
  | 'neeNietInStaat'
  | 'neeNietAkkoord';

export interface OndertekeningBewindvoerder {
  besproken: BesprokenAntwoord | null;
  besprokenDatum: ISODate | null;
  besprokenToelichting: string;
  kanBegrijpenEnBeoordelen: boolean | null;
  kanBegrijpenEnBeoordelenToelichting: string;
  ondertekend: OndertekendAntwoord | null;
  ondertekendToelichting: string;
  aantalBijlagen: number | null;
}

export interface MeningBetrokkene {
  eensMetAntwoorden: boolean | null;
  waaromNiet: string;
  plaats: string;
  datum: ISODate | null;
}

export interface Bijlagen {
  rekeningafschriftenAanwezig: boolean | null;
  pgbBeschikkingAanwezig: boolean | null;
  machtigingenAanwezig: boolean | null;
  wozBeschikkingEnHypotheekoverzichtAanwezig: boolean | null;
  nalatenschapDocumentenAanwezig: boolean | null;
}

/**
 * Wat het brondocument zélf als eindtotalen van zijn "Samenvatting vermogen"-sectie
 * vermeldt (begin- en eindvermogen). Los van wat deze app berekent uit de detailtabellen
 * in `bezittingen`/`schulden` — het verschil tussen die twee is precies wat Check 2
 * (controleVermogensopstelling) test. Optioneel: `null` als de gebruiker dit niet
 * overneemt, dan wordt die check overgeslagen in plaats van een vals alarm te geven.
 */
export interface GerapporteerdeVermogenstotalen {
  totaalVermogenBegindatum: CentAmount;
  totaalVermogenEinddatum: CentAmount;
}

export type RVSectionId =
  | 'dossier'
  | 'personen'
  | 'inkomen'
  | 'uitgaven'
  | 'pgb'
  | 'bezittingen'
  | 'overboekingen'
  | 'schulden'
  | 'nalatenschap'
  | 'opmerkingen'
  | 'ondertekeningBewindvoerder'
  | 'meningBetrokkene'
  | 'bijlagen'
  | 'samenvatting';

export interface RVData {
  schemaVersion: 1;
  dossiergegevens: Dossiergegevens;
  persoonsgegevens: Persoonsgegevens;
  inkomen: Inkomen;
  uitgaven: Uitgaven;
  pgb: Pgb;
  bezittingen: Bezittingen;
  interneOverboekingen: InterneOverboeking[];
  schulden: Schulden;
  nalatenschap: Nalatenschap;
  opmerkingen: string;
  ondertekeningBewindvoerder: OndertekeningBewindvoerder;
  meningBetrokkene: MeningBetrokkene;
  bijlagen: Bijlagen;
  gerapporteerdeVermogenstotalen: GerapporteerdeVermogenstotalen;
}
