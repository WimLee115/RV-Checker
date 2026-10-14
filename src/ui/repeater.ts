import type { CentAmount } from '../core/types';
import { t } from '../i18n/t';
import { h } from './dom';
import { renderCurrencyField, renderDateField, renderTextField } from './fields';

export interface RepeaterFieldSpec<T> {
  key: keyof T;
  labelKey: string;
  type: 'text' | 'currency' | 'date';
}

export interface RepeaterOptions<T extends { id: string }> {
  idPrefix: string;
  titleKey: string;
  addButtonLabelKey: string;
  emptyStateKey: string;
  fields: RepeaterFieldSpec<T>[];
  getItems: () => T[];
  setItems: (items: T[]) => void;
  createEmptyRow: () => T;
  /** Aangeroepen na elke veldwijziging/rij toevoegen/verwijderen — meestal `store.notify()`. */
  onDataChange: () => void;
}

/**
 * Eén generieke herhaalbare-rijen-component, hergebruikt voor alle negen herhaalbare
 * secties (bankrekeningen, schuldeisers, interne overboekingen, ...). Rijen zijn gestapelde
 * kaarten, geen brede tabel — werkt beter op een telefoon en is makkelijker RTL-correct te
 * houden dan een tabel met vaste kolomvolgorde.
 *
 * Toevoegen/verwijderen bouwt alleen déze component opnieuw op (niet de hele pagina) — dat
 * is, net als stapnavigatie en taalwissel, een bewuste, niet-frequente actie, geen toetsaanslag.
 */
export function renderRepeater<T extends { id: string }>(opts: RepeaterOptions<T>): HTMLElement {
  const container = h('div', { class: 'herhaalgroep' });

  function renderVeld(item: T, index: number, spec: RepeaterFieldSpec<T>): HTMLElement {
    const id = `${opts.idPrefix}-${index}-${String(spec.key)}`;
    const schrijf = (waarde: unknown): void => {
      (item as Record<string, unknown>)[spec.key as string] = waarde;
      opts.onDataChange();
    };

    if (spec.type === 'currency') {
      return renderCurrencyField({ id, labelKey: spec.labelKey }, () => item[spec.key] as CentAmount, schrijf);
    }
    if (spec.type === 'date') {
      return renderDateField({ id, labelKey: spec.labelKey }, () => item[spec.key] as string | null, schrijf);
    }
    return renderTextField({ id, labelKey: spec.labelKey }, () => item[spec.key] as string, schrijf);
  }

  function renderRij(item: T, index: number): HTMLElement {
    const velden = opts.fields.map((spec) => renderVeld(item, index, spec));
    const verwijderKnop = h(
      'button',
      {
        type: 'button',
        class: 'herhaalgroep-verwijderen',
        onClick: () => {
          opts.setItems(opts.getItems().filter((i) => i.id !== item.id));
          opts.onDataChange();
          render();
        },
      },
      [t('common.verwijderen')],
    );
    return h('div', { class: 'herhaalgroep-rij' }, [...velden, verwijderKnop]);
  }

  function render(): void {
    const items = opts.getItems();
    const titel = h('h3', {}, [t(opts.titleKey)]);
    const rijen = items.length > 0 ? items.map(renderRij) : [h('p', { class: 'herhaalgroep-leeg' }, [t(opts.emptyStateKey)])];
    const toevoegKnop = h(
      'button',
      {
        type: 'button',
        class: 'herhaalgroep-toevoegen',
        onClick: () => {
          opts.setItems([...opts.getItems(), opts.createEmptyRow()]);
          opts.onDataChange();
          render();
        },
      },
      [t(opts.addButtonLabelKey)],
    );

    container.replaceChildren(titel, ...rijen, toevoegKnop);
  }

  render();
  return container;
}
