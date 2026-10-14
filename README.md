# RV-Checker

**Controleer de jaarlijkse Rekening en Verantwoording van uw bewindvoerder, mentor of curator — gratis, privé, zonder account.**

RV-Checker is een gratis applicatie die de jaarlijkse Rekening en Verantwoording (R&V) van een bewindvoerder, mentor of curator systematisch controleert op rekenkundige fouten, ontbrekende gegevens en aandachtspunten. De app draait volledig op uw eigen apparaat: er wordt niets verstuurd, niets gevolgd, en er is geen account nodig.

---

## Inhoud

- [Waarom bestaat deze app](#waarom-bestaat-deze-app)
- [Wat de app wel en niet doet](#wat-de-app-wel-en-niet-doet)
- [Is mijn data echt privé?](#is-mijn-data-echt-privé)
- [Hoe gebruik ik de app](#hoe-gebruik-ik-de-app)
- [Wat betekenen de meldingen in het rapport](#wat-betekenen-de-meldingen-in-het-rapport)
- [Veelgestelde vragen](#veelgestelde-vragen)
- [Status en wat nog komt](#status-en-wat-nog-komt)
- [Voor ontwikkelaars](#voor-ontwikkelaars)
- [Disclaimer](#disclaimer)
- [Licentie](#licentie)

---

## Waarom bestaat deze app

Mensen onder beschermingsbewind, mentorschap of curatele krijgen jaarlijks een Rekening en Verantwoording (R&V) van hun bewindvoerder, mentor of curator, en moeten dan beslissen of ze deze ondertekenen. Toezicht door de kantonrechter is in de praktijk grotendeels reactief: zonder klacht wordt een R&V goedgekeurd. Eenmaal goedgekeurd, is er weinig verhaal meer.

Niet iedereen heeft de kennis, tijd of energie om zo'n document zelf rekenkundig en inhoudelijk te controleren — waardoor juist de mensen die deze bescherming nodig hebben, het minst in staat zijn om te controleren of hun eigen bewindvoerder het goed doet. RV-Checker is er om dat gat te dichten: een laagdrempelig hulpmiddel dat voor iedereen beschikbaar is, ongeacht boekhoudkundige kennis.

## Wat de app wel en niet doet

**Wel:**
- Rekenkundige controle: klopt het verschil tussen inkomsten en uitgaven met de daadwerkelijke verandering op de rekeningen? Klopt het vermogensoverzicht intern?
- Volledigheidscontrole: zijn verplichte onderdelen ingevuld als de situatie daarom vraagt (bijvoorbeeld: schulden gemeld, maar geen schuldeisers genoemd)?
- Toetsing van de in rekening gebrachte beloning aan het wettelijke richttarief.
- Signalering van patronen die de moeite waard zijn om na te vragen (bijvoorbeeld: een geoormerkte vergoeding ontvangen, maar niet doorbetaald).
- Een helder rapport met per bevinding: wat er is gevonden, waarom het relevant is, en wat u ermee kunt doen.

**Niet:**
- **Geen juridisch of financieel advies.** De app vervangt geen advocaat, het Juridisch Loket, of de kantonrechter.
- **Geen garantie dat alles gevonden is.** De app controleert wat ingevuld is; fouten die niet in het document staan of die buiten de geprogrammeerde regels vallen, worden niet gevonden.
- **Geen beschuldiging van fraude.** Een melding in het rapport is een signaal om na te vragen, geen vaststelling dat er iets mis is.
- **Geen garantie dat bedragen kloppen met de werkelijkheid.** De controles tonen of de cijfers in het document onderling consistent zijn — niet of ze overeenkomen met uw bankafschriften. Vergelijk begin- en eindsaldi altijd met uw eigen bank.

## Is mijn data echt privé?

Dit is het belangrijkste om te weten voordat u uw gegevens invult.

- **De app werkt volledig in uw eigen browser.** Er is geen server die uw gegevens ontvangt — er is namelijk helemaal geen server. Alle berekeningen en controles gebeuren lokaal, op uw eigen apparaat.
- **Geen account, geen inlog, geen tracking, geen cookies die u volgen.**
- **De broncode is volledig openbaar** en door iedereen te controleren: [github.com/WimLee115/RV-Checker](https://github.com/WimLee115/RV-Checker).
- **U kunt dit zelf verifiëren.** Open de ontwikkelaarstools van uw browser (meestal via de toets F12 of rechtermuisklik → "Inspecteren") en ga naar het tabblad **Netwerk**. Vul het formulier in en navigeer door de app: u ziet dat er, nadat de pagina geladen is, geen enkel netwerkverkeer meer plaatsvindt.
- **Wat wordt er lokaal opgeslagen?** Een concept van uw antwoorden wordt automatisch bewaard in de lokale opslag van uw browser (`localStorage`), zodat u niet alles opnieuw hoeft in te typen als u de pagina per ongeluk sluit. Dit verlaat nooit uw apparaat. U kunt dit altijd zelf wissen via de knop "Verwijder mijn gegevens" in de app, of door de sitegegevens van de app in uw browser te wissen.
- **Gebruikt u een gedeeld apparaat** (bijvoorbeeld in een bibliotheek)? Wis dan na gebruik uw gegevens via de knop in de app.

## Hoe gebruik ik de app

U kunt RV-Checker op twee manieren gebruiken:

1. **Als webpagina**, via de gehoste versie — werkt in elke moderne browser, op elk apparaat, zonder installatie.
2. **Als één los bestand**, te downloaden uit de [releases](https://github.com/WimLee115/RV-Checker/releases) als `RV-Checker.html`. Dubbelklik het bestand om het te openen in uw browser — er is geen installatie, internetverbinding of technische kennis voor nodig. Dit is de meest robuuste optie als u zeker wilt weten dat er nooit enige netwerkverbinding wordt gebruikt.

Stappen:

1. Pak uw R&V erbij (op papier of als PDF).
2. Loop de stappen in de app door, in uw eigen tempo — u kunt op elk moment tussentijds stoppen, de gegevens blijven bewaard.
3. Typ de bedragen en gegevens over zoals ze in uw R&V staan.
4. Bekijk op de laatste stap het rapport met de controle-uitkomsten.
5. Gebruik het rapport om te beslissen: ondertekenen, navraag doen bij uw bewindvoerder, of (tijdig) bezwaar maken bij de kantonrechter.
6. Druk het rapport af of sla het op als PDF via de knop onderaan het rapport.

De app is beschikbaar in het Nederlands, Engels, Arabisch en Pools, en ondersteunt een lichte en een donkere weergave.

## Wat betekenen de meldingen in het rapport

| Melding | Betekenis |
|---|---|
| **Fout** | Een objectieve rekenkundige fout: de cijfers in het document kloppen niet met elkaar. Dit is geen interpretatie — het is simpele optelling. |
| **Rode vlag** | Een serieus punt dat om een schriftelijke toelichting vraagt, maar dat op zichzelf geen bewijs van een fout is (bijvoorbeeld: een beloning boven het richttarief — dat kan een legitieme reden hebben, zoals btw). |
| **Aandachtspunt** | Een kleiner punt dat de moeite waard is om na te vragen, maar dat vaak een onschuldige verklaring heeft. |

Elke melding bevat een uitleg, een concrete suggestie voor wat u kunt doen, en — waar van toepassing — een link om direct naar het betreffende onderdeel van het formulier te springen.

## Veelgestelde vragen

**Is een melding in het rapport bewijs van fraude?**
Nee. Het is een signaal om na te vragen. Er kunnen volkomen legitieme verklaringen zijn. Gebruik het rapport als startpunt voor een gesprek met uw bewindvoerder, niet als eindoordeel.

**Kan ik met dit rapport weigeren te tekenen?**
De app geeft geen juridisch advies over uw rechten. Het rapport helpt u een geïnformeerde keuze te maken; de beslissing en de eventuele juridische stappen zijn aan u, eventueel met hulp van het Juridisch Loket of een advocaat.

**Is deze app door een instantie goedgekeurd of erkend?**
Nee. RV-Checker is een onafhankelijk, vrij beschikbaar hulpmiddel. Het is geen officieel product van de Rechtspraak, een toezichthouder of een brancheorganisatie.

**Weet de rechtbank zeker dat ik niet akkoord ben, als mijn bewindvoerder dat moet doorgeven?**
Niet gegarandeerd. De (al dan niet ondertekende) R&V gaat via de bewindvoerder zélf naar de rechtbank. Neem bij twijfel over wat er is doorgegeven zelf rechtstreeks contact op met de rechtbank waar de maatregel is uitgesproken, in plaats van alleen op doorgave door de bewindvoerder te vertrouwen.

**Kan ik een PDF of foto van mijn R&V inladen in plaats van alles over te typen?**
Nog niet — zie [Status en wat nog komt](#status-en-wat-nog-komt).

## Status en wat nog komt

RV-Checker is in actieve ontwikkeling. De huidige versie (v1) biedt:

- Een volledig formulier dat alle onderdelen van het officiële R&V-format dekt.
- Een regels-engine met controles op rekenkundige fouten, volledigheid, wettelijke tarieven en opvallende patronen.
- Een volledig rapport met het bovenstaande, inclusief printen/opslaan als PDF.
- Vier talen (Nederlands, Engels, Arabisch, Pools), lichte en donkere weergave.
- Automatisch lokaal opgeslagen concepten.

**Nog niet beschikbaar, wel gepland:**
- Een R&V rechtstreeks inladen als PDF of foto's, waarbij de app de gegevens automatisch probeert voor te vullen (met verplichte controle door uzelf voordat de analyse draait — er wordt nooit blind op een automatische uitlezing vertrouwd). Dit vraagt om tekstherkenning (voor PDF's) en beeldherkenning/OCR (voor foto's), beide volledig lokaal in de browser, zonder dat er iets wordt verstuurd.
- Vergelijking met een eigen bankafschrift, om ook te controleren of bedragen overeenkomen met de werkelijkheid — niet alleen of het document intern klopt.
- Een grondige, onafhankelijke beoordeling van de Arabische en Poolse vertalingen door moedertaalsprekers (de huidige vertalingen zijn zorgvuldig opgesteld, maar nog niet apart geverifieerd).

## Voor ontwikkelaars

RV-Checker is gebouwd met vanilla TypeScript en Vite — bewust zonder UI-framework en met een minimaal aantal dependencies, zodat de volledige broncode (en wat er daadwerkelijk naar de browser gaat) voor iedereen te controleren blijft.

```bash
npm install        # dependencies installeren
npm run dev         # lokale ontwikkelserver
npm test             # testsuite (Vitest)
npm run build        # productie-build naar dist/ (webversie, voor hosting)
npm run build:standalone  # één zelfstandig HTML-bestand naar dist-standalone/
```

**Projectstructuur:**

```
src/
├── core/        datamodel, berekeningen, geldformattering, opslag
├── i18n/        vertaalsysteem (t(), taaldetectie)
├── locales/     vertaalbestanden (nl/en/ar/pl)
├── rules/       de regels-engine en alle individuele controles
├── report/      rapport-weergave
├── ui/          formulier-componenten, stappen-navigatie, thema
└── pwa/         service worker-registratie
tests/            Vitest-tests, gespiegeld aan de src/-structuur
```

Bijdragen zijn welkom. Houd bij het toevoegen van nieuwe regels of formuliervelden rekening met:
- Geen bedragen als drijvende-kommagetallen — alles in gehele centen (`core/format.ts`).
- Geen kant-en-klare tekst in `rules/`-bestanden — alleen vertaalsleutels, zodat alle 4 talen automatisch blijven werken.
- Nieuwe vertaalsleutels moeten in **alle vier** de `locales/*.json`-bestanden staan (hier is een automatische test op: `tests/i18n/completeness.test.ts`).

## Disclaimer

RV-Checker is een onafhankelijk, gratis hulpmiddel en geeft geen juridisch of financieel advies. Gebruik van de app is op eigen verantwoordelijkheid. Raadpleeg bij twijfel een onafhankelijke deskundige, het Juridisch Loket, een advocaat, of de kantonrechter die toezicht houdt op het bewind, mentorschap of de curatele.

## Licentie

[GNU AGPL-3.0](LICENSE) — vrij te gebruiken, aan te passen en te verspreiden. Deze licentie is bewust gekozen boven een permissievere licentie (zoals MIT): AGPL verplicht dat ook een aangepaste of (op een server) gehoste versie van deze app zijn broncode openbaar deelt. Dat voorkomt dat iemand een fork kan maken die de privacybelofte van dit project — geen tracking, geen server, alles lokaal — ondermijnt zonder dat gebruikers dat kunnen zien of controleren.
