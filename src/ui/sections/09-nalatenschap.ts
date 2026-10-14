import type { RVData } from '../../core/types';
import { t } from '../../i18n/t';
import { h } from '../dom';
import { renderNumberField, renderSelectField, renderTextField, renderYesNoField } from '../fields';
import type { Store } from '../store';

export function renderNalatenschapStap(store: Store<RVData>): HTMLElement {
  const data = store.get();
  const n = data.nalatenschap;
  const onChange = (): void => store.notify();

  const container = h('section', { class: 'stap', 'data-stap': 'nalatenschap' });

  function tekstveld(id: string, labelKey: string, get: () => string, set: (v: string) => void): HTMLElement {
    return renderTextField({ id, labelKey }, get, (waarde) => {
      set(waarde);
      onChange();
    });
  }

  function jaNeeVeld(id: string, labelKey: string, get: () => boolean | null, set: (v: boolean) => void): HTMLElement {
    return renderYesNoField({ id, labelKey }, get, (waarde) => {
      set(waarde);
      onChange();
      herbouw();
    });
  }

  function herbouw(): void {
    const kinderen: HTMLElement[] = [
      h('h2', {}, [t('steps.nalatenschap.title')]),
      jaNeeVeld(
        'nalatenschap-heeft',
        'steps.nalatenschap.heeft',
        () => n.heeftOnverdeeldeNalatenschap,
        (v) => (n.heeftOnverdeeldeNalatenschap = v),
      ),
    ];

    if (n.heeftOnverdeeldeNalatenschap) {
      kinderen.push(
        tekstveld('nalatenschap-naam-overledene', 'steps.nalatenschap.naamOverledene', () => n.naamOverledene, (v) => (n.naamOverledene = v)),
        (() => {
          const input = h('input', { type: 'date', id: 'nalatenschap-datum-overlijden', value: n.datumOverlijden ?? '' }) as HTMLInputElement;
          input.addEventListener('change', () => {
            n.datumOverlijden = input.value === '' ? null : input.value;
            onChange();
          });
          return h('div', { class: 'veld' }, [h('label', { for: 'nalatenschap-datum-overlijden' }, [t('steps.nalatenschap.datumOverlijden')]), input]);
        })(),
        tekstveld('nalatenschap-familierelatie', 'steps.nalatenschap.familierelatie', () => n.familierelatie, (v) => (n.familierelatie = v)),
        renderSelectField(
          { id: 'nalatenschap-wijze', labelKey: 'steps.nalatenschap.wijzeVanAanvaarding' },
          [
            { value: 'zuiver', labelKey: 'steps.nalatenschap.wijzeVanAanvaarding.zuiver' },
            { value: 'beneficiair', labelKey: 'steps.nalatenschap.wijzeVanAanvaarding.beneficiair' },
            { value: 'verkoopMetToestemmingKantonrechter', labelKey: 'steps.nalatenschap.wijzeVanAanvaarding.verkoopMetToestemmingKantonrechter' },
          ],
          () => n.wijzeVanAanvaarding,
          (v) => {
            n.wijzeVanAanvaarding = v;
            onChange();
          },
        ),
        jaNeeVeld('nalatenschap-notaris-betrokken', 'steps.nalatenschap.notarisBetrokken', () => n.notarisBetrokken, (v) => (n.notarisBetrokken = v)),
      );

      if (n.notarisBetrokken) {
        kinderen.push(
          tekstveld('nalatenschap-naam-notaris', 'steps.nalatenschap.naamNotaris', () => n.naamNotaris, (v) => (n.naamNotaris = v)),
          tekstveld('nalatenschap-plaats-notaris', 'steps.nalatenschap.plaatsNotaris', () => n.plaatsNotaris, (v) => (n.plaatsNotaris = v)),
        );
      }

      kinderen.push(
        jaNeeVeld('nalatenschap-verklaring-erfrecht', 'steps.nalatenschap.verklaringVanErfrecht', () => n.verklaringVanErfrecht, (v) => (n.verklaringVanErfrecht = v)),
        jaNeeVeld('nalatenschap-executeur', 'steps.nalatenschap.executeurAangewezen', () => n.executeurAangewezen, (v) => (n.executeurAangewezen = v)),
      );

      if (n.executeurAangewezen) {
        kinderen.push(tekstveld('nalatenschap-naam-executeur', 'steps.nalatenschap.naamExecuteur', () => n.naamExecuteur, (v) => (n.naamExecuteur = v)));
      }

      kinderen.push(jaNeeVeld('nalatenschap-boedelbeschrijving', 'steps.nalatenschap.boedelbeschrijving', () => n.boedelbeschrijving, (v) => (n.boedelbeschrijving = v)));

      if (n.boedelbeschrijving) {
        kinderen.push(
          renderNumberField(
            { id: 'nalatenschap-boedelbeschrijving-termijn', labelKey: 'steps.nalatenschap.boedelbeschrijvingTermijnMaanden' },
            () => n.boedelbeschrijvingTermijnMaanden,
            (v) => {
              n.boedelbeschrijvingTermijnMaanden = v;
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
