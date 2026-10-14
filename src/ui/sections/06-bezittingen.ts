import { createId } from '../../core/id';
import type { RVData } from '../../core/types';
import { t } from '../../i18n/t';
import { h } from '../dom';
import { renderRepeater } from '../repeater';
import type { Store } from '../store';

const F = {
  omschrijving: 'steps.bezittingen.fields.omschrijving',
  iban: 'steps.bezittingen.fields.iban',
  saldoBegindatum: 'steps.bezittingen.fields.saldoBegindatum',
  saldoEinddatum: 'steps.bezittingen.fields.saldoEinddatum',
  waardeBegindatum: 'steps.bezittingen.fields.waardeBegindatum',
  waardeEinddatum: 'steps.bezittingen.fields.waardeEinddatum',
  polisnummer: 'steps.bezittingen.fields.polisnummer',
  wozWaardeActueel: 'steps.bezittingen.fields.wozWaardeActueel',
  hypotheekstandBegindatum: 'steps.bezittingen.fields.hypotheekstandBegindatum',
  hypotheekstandEinddatum: 'steps.bezittingen.fields.hypotheekstandEinddatum',
  naamSchuldenaar: 'steps.bezittingen.fields.naamSchuldenaar',
  standBegindatum: 'steps.bezittingen.fields.standBegindatum',
  standEinddatum: 'steps.bezittingen.fields.standEinddatum',
};

