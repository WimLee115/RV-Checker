import type { RVData } from '../../core/types';
import { t } from '../../i18n/t';
import { h } from '../dom';
import { renderDateField, renderTextField, renderYesNoField } from '../fields';
import type { Store } from '../store';

/** Bouwt de "Dossiergegevens"-stap. Her-bouwen gebeurt alleen bij stap-navigatie/taalwissel. */
export function renderDossierStap(store: Store<RVData>): HTMLElement {
  const data = store.get();

  const titel = h('h2', {}, [t('steps.dossier.title')]);

  const dossiernummer = renderTextField(
    { id: 'dossiernummer', labelKey: 'steps.dossier.dossiernummer' },
    () => data.dossiergegevens.dossiernummer,
    (waarde) => {
      data.dossiergegevens.dossiernummer = waarde;
      store.notify();
    },
  );

  const periodeVan = renderDateField(
    { id: 'periode-van', labelKey: 'steps.dossier.periodeVan' },
    () => data.dossiergegevens.periodeVan,
    (waarde) => {
      data.dossiergegevens.periodeVan = waarde;
      store.notify();
    },
  );

  const periodeTotEnMet = renderDateField(
    { id: 'periode-tot', labelKey: 'steps.dossier.periodeTotEnMet' },
    () => data.dossiergegevens.periodeTotEnMet,
    (waarde) => {
      data.dossiergegevens.periodeTotEnMet = waarde;
      store.notify();
    },
  );

  const problematischeSchulden = renderYesNoField(
    { id: 'reden-problematische-schulden', labelKey: 'steps.dossier.redenProblematischeSchulden' },
    () => data.dossiergegevens.redenProblematischeSchulden,
    (waarde) => {
      data.dossiergegevens.redenProblematischeSchulden = waarde;
      store.notify();
    },
  );

  return h('section', { class: 'stap', 'data-stap': 'dossier' }, [
    titel,
    dossiernummer,
    periodeVan,
    periodeTotEnMet,
    problematischeSchulden,
  ]);
}
