import { formatEuro, parseEuroInput } from '../core/format';
import type { CentAmount } from '../core/types';
import { t } from '../i18n/t';
import { h } from './dom';

interface FieldOptions {
  id: string;
  labelKey: string;
}

/**
 * Elk veld is "ongecontroleerd": de waarde wordt één keer gezet bij het bouwen, en de
 * input zelf wordt nooit opnieuw gerenderd als reactie op zijn eigen wijziging — dat zou de
 * cursorpositie/focus verliezen tijdens het typen. `set()` schrijft direct in de store;
 * her-render gebeurt alleen bij stap-navigatie, taalwissel of rij toevoegen/verwijderen.
 */
export function renderTextField(opts: FieldOptions, get: () => string, set: (value: string) => void): HTMLElement {
  const input = h('input', { type: 'text', id: opts.id, value: get() }) as HTMLInputElement;
  input.addEventListener('input', () => set(input.value));

  const label = h('label', { for: opts.id }, [t(opts.labelKey)]);
  return h('div', { class: 'veld' }, [label, input]);
}

/** Toont lege invoer als niets geformatteerds (een leeg bedragveld is geldig — "niet ingevuld"). */
function toDisplayValue(cents: CentAmount): string {
  return cents === null ? '' : formatEuro(cents).replace(/^-?€\s*/, (match) => (match.startsWith('-') ? '-' : ''));
}

export function renderCurrencyField(
  opts: FieldOptions,
  get: () => CentAmount,
  set: (value: CentAmount) => void,
): HTMLElement {
  const input = h('input', {
    type: 'text',
    inputmode: 'decimal',
    dir: 'ltr', // bedragen blijven altijd links-naar-rechts, ook in een RTL-taal — zie plan §5
    id: opts.id,
    value: toDisplayValue(get()),
  }) as HTMLInputElement;

  input.addEventListener('blur', () => {
    const parsed = parseEuroInput(input.value);
    if (parsed === undefined) {
      input.setAttribute('aria-invalid', 'true');
      return; // ongeldige invoer: veld blijft geblokkeerd tot het leesbaar is, niets wordt opgeslagen
    }
    input.removeAttribute('aria-invalid');
    set(parsed);
    input.value = toDisplayValue(parsed);
  });

  const label = h('label', { for: opts.id }, [t(opts.labelKey)]);
  const prefix = h('span', { class: 'veld-bedrag-prefix', 'aria-hidden': 'true' }, ['€']);
  return h('div', { class: 'veld veld-bedrag' }, [label, h('div', { class: 'veld-bedrag-invoer' }, [prefix, input])]);
}

export function renderDateField(opts: FieldOptions, get: () => string | null, set: (value: string | null) => void): HTMLElement {
  const input = h('input', { type: 'date', id: opts.id, value: get() ?? '' }) as HTMLInputElement;
  input.addEventListener('change', () => set(input.value === '' ? null : input.value));

  const label = h('label', { for: opts.id }, [t(opts.labelKey)]);
  return h('div', { class: 'veld' }, [label, input]);
}

export function renderNumberField(
  opts: FieldOptions,
  get: () => number | null,
  set: (value: number | null) => void,
): HTMLElement {
  const input = h('input', {
    type: 'text',
    inputmode: 'numeric',
    dir: 'ltr',
    id: opts.id,
    value: get() === null ? '' : String(get()),
  }) as HTMLInputElement;

  input.addEventListener('blur', () => {
    if (input.value.trim() === '') {
      input.removeAttribute('aria-invalid');
      set(null);
      return;
    }
    const parsed = Number(input.value.trim());
    if (!Number.isFinite(parsed) || !/^\d+$/.test(input.value.trim())) {
      input.setAttribute('aria-invalid', 'true');
      return;
    }
    input.removeAttribute('aria-invalid');
    set(parsed);
  });

  const label = h('label', { for: opts.id }, [t(opts.labelKey)]);
  return h('div', { class: 'veld' }, [label, input]);
}

export function renderTextAreaField(opts: FieldOptions, get: () => string, set: (value: string) => void): HTMLElement {
  const textarea = h('textarea', { id: opts.id, rows: '3' }) as HTMLTextAreaElement;
  textarea.value = get();
  textarea.addEventListener('input', () => set(textarea.value));

  const label = h('label', { for: opts.id }, [t(opts.labelKey)]);
  return h('div', { class: 'veld' }, [label, textarea]);
}

