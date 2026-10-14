import type { RVData } from '../../core/types';
import { t } from '../../i18n/t';
import { h } from '../dom';
import { renderTextAreaField } from '../fields';
import type { Store } from '../store';

export function renderOpmerkingenStap(store: Store<RVData>): HTMLElement {
  const data = store.get();
  const onChange = (): void => store.notify();

  const veld = renderTextAreaField(
    { id: 'opmerkingen-tekst', labelKey: 'steps.opmerkingen.tekst' },
    () => data.opmerkingen,
    (waarde) => {
      data.opmerkingen = waarde;
      onChange();
    },
  );

  return h('section', { class: 'stap', 'data-stap': 'opmerkingen' }, [
    h('h2', {}, [t('steps.opmerkingen.title')]),
    h('p', { class: 'stap-toelichting' }, [t('steps.opmerkingen.toelichting')]),
    veld,
  ]);
}
