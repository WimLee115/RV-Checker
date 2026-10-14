import type { RVData } from '../../core/types';
import { t } from '../../i18n/t';
import { h } from '../dom';
import { renderDateField, renderTextAreaField, renderTextField, renderYesNoField } from '../fields';
import type { Store } from '../store';

export function renderMeningBetrokkeneStap(store: Store<RVData>): HTMLElement {
  const data = store.get();
  const m = data.meningBetrokkene;
  const onChange = (): void => store.notify();

  const container = h('section', { class: 'stap', 'data-stap': 'mening-betrokkene' });

  function herbouw(): void {
    const kinderen: HTMLElement[] = [
      h('h2', {}, [t('steps.meningBetrokkene.title')]),
      h('p', { class: 'stap-toelichting' }, [t('steps.meningBetrokkene.toelichting')]),
      renderYesNoField(
        { id: 'mb-eens', labelKey: 'steps.meningBetrokkene.eensMetAntwoorden' },
        () => m.eensMetAntwoorden,
        (v) => {
          m.eensMetAntwoorden = v;
          onChange();
          herbouw();
        },
      ),
    ];

    if (m.eensMetAntwoorden === false) {
      kinderen.push(
        renderTextAreaField({ id: 'mb-waarom-niet', labelKey: 'steps.meningBetrokkene.waaromNiet' }, () => m.waaromNiet, (v) => {
          m.waaromNiet = v;
          onChange();
        }),
      );
    }

    kinderen.push(
      renderTextField({ id: 'mb-plaats', labelKey: 'steps.meningBetrokkene.plaats' }, () => m.plaats, (v) => {
        m.plaats = v;
        onChange();
      }),
      renderDateField({ id: 'mb-datum', labelKey: 'steps.meningBetrokkene.datum' }, () => m.datum, (v) => {
        m.datum = v;
        onChange();
      }),
    );

    container.replaceChildren(...kinderen);
  }

  herbouw();
  return container;
}