export interface SelectOption<T extends string> {
  value: T;
  labelKey: string;
}

export function renderSelectField<T extends string>(
  opts: FieldOptions,
  options: SelectOption<T>[],
  get: () => T | null,
  set: (value: T) => void,
): HTMLElement {
  const huidigeWaarde = get();
  const leegOptie = h('option', { value: '' }, ['—']) as HTMLOptionElement;
  const select = h(
    'select',
    { id: opts.id },
    [leegOptie, ...options.map((optie) => h('option', { value: optie.value }, [t(optie.labelKey)]))],
  ) as HTMLSelectElement;
  select.value = huidigeWaarde ?? '';
  select.addEventListener('change', () => {
    if (select.value !== '') set(select.value as T);
  });

  const label = h('label', { for: opts.id }, [t(opts.labelKey)]);
  return h('div', { class: 'veld' }, [label, select]);
}

/**
 * Rendert een lijst geldvelden uit één config (sleutel + i18n-sleutel) in plaats van elk veld
 * met een losse `renderCurrencyField`-aanroep te herhalen — nodig gezien het aantal
 * inkomsten-/uitgavenposten (~20 resp. ~45) uit het officiële format.
 */
export interface CurrencyFieldSpec<K extends string> {
  key: K;
  labelKey: string;
}

export function renderCurrencyFieldList<K extends string>(
  idPrefix: string,
  specs: CurrencyFieldSpec<K>[],
  get: (key: K) => CentAmount,
  set: (key: K, value: CentAmount) => void,
): HTMLElement[] {
  return specs.map((spec) =>
    renderCurrencyField(
      { id: `${idPrefix}-${spec.key}`, labelKey: spec.labelKey },
      () => get(spec.key),
      (value) => set(spec.key, value),
    ),
  );
}

/** Radiogroep met meer dan twee opties (bv. de verschillende redenen van niet-ondertekenen). */
export function renderRadioGroupField<T extends string>(
  opts: FieldOptions,
  options: SelectOption<T>[],
  get: () => T | null,
  set: (value: T) => void,
): HTMLElement {
  const huidigeWaarde = get();

  const optieElementen = options.map((optie) => {
    const optieId = `${opts.id}-${optie.value}`;
    const input = h('input', {
      type: 'radio',
      name: opts.id,
      id: optieId,
      checked: huidigeWaarde === optie.value ? '' : undefined,
    }) as HTMLInputElement;
    input.addEventListener('change', () => set(optie.value));
    const label = h('label', { for: optieId }, [t(optie.labelKey)]);
    return h('div', { class: 'veld-radiogroep-optie' }, [input, label]);
  });

  const legend = h('legend', {}, [t(opts.labelKey)]);
  return h('fieldset', { class: 'veld veld-radiogroep' }, [legend, ...optieElementen]);
}

/**
 * Ja/Nee als twee radioknoppen, niet als checkbox: `null` ("nog niet beantwoord") is een
 * geldige derde toestand die een checkbox niet kan weergeven.
 */
export function renderYesNoField(
  opts: FieldOptions,
  get: () => boolean | null,
  set: (value: boolean) => void,
): HTMLElement {
  const huidigeWaarde = get();

  const maakOptie = (waarde: boolean, labelKey: string): HTMLElement => {
    const optieId = `${opts.id}-${waarde ? 'ja' : 'nee'}`;
    const input = h('input', {
      type: 'radio',
      name: opts.id,
      id: optieId,
      checked: huidigeWaarde === waarde ? '' : undefined,
    }) as HTMLInputElement;
    input.addEventListener('change', () => set(waarde));
    const label = h('label', { for: optieId }, [t(labelKey)]);
    return h('span', { class: 'veld-janee-optie' }, [input, label]);
  };

  const legend = h('legend', {}, [t(opts.labelKey)]);
  return h('fieldset', { class: 'veld veld-janee' }, [
    legend,
    maakOptie(true, 'common.ja'),
    maakOptie(false, 'common.nee'),
  ]);
}
