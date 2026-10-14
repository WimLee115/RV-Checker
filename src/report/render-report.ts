import { formatEuro } from '../core/format';
import {
  afwijkingTotalen,
  controleVermogensopstelling,
  totaalInkomen,
  totaalSaldoBegindatum,
  totaalSaldoEinddatum,
  totaalUitgaven,
  verschilInkomenUitgaven,
  verschilRekeningenEindBegin,
} from '../core/calculations';
import type { RVData, RVSectionId } from '../core/types';
import { t } from '../i18n/t';
import { runRules } from '../rules/engine';
import { ALL_RULES } from '../rules/registry';
import type { Finding, Severity } from '../rules/types';
import { h } from '../ui/dom';
import { betrokkeneSignalen, groupBySeverity, SEVERITY_ORDER } from './group-by-severity';

const SEVERITY_GROUP_KEYS: Record<Severity, string> = {
  fout: 'report.severityGroup.fout',
  'rode-vlag': 'report.severityGroup.rodeVlag',
  aandachtspunt: 'report.severityGroup.aandachtspunt',
};

/** Elk bedrag in het rapport staat in een `dir="ltr"`-span — Nederlandse getalnotatie blijft
 *  leesbaar, ook temidden van RTL-vloeiende tekst (Arabisch). */
function renderBedrag(cents: number): HTMLElement {
  return h('span', { dir: 'ltr' }, [formatEuro(cents)]);
}

function renderCheckRow(labelKey: string, afwijking: number | null): HTMLElement {
  if (afwijking === null) {
    return h('tr', {}, [h('td', {}, [t(labelKey)]), h('td', { class: 'rapport-check-onbekend' }, [t('report.check.nietGecontroleerd')])]);
  }
  if (afwijking === 0) {
    return h('tr', {}, [h('td', {}, [t(labelKey)]), h('td', { class: 'rapport-check-ok' }, [t('report.check.ok')])]);
  }
  return h('tr', {}, [
    h('td', {}, [t(labelKey)]),
    h('td', { class: 'rapport-check-fout' }, [t('report.check.afwijking', { bedrag: '' }), renderBedrag(Math.abs(afwijking))]),
  ]);
}

function renderKerncijfers(data: RVData): HTMLElement {
  function rij(labelKey: string, cents: number): HTMLElement {
    return h('tr', {}, [h('td', {}, [t(labelKey)]), h('td', { class: 'rapport-bedrag' }, [renderBedrag(cents)])]);
  }

  return h('section', { class: 'rapport-kerncijfers' }, [
    h('h3', {}, [t('report.kerncijfers.title')]),
    h('table', {}, [
      h('tbody', {}, [
        rij('report.kerncijfers.totaalInkomen', totaalInkomen(data)),
        rij('report.kerncijfers.totaalUitgaven', totaalUitgaven(data)),
        rij('report.kerncijfers.verschilInkomenUitgaven', verschilInkomenUitgaven(data)),
        rij('report.kerncijfers.totaalSaldoBegindatum', totaalSaldoBegindatum(data)),
        rij('report.kerncijfers.totaalSaldoEinddatum', totaalSaldoEinddatum(data)),
        rij('report.kerncijfers.verschilRekeningen', verschilRekeningenEindBegin(data)),
        renderCheckRow('report.kerncijfers.check1', afwijkingTotalen(data)),
        renderCheckRow('report.kerncijfers.check2', controleVermogensopstelling(data)),
      ]),
    ]),
    h('p', { class: 'rapport-toelichting' }, [t('report.amountReconciliationNote')]),
  ]);
}

function renderFindingDetail(finding: Finding): HTMLElement | null {
  const detail = finding.detail;
  if (!detail) return null;

  if (detail.kind === 'amount') {
    return h('p', { class: 'bevinding-detail' }, [`${t(detail.labelKey)}: `, renderBedrag(Math.abs(detail.amountCents))]);
  }
  if (detail.kind === 'amount-pair') {
    return h('p', { class: 'bevinding-detail' }, [
      `${t(detail.labelKey)}: `,
      renderBedrag(detail.actualCents),
      ` (${t('report.detail.verwachtBedrag')}: `,
      renderBedrag(detail.expectedCents),
      ')',
    ]);
  }
  return null;
}

function renderFindingCard(finding: Finding, onGoToSection?: (section: RVSectionId) => void): HTMLElement {
  const kinderen: (Node | string)[] = [
    h('div', { class: 'bevinding-kop' }, [
      h('span', { class: `bevinding-badge bevinding-badge-${finding.severity}` }, [t(`severity.${finding.severity}`)]),
      h('h4', {}, [t(finding.titleKey)]),
    ]),
    h('p', {}, [t(finding.explanationKey, finding.params)]),
    h('p', { class: 'bevinding-suggestie' }, [t(finding.suggestionKey, finding.params)]),
  ];

  const detail = renderFindingDetail(finding);
  if (detail) kinderen.push(detail);

  if (onGoToSection && finding.section !== 'samenvatting') {
    kinderen.push(
      h(
        'button',
        { type: 'button', class: 'no-print bevinding-ga-naar-sectie', onClick: () => onGoToSection(finding.section) },
        [t('report.goToSection')],
      ),
    );
  }

  return h('div', { class: `bevinding bevinding-${finding.severity}` }, kinderen);
}

export function renderReport(data: RVData, onGoToSection?: (section: RVSectionId) => void): HTMLElement {
  const findings = runRules(data, ALL_RULES);
  const grouped = groupBySeverity(findings);
  const signalen = betrokkeneSignalen(findings);

  const kinderen: HTMLElement[] = [h('div', { class: 'rapport-disclaimer' }, [t('report.disclaimer')])];

  if (signalen.length > 0) {
    kinderen.push(
      h('section', { class: 'rapport-signalen' }, [
        h('h3', {}, [t('report.betrokkeneSignalen.title')]),
        ...signalen.map((f) => renderFindingCard(f, onGoToSection)),
      ]),
    );
  }

  kinderen.push(renderKerncijfers(data));

  for (const severity of SEVERITY_ORDER) {
    const groupKey = SEVERITY_GROUP_KEYS[severity];
    const findingsInGroup = grouped[severity];
    kinderen.push(
      h('section', { class: `rapport-groep rapport-groep-${severity}` }, [
        h('h3', {}, [t(`${groupKey}.title`)]),
        h('p', { class: 'rapport-groep-uitleg' }, [t(`${groupKey}.uitleg`)]),
        findingsInGroup.length > 0
          ? h('div', {}, findingsInGroup.map((f) => renderFindingCard(f, onGoToSection)))
          : h('p', { class: 'rapport-groep-leeg' }, [t(`${groupKey}.leeg`)]),
      ]),
    );
  }

  kinderen.push(
    h('section', { class: 'rapport-samenvatting' }, [
      h('h3', {}, [t('report.summary.title')]),
      h('p', {}, [
        t('report.summary.text', {
          foutCount: grouped.fout.length,
          rodeVlagCount: grouped['rode-vlag'].length,
          aandachtspuntCount: grouped.aandachtspunt.length,
        }),
      ]),
      h('p', {}, [t('report.summary.advies')]),
      h('p', {}, [t('report.summary.rechtbankWaarschuwing')]),
      h('button', { type: 'button', class: 'no-print rapport-print-knop', onClick: () => window.print() }, [t('report.printButton')]),
    ]),
  );

  return h('div', { class: 'rapport' }, kinderen);
}
