import './style.css';
import { createEmptyRVData } from './core/defaults';
import { clearDraft, hasDraft, loadDraft, saveDraft } from './core/persistence';
import type { RVData, RVSectionId } from './core/types';
import { onLocaleChange, t } from './i18n/t';
import { registerServiceWorker } from './pwa/register-sw';
import { renderReport } from './report/render-report';
import { clear, h } from './ui/dom';
import { renderLanguageSwitcher } from './ui/language-switcher';
import { renderThemaSchakelaar } from './ui/theme-switcher';
import { onThemaChange } from './ui/theme';
import { renderBezittingenStap } from './ui/sections/06-bezittingen';
import { renderBijlagenStap } from './ui/sections/13-bijlagen';
import { renderDossierStap } from './ui/sections/01-dossier';
import { renderInkomenStap } from './ui/sections/03-inkomen';
import { renderMeningBetrokkeneStap } from './ui/sections/12-mening-betrokkene';
import { renderNalatenschapStap } from './ui/sections/09-nalatenschap';
import { renderOndertekeningBewindvoerderStap } from './ui/sections/11-ondertekening-bewindvoerder';
import { renderOpmerkingenStap } from './ui/sections/10-opmerkingen';
import { renderOverboekingenStap } from './ui/sections/07-overboekingen';
import { renderPersonenStap } from './ui/sections/02-personen';
import { renderPgbStap } from './ui/sections/05-pgb';
import { renderSchuldenStap } from './ui/sections/08-schulden';
import { renderUitgavenStap } from './ui/sections/04-uitgaven';
import { createStore } from './ui/store';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('#app ontbreekt in index.html');

interface StepDefinition {
  titleKey: string;
  /** `RVSectionId` van deze stap, voor de "ga naar deze sectie"-links in het rapport. `null` voor het rapport zelf. */
  section: RVSectionId | null;
  render: (store: ReturnType<typeof createStore<RVData>>) => HTMLElement;
}

// De eerste 13 stappen komen 1-op-1 overeen met de secties van het datamodel (§2 in het plan).
// De 14e ("Overzicht en rapport") draait de regels-engine over de huidige staat.
const INVOER_STAPPEN: StepDefinition[] = [
  { titleKey: 'steps.dossier.title', section: 'dossier', render: renderDossierStap },
  { titleKey: 'steps.personen.title', section: 'personen', render: renderPersonenStap },
  { titleKey: 'steps.inkomen.title', section: 'inkomen', render: renderInkomenStap },
  { titleKey: 'steps.uitgaven.title', section: 'uitgaven', render: renderUitgavenStap },
  { titleKey: 'steps.pgb.title', section: 'pgb', render: renderPgbStap },
  { titleKey: 'steps.bezittingen.title', section: 'bezittingen', render: renderBezittingenStap },
  { titleKey: 'steps.overboekingen.title', section: 'overboekingen', render: renderOverboekingenStap },
  { titleKey: 'steps.schulden.title', section: 'schulden', render: renderSchuldenStap },
  { titleKey: 'steps.nalatenschap.title', section: 'nalatenschap', render: renderNalatenschapStap },
  { titleKey: 'steps.opmerkingen.title', section: 'opmerkingen', render: renderOpmerkingenStap },
  { titleKey: 'steps.ondertekeningBewindvoerder.title', section: 'ondertekeningBewindvoerder', render: renderOndertekeningBewindvoerderStap },
  { titleKey: 'steps.meningBetrokkene.title', section: 'meningBetrokkene', render: renderMeningBetrokkeneStap },
  { titleKey: 'steps.bijlagen.title', section: 'bijlagen', render: renderBijlagenStap },
];

let autosaveTimer: ReturnType<typeof setTimeout> | undefined;
function plandeAutosave(store: ReturnType<typeof createStore<RVData>>): void {
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => saveDraft(store.get()), 500);
}

