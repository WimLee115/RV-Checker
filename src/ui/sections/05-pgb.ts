import type { RVData } from '../../core/types';
import { t } from '../../i18n/t';
import { h } from '../dom';
import { renderCurrencyField, renderSelectField, renderTextField, renderYesNoField } from '../fields';
import type { Store } from '../store';

export function renderPgbStap(store: Store<RVData>): HTMLElement {
  const data = store.get();
  const pgb = data.pgb;
  const onChange = (): void => store.notify();

  const container = h('section', { class: 'stap', 'data-stap': 'pgb' });

  function herbouw(): void {
    const kinderen: HTMLElement[] = [
      h('h2', {}, [t('steps.pgb.title')]),
      renderYesNoField(
        { id: 'pgb-heeft', labelKey: 'steps.pgb.heeftPgb' },
        () => pgb.heeftPgb,
        (waarde) => {
          pgb.heeftPgb = waarde;
          onChange();
          herbouw();
        },
      ),
    ];

    if (pgb.heeftPgb) {
      const beheerder = renderSelectField(
        { id: 'pgb-beheerder', labelKey: 'steps.pgb.beheerder' },
        [
          { value: 'bewindvoerderCurator', labelKey: 'steps.pgb.beheerder.bewindvoerderCurator' },
          { value: 'mentor', labelKey: 'steps.pgb.beheerder.mentor' },
          { value: 'overig', labelKey: 'steps.pgb.beheerder.overig' },
        ],
        () => pgb.beheerder,
        (waarde) => {
          pgb.beheerder = waarde;
          onChange();
          herbouw();
        },
      );
      kinderen.push(beheerder);

      if (pgb.beheerder === 'overig') {
        kinderen.push(
          renderTextField(
            { id: 'pgb-beheerder-overig', labelKey: 'steps.pgb.beheerderOverigOmschrijving' },
            () => pgb.beheerderOverigOmschrijving,
            (waarde) => {
              pgb.beheerderOverigOmschrijving = waarde;
              onChange();
            },
          ),
        );
      }

      kinderen.push(
        renderTextField(
          { id: 'pgb-iban', labelKey: 'steps.pgb.iban' },
          () => pgb.iban,
          (waarde) => {
            pgb.iban = waarde;
            onChange();
          },
        ),
        renderCurrencyField(
          { id: 'pgb-ontvangen-bedrag', labelKey: 'steps.pgb.ontvangenBedrag' },
          () => pgb.ontvangenBedrag,
          (waarde) => {
            pgb.ontvangenBedrag = waarde;
            onChange();
          },
        ),
        renderYesNoField(
          { id: 'pgb-volledig-gebruikt', labelKey: 'steps.pgb.volledigGebruikt' },
          () => pgb.volledigGebruikt,
          (waarde) => {
            pgb.volledigGebruikt = waarde;
            onChange();
            herbouw();
          },
        ),
      );

      if (pgb.volledigGebruikt === false) {
        kinderen.push(
          renderTextField(
            { id: 'pgb-waarom-niet', labelKey: 'steps.pgb.waaromNietVolledigGebruikt' },
            () => pgb.waaromNietVolledigGebruikt,
            (waarde) => {
              pgb.waaromNietVolledigGebruikt = waarde;
              onChange();
            },
          ),
        );
      }
    }

    container.replaceChildren(...kinderen);
  }

  herbouw();
  return container;
}
