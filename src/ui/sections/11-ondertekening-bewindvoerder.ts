import type { RVData } from '../../core/types';
import { t } from '../../i18n/t';
import { h } from '../dom';
import { renderDateField, renderNumberField, renderRadioGroupField, renderTextAreaField, renderYesNoField } from '../fields';
import type { Store } from '../store';

export function renderOndertekeningBewindvoerderStap(store: Store<RVData>): HTMLElement {
  const data = store.get();
  const o = data.ondertekeningBewindvoerder;
  const onChange = (): void => store.notify();

  const container = h('section', { class: 'stap', 'data-stap': 'ondertekening-bewindvoerder' });

  function herbouw(): void {
    const kinderen: HTMLElement[] = [
      h('h2', {}, [t('steps.ondertekeningBewindvoerder.title')]),
      renderRadioGroupField(
        { id: 'ob-besproken', labelKey: 'steps.ondertekeningBewindvoerder.besproken' },
        [
          { value: 'ja', labelKey: 'steps.ondertekeningBewindvoerder.besproken.ja' },
          { value: 'neeNietGereageerd', labelKey: 'steps.ondertekeningBewindvoerder.besproken.neeNietGereageerd' },
          { value: 'neeAfgewezen', labelKey: 'steps.ondertekeningBewindvoerder.besproken.neeAfgewezen' },
          { value: 'neeNietInStaat', labelKey: 'steps.ondertekeningBewindvoerder.besproken.neeNietInStaat' },
        ],
        () => o.besproken,
        (v) => {
          o.besproken = v;
          onChange();
          herbouw();
        },
      ),
    ];

    if (o.besproken === 'ja') {
      kinderen.push(
        renderDateField({ id: 'ob-besproken-datum', labelKey: 'steps.ondertekeningBewindvoerder.besprokenDatum' }, () => o.besprokenDatum, (v) => {
          o.besprokenDatum = v;
          onChange();
        }),
      );
    }
    if (o.besproken !== null && o.besproken !== 'ja') {
      kinderen.push(
        renderTextAreaField(
          { id: 'ob-besproken-toelichting', labelKey: 'steps.ondertekeningBewindvoerder.besprokenToelichting' },
          () => o.besprokenToelichting,
          (v) => {
            o.besprokenToelichting = v;
            onChange();
          },
        ),
      );
    }

    kinderen.push(
      renderYesNoField(
        { id: 'ob-kan-beoordelen', labelKey: 'steps.ondertekeningBewindvoerder.kanBegrijpenEnBeoordelen' },
        () => o.kanBegrijpenEnBeoordelen,
        (v) => {
          o.kanBegrijpenEnBeoordelen = v;
          onChange();
          herbouw();
        },
      ),
    );

    if (o.kanBegrijpenEnBeoordelen === false) {
      kinderen.push(
        renderTextAreaField(
          { id: 'ob-kan-beoordelen-toelichting', labelKey: 'steps.ondertekeningBewindvoerder.kanBegrijpenEnBeoordelenToelichting' },
          () => o.kanBegrijpenEnBeoordelenToelichting,
          (v) => {
            o.kanBegrijpenEnBeoordelenToelichting = v;
            onChange();
          },
        ),
      );
    }

    kinderen.push(
      renderRadioGroupField(
        { id: 'ob-ondertekend', labelKey: 'steps.ondertekeningBewindvoerder.ondertekend' },
        [
          { value: 'ja', labelKey: 'steps.ondertekeningBewindvoerder.ondertekend.ja' },
          { value: 'neeNietGereageerd', labelKey: 'steps.ondertekeningBewindvoerder.ondertekend.neeNietGereageerd' },
          { value: 'neeAfgewezen', labelKey: 'steps.ondertekeningBewindvoerder.ondertekend.neeAfgewezen' },
          { value: 'neeNietInStaat', labelKey: 'steps.ondertekeningBewindvoerder.ondertekend.neeNietInStaat' },
          { value: 'neeNietAkkoord', labelKey: 'steps.ondertekeningBewindvoerder.ondertekend.neeNietAkkoord' },
        ],
        () => o.ondertekend,
        (v) => {
          o.ondertekend = v;
          onChange();
          herbouw();
        },
      ),
    );

    if (o.ondertekend !== null && o.ondertekend !== 'ja') {
      kinderen.push(
        renderTextAreaField(
          { id: 'ob-ondertekend-toelichting', labelKey: 'steps.ondertekeningBewindvoerder.ondertekendToelichting' },
          () => o.ondertekendToelichting,
          (v) => {
            o.ondertekendToelichting = v;
            onChange();
          },
        ),
      );
    }

    kinderen.push(
      renderNumberField(
        { id: 'ob-aantal-bijlagen', labelKey: 'steps.ondertekeningBewindvoerder.aantalBijlagen' },
        () => o.aantalBijlagen,
        (v) => {
          o.aantalBijlagen = v;
          onChange();
        },
      ),
    );

    container.replaceChildren(...kinderen);
  }

  herbouw();
  return container;
}