function renderApp(data: RVData): void {
  const store = createStore(data);
  store.subscribe(() => plandeAutosave(store));

  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveDraft(store.get());
  });
  window.addEventListener('beforeunload', () => saveDraft(store.get()));

  let huidigeStapIndex = 0;
  const RAPPORT_INDEX = INVOER_STAPPEN.length;
  const laatsteIndex = RAPPORT_INDEX;

  function gaNaarSectie(section: RVSectionId): void {
    const index = INVOER_STAPPEN.findIndex((stap) => stap.section === section);
    if (index !== -1) {
      huidigeStapIndex = index;
      render();
    }
  }

  // Volledige her-opbouw bij stapnavigatie of taalwissel — bewust, infrequent, zie plan §4/§5.
  // Ingevulde waarden blijven intact: die leven in `store`/`data`, niet in de afgebroken DOM.
  function render(): void {
    clear(app!);

    const alleTitelKeys = [...INVOER_STAPPEN.map((s) => s.titleKey), 'steps.overzicht.title'];
    const stapNavItems = alleTitelKeys.map((titleKey, index) =>
      h(
        'button',
        {
          type: 'button',
          class: index === huidigeStapIndex ? 'stappen-nav-item stappen-nav-item-actief' : 'stappen-nav-item',
          onClick: () => {
            huidigeStapIndex = index;
            render();
          },
        },
        [`${index + 1}. ${t(titleKey)}`],
      ),
    );

    const vorigeKnop = h(
      'button',
      {
        type: 'button',
        class: 'stap-navigatieknop no-print',
        disabled: huidigeStapIndex === 0 ? '' : undefined,
        onClick: () => {
          huidigeStapIndex = Math.max(0, huidigeStapIndex - 1);
          render();
        },
      },
      [t('nav.vorige')],
    );
    const volgendeKnop = h(
      'button',
      {
        type: 'button',
        class: 'stap-navigatieknop no-print',
        disabled: huidigeStapIndex === laatsteIndex ? '' : undefined,
        onClick: () => {
          huidigeStapIndex = Math.min(laatsteIndex, huidigeStapIndex + 1);
          render();
        },
      },
      [t('nav.volgende')],
    );

    const stapInhoud =
      huidigeStapIndex === RAPPORT_INDEX ? renderReport(store.get(), gaNaarSectie) : INVOER_STAPPEN[huidigeStapIndex]!.render(store);

    app!.append(
      h('h1', { class: 'no-print' }, [t('app.title')]),
      h('div', { class: 'topbar-schakelaars no-print' }, [renderLanguageSwitcher(), renderThemaSchakelaar()]),
      h('nav', { class: 'stappen-nav no-print', 'aria-label': 'Stappen' }, stapNavItems),
      stapInhoud,
      h('div', { class: 'stap-navigatieknoppen' }, [vorigeKnop, volgendeKnop]),
    );
  }

  render();
  onLocaleChange(render);
  onThemaChange(render);
}

function toonConceptBanner(): void {
  const bericht = h('span', {}, [t('app.restoreDraft.message')]);
  const doorgaanKnop = h(
    'button',
    {
      type: 'button',
      onClick: () => {
        const draft = loadDraft();
        renderApp(draft ?? createEmptyRVData());
      },
    },
    [t('app.restoreDraft.continue')],
  );
  const opnieuwKnop = h(
    'button',
    {
      type: 'button',
      onClick: () => {
        clearDraft();
        renderApp(createEmptyRVData());
      },
    },
    [t('app.restoreDraft.startOver')],
  );

  const banner = h('div', { class: 'concept-banner' }, [
    bericht,
    h('div', { class: 'concept-banner-knoppen' }, [doorgaanKnop, opnieuwKnop]),
  ]);

  clear(app!);
  app!.append(banner);
}

if (hasDraft()) {
  toonConceptBanner();
} else {
  renderApp(createEmptyRVData());
}

registerServiceWorker();
