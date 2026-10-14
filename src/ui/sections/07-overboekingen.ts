import { createId } from '../../core/id';
import type { RVData } from '../../core/types';
import { t } from '../../i18n/t';
import { h } from '../dom';
import { renderRepeater } from '../repeater';
import type { Store } from '../store';

export function renderOverboekingenStap(store: Store<RVData>): HTMLElement {
  const data = store.get();
  const onChange = (): void => store.notify();

  const repeater = renderRepeater({
    idPrefix: 'overboeking',
    titleKey: 'steps.overboekingen.title',
    addButtonLabelKey: 'steps.overboekingen.add',
    emptyStateKey: 'steps.overboekingen.empty',
    fields: [
      { key: 'omschrijving', labelKey: 'steps.overboekingen.fields.omschrijving', type: 'text' },
      { key: 'vanRekening', labelKey: 'steps.overboekingen.fields.vanRekening', type: 'text' },
      { key: 'naarRekening', labelKey: 'steps.overboekingen.fields.naarRekening', type: 'text' },
      { key: 'bedrag', labelKey: 'steps.overboekingen.fields.bedrag', type: 'currency' },
    ],
    getItems: () => data.interneOverboekingen,
    setItems: (items) => (data.interneOverboekingen = items),
    createEmptyRow: () => ({ id: createId(), omschrijving: '', vanRekening: '', naarRekening: '', bedrag: null }),
    onDataChange: onChange,
  });

  return h('section', { class: 'stap', 'data-stap': 'overboekingen' }, [
    h('p', { class: 'stap-toelichting' }, [t('steps.overboekingen.toelichting')]),
    repeater,
  ]);
}