export function renderBezittingenStap(store: Store<RVData>): HTMLElement {
  const data = store.get();
  const b = data.bezittingen;
  const onChange = (): void => store.notify();

  const bankSpaarrekeningen = renderRepeater({
    idPrefix: 'bank-spaar',
    titleKey: 'steps.bezittingen.bankSpaarrekeningen.title',
    addButtonLabelKey: 'steps.bezittingen.bankSpaarrekeningen.add',
    emptyStateKey: 'steps.bezittingen.bankSpaarrekeningen.empty',
    fields: [
      { key: 'omschrijving', labelKey: F.omschrijving, type: 'text' },
      { key: 'iban', labelKey: F.iban, type: 'text' },
      { key: 'saldoBegindatum', labelKey: F.saldoBegindatum, type: 'currency' },
      { key: 'saldoEinddatum', labelKey: F.saldoEinddatum, type: 'currency' },
    ],
    getItems: () => b.bankSpaarrekeningen,
    setItems: (items) => (b.bankSpaarrekeningen = items),
    createEmptyRow: () => ({ id: createId(), omschrijving: '', iban: '', saldoBegindatum: null, saldoEinddatum: null }),
    onDataChange: onChange,
  });

  const leefgeldrekeningen = renderRepeater({
    idPrefix: 'leefgeld',
    titleKey: 'steps.bezittingen.leefgeldrekeningen.title',
    addButtonLabelKey: 'steps.bezittingen.leefgeldrekeningen.add',
    emptyStateKey: 'steps.bezittingen.leefgeldrekeningen.empty',
    fields: [
      { key: 'omschrijving', labelKey: F.omschrijving, type: 'text' },
      { key: 'iban', labelKey: F.iban, type: 'text' },
      { key: 'saldoBegindatum', labelKey: F.saldoBegindatum, type: 'currency' },
      { key: 'saldoEinddatum', labelKey: F.saldoEinddatum, type: 'currency' },
    ],
    getItems: () => b.leefgeldrekeningen,
    setItems: (items) => (b.leefgeldrekeningen = items),
    createEmptyRow: () => ({ id: createId(), omschrijving: '', iban: '', saldoBegindatum: null, saldoEinddatum: null }),
    onDataChange: onChange,
  });

  const aandelenObligaties = renderRepeater({
    idPrefix: 'aandelen',
    titleKey: 'steps.bezittingen.aandelenObligaties.title',
    addButtonLabelKey: 'steps.bezittingen.aandelenObligaties.add',
    emptyStateKey: 'steps.bezittingen.aandelenObligaties.empty',
    fields: [
      { key: 'omschrijving', labelKey: F.omschrijving, type: 'text' },
      { key: 'waardeBegindatum', labelKey: F.waardeBegindatum, type: 'currency' },
      { key: 'waardeEinddatum', labelKey: F.waardeEinddatum, type: 'currency' },
    ],
    getItems: () => b.aandelenObligaties,
    setItems: (items) => (b.aandelenObligaties = items),
    createEmptyRow: () => ({ id: createId(), omschrijving: '', waardeBegindatum: null, waardeEinddatum: null }),
    onDataChange: onChange,
  });

  const verzekeringen = renderRepeater({
    idPrefix: 'verzekering',
    titleKey: 'steps.bezittingen.verzekeringen.title',
    addButtonLabelKey: 'steps.bezittingen.verzekeringen.add',
    emptyStateKey: 'steps.bezittingen.verzekeringen.empty',
    fields: [
      { key: 'polisnummer', labelKey: F.polisnummer, type: 'text' },
      { key: 'waardeBegindatum', labelKey: F.waardeBegindatum, type: 'currency' },
      { key: 'waardeEinddatum', labelKey: F.waardeEinddatum, type: 'currency' },
    ],
    getItems: () => b.verzekeringen,
    setItems: (items) => (b.verzekeringen = items),
    createEmptyRow: () => ({ id: createId(), polisnummer: '', waardeBegindatum: null, waardeEinddatum: null }),
    onDataChange: onChange,
  });

  const onroerendGoed = renderRepeater({
    idPrefix: 'onroerend-goed',
    titleKey: 'steps.bezittingen.onroerendGoed.title',
    addButtonLabelKey: 'steps.bezittingen.onroerendGoed.add',
    emptyStateKey: 'steps.bezittingen.onroerendGoed.empty',
    fields: [
      { key: 'omschrijving', labelKey: F.omschrijving, type: 'text' },
      { key: 'wozWaardeActueel', labelKey: F.wozWaardeActueel, type: 'currency' },
      { key: 'hypotheekstandBegindatum', labelKey: F.hypotheekstandBegindatum, type: 'currency' },
      { key: 'hypotheekstandEinddatum', labelKey: F.hypotheekstandEinddatum, type: 'currency' },
    ],
    getItems: () => b.onroerendGoed,
    setItems: (items) => (b.onroerendGoed = items),
    createEmptyRow: () => ({
      id: createId(),
      omschrijving: '',
      wozWaardeActueel: null,
      hypotheekstandBegindatum: null,
      hypotheekstandEinddatum: null,
    }),
    onDataChange: onChange,
  });

  const waardevolleRoerendeGoederen = renderRepeater({
    idPrefix: 'roerend-goed',
    titleKey: 'steps.bezittingen.waardevolleRoerendeGoederen.title',
    addButtonLabelKey: 'steps.bezittingen.waardevolleRoerendeGoederen.add',
    emptyStateKey: 'steps.bezittingen.waardevolleRoerendeGoederen.empty',
    fields: [
      { key: 'omschrijving', labelKey: F.omschrijving, type: 'text' },
      { key: 'waardeBegindatum', labelKey: F.waardeBegindatum, type: 'currency' },
      { key: 'waardeEinddatum', labelKey: F.waardeEinddatum, type: 'currency' },
    ],
    getItems: () => b.waardevolleRoerendeGoederen,
    setItems: (items) => (b.waardevolleRoerendeGoederen = items),
    createEmptyRow: () => ({ id: createId(), omschrijving: '', waardeBegindatum: null, waardeEinddatum: null }),
    onDataChange: onChange,
  });

  const vorderingen = renderRepeater({
    idPrefix: 'vordering',
    titleKey: 'steps.bezittingen.vorderingen.title',
    addButtonLabelKey: 'steps.bezittingen.vorderingen.add',
    emptyStateKey: 'steps.bezittingen.vorderingen.empty',
    fields: [
      { key: 'naamSchuldenaar', labelKey: F.naamSchuldenaar, type: 'text' },
      { key: 'standBegindatum', labelKey: F.standBegindatum, type: 'currency' },
      { key: 'standEinddatum', labelKey: F.standEinddatum, type: 'currency' },
    ],
    getItems: () => b.vorderingen,
    setItems: (items) => (b.vorderingen = items),
    createEmptyRow: () => ({ id: createId(), naamSchuldenaar: '', standBegindatum: null, standEinddatum: null }),
    onDataChange: onChange,
  });

  return h('section', { class: 'stap', 'data-stap': 'bezittingen' }, [
    h('h2', {}, [t('steps.bezittingen.title')]),
    bankSpaarrekeningen,
    leefgeldrekeningen,
    aandelenObligaties,
    verzekeringen,
    onroerendGoed,
    waardevolleRoerendeGoederen,
    vorderingen,
  ]);
}
