import { createId } from '../../core/id';
import type { RVData } from '../../core/types';
import { t } from '../../i18n/t';
import { h } from '../dom';
import { renderDateField, renderSelectField, renderYesNoField } from '../fields';
import { renderRepeater } from '../repeater';
import type { Store } from '../store';

export function renderSchuldenStap(store: Store<RVData>): HTMLElement {
  const data = store.get();
  const schulden = data.schulden;
  const onChange = (): void => store.notify();

  const container = h('section', { class: 'stap', 'data-stap': 'schulden' });

  function herbouw(): void {
    const kinderen: HTMLElement[] = [
      h('h2', {}, [t('steps.schulden.title')]),
      renderYesNoField(
        { id: 'schulden-heeft', labelKey: 'steps.schulden.heeftSchulden' },
        () => schulden.heeftSchulden,
        (waarde) => {
          schulden.heeftSchulden = waarde;
          onChange();
          herbouw();
        },
      ),
    ];

    if (schulden.heeftSchulden) {
      kinderen.push(
        renderRepeater({
          idPrefix: 'schuldeiser',
          titleKey: 'steps.schulden.title',
          addButtonLabelKey: 'steps.schulden.schuldeisers.add',
          emptyStateKey: 'steps.schulden.schuldeisers.empty',
          fields: [
            { key: 'naam', labelKey: 'steps.schulden.fields.naam', type: 'text' },
            { key: 'bedragBegindatum', labelKey: 'steps.schulden.fields.bedragBegindatum', type: 'currency' },
            { key: 'bedragEinddatum', labelKey: 'steps.schulden.fields.bedragEinddatum', type: 'currency' },
          ],
          getItems: () => schulden.schuldeisers,
          setItems: (items) => (schulden.schuldeisers = items),
          createEmptyRow: () => ({ id: createId(), naam: '', bedragBegindatum: null, bedragEinddatum: null }),
          onDataChange: onChange,
        }),
        renderYesNoField(
          { id: 'schulden-hulpverlening', labelKey: 'steps.schulden.schuldhulpverlening' },
          () => schulden.schuldhulpverlening,
          (waarde) => {
            schulden.schuldhulpverlening = waarde;
            onChange();
            herbouw();
          },
        ),
      );

      if (schulden.schuldhulpverlening) {
        kinderen.push(
          renderSelectField(
            { id: 'schulden-traject', labelKey: 'steps.schulden.traject' },
            [
              { value: 'msnp', labelKey: 'steps.schulden.traject.msnp' },
              { value: 'wsnp', labelKey: 'steps.schulden.traject.wsnp' },
            ],
            () => schulden.traject,
            (waarde) => {
              schulden.traject = waarde;
              onChange();
              herbouw();
            },
          ),
        );

        if (schulden.traject === 'msnp') {
          kinderen.push(
            renderDateField(
              { id: 'schulden-msnp-aanmeld', labelKey: 'steps.schulden.msnpAanmelddatum' },
              () => schulden.msnpAanmelddatum,
              (waarde) => {
                schulden.msnpAanmelddatum = waarde;
                onChange();
              },
            ),
            renderDateField(
              { id: 'schulden-msnp-akkoord', labelKey: 'steps.schulden.msnpAkkoorddatum' },
              () => schulden.msnpAkkoorddatum,
              (waarde) => {
                schulden.msnpAkkoorddatum = waarde;
                onChange();
              },
            ),
          );
        } else if (schulden.traject === 'wsnp') {
          kinderen.push(
            renderDateField(
              { id: 'schulden-wsnp-toelating', labelKey: 'steps.schulden.wsnpToelatingsdatum' },
              () => schulden.wsnpToelatingsdatum,
              (waarde) => {
                schulden.wsnpToelatingsdatum = waarde;
                onChange();
              },
            ),
          );
        }

        kinderen.push(
          renderYesNoField(
            { id: 'schulden-traject-beeindigd', labelKey: 'steps.schulden.trajectBeeindigd' },
            () => schulden.trajectBeeindigd,
            (waarde) => {
              schulden.trajectBeeindigd = waarde;
              onChange();
              herbouw();
            },
          ),
        );

        if (schulden.trajectBeeindigd) {
          kinderen.push(
            renderDateField(
              { id: 'schulden-traject-beeindigd-datum', labelKey: 'steps.schulden.trajectBeeindigdDatum' },
              () => schulden.trajectBeeindigdDatum,
              (waarde) => {
                schulden.trajectBeeindigdDatum = waarde;
                onChange();
              },
            ),
          );
        }

        kinderen.push(
          renderYesNoField(
            { id: 'schulden-schone-lei', labelKey: 'steps.schulden.schoneLei' },
            () => schulden.schoneLei,
            (waarde) => {
              schulden.schoneLei = waarde;
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
