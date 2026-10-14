import type { Betrokkene, Bewindvoerder, RVData } from '../../core/types';
import { t } from '../../i18n/t';
import { h } from '../dom';
import { renderSelectField, renderTextField, renderYesNoField } from '../fields';
import type { Store } from '../store';

function renderPersoonVelden(
  prefix: string,
  get: () => { achternaam: string; tussenvoegsel: string; voorletters: string; straat: string; huisnummer: string; toevoeging: string; postcode: string; woonplaats: string },
  onChange: () => void,
): HTMLElement[] {
  const persoon = get();
  const veld = (key: keyof typeof persoon, labelKey: string): HTMLElement =>
    renderTextField(
      { id: `${prefix}-${key}`, labelKey },
      () => persoon[key],
      (waarde) => {
        persoon[key] = waarde;
        onChange();
      },
    );

  return [
    veld('achternaam', 'steps.personen.fields.achternaam'),
    veld('tussenvoegsel', 'steps.personen.fields.tussenvoegsel'),
    veld('voorletters', 'steps.personen.fields.voorletters'),
    veld('straat', 'steps.personen.fields.straat'),
    veld('huisnummer', 'steps.personen.fields.huisnummer'),
    veld('toevoeging', 'steps.personen.fields.toevoeging'),
    veld('postcode', 'steps.personen.fields.postcode'),
    veld('woonplaats', 'steps.personen.fields.woonplaats'),
  ];
}

function renderBewindvoerderVelden(prefix: string, bv: Bewindvoerder, onChange: () => void): HTMLElement {
  const persoonVelden = renderPersoonVelden(prefix, () => bv, onChange);

  const telefoon = renderTextField(
    { id: `${prefix}-telefoon`, labelKey: 'steps.personen.fields.telefoonnummer' },
    () => bv.telefoonnummer,
    (waarde) => {
      bv.telefoonnummer = waarde;
      onChange();
    },
  );
  const email = renderTextField(
    { id: `${prefix}-email`, labelKey: 'steps.personen.fields.email' },
    () => bv.email,
    (waarde) => {
      bv.email = waarde;
      onChange();
    },
  );
  const rol = renderSelectField(
    { id: `${prefix}-rol`, labelKey: 'steps.personen.fields.rol' },
    [
      { value: 'bewind', labelKey: 'steps.personen.rol.bewind' },
      { value: 'curatele', labelKey: 'steps.personen.rol.curatele' },
      { value: 'mentorschap', labelKey: 'steps.personen.rol.mentorschap' },
    ],
    () => bv.rol,
    (waarde) => {
      bv.rol = waarde;
      onChange();
    },
  );
  const beloningCategorie = renderSelectField(
    { id: `${prefix}-beloningcategorie`, labelKey: 'steps.personen.fields.beloningCategorie' },
    [
      { value: 'familie', labelKey: 'steps.personen.beloningCategorie.familie' },
      { value: 'professioneel', labelKey: 'steps.personen.beloningCategorie.professioneel' },
    ],
    () => bv.beloningCategorie,
    (waarde) => {
      bv.beloningCategorie = waarde;
      onChange();
    },
  );

  return h('div', {}, [...persoonVelden, telefoon, email, rol, beloningCategorie]);
}

function createEmptyBewindvoerder(): Bewindvoerder {
  return {
    achternaam: '',
    tussenvoegsel: '',
    voorletters: '',
    straat: '',
    huisnummer: '',
    toevoeging: '',
    postcode: '',
    woonplaats: '',
    telefoonnummer: '',
    email: '',
    rol: null,
    beloningCategorie: null,
  };
}

export function renderPersonenStap(store: Store<RVData>): HTMLElement {
  const data = store.get();
  const onChange = (): void => store.notify();

  const bewindvoerder1Titel = h('h3', {}, [t('steps.personen.bewindvoerder1.title')]);
  const bewindvoerder1 = renderBewindvoerderVelden('bv1', data.persoonsgegevens.bewindvoerder1, onChange);

  const tweedeVraag = renderYesNoField(
    { id: 'heeft-tweede-bewindvoerder', labelKey: 'steps.personen.heeftTweedeBewindvoerder' },
    () => data.persoonsgegevens.bewindvoerder2 !== null,
    (waarde) => {
      data.persoonsgegevens.bewindvoerder2 = waarde ? createEmptyBewindvoerder() : null;
      onChange();
      herbouw();
    },
  );

  const betrokkeneTitel = h('h3', {}, [t('steps.personen.betrokkene.title')]);
  const betrokkeneVelden = renderPersoonVelden('betrokkene', () => data.persoonsgegevens.betrokkene as Betrokkene, onChange);
  const geboortedatum = h('div', { class: 'veld' }, [
    h('label', { for: 'betrokkene-geboortedatum' }, [t('steps.personen.fields.geboortedatum')]),
    (() => {
      const input = h('input', {
        type: 'date',
        id: 'betrokkene-geboortedatum',
        value: data.persoonsgegevens.betrokkene.geboortedatum ?? '',
      }) as HTMLInputElement;
      input.addEventListener('change', () => {
        data.persoonsgegevens.betrokkene.geboortedatum = input.value === '' ? null : input.value;
        onChange();
      });
      return input;
    })(),
  ]);

  const container = h('section', { class: 'stap', 'data-stap': 'personen' });

  function herbouw(): void {
    const kinderen: HTMLElement[] = [
      h('h2', {}, [t('steps.personen.title')]),
      bewindvoerder1Titel,
      bewindvoerder1,
      tweedeVraag,
    ];
    if (data.persoonsgegevens.bewindvoerder2) {
      kinderen.push(
        h('h3', {}, [t('steps.personen.bewindvoerder2.title')]),
        renderBewindvoerderVelden('bv2', data.persoonsgegevens.bewindvoerder2, onChange),
      );
    }
    kinderen.push(betrokkeneTitel, ...betrokkeneVelden, geboortedatum);
    container.replaceChildren(...kinderen);
  }

  herbouw();
  return container;
}
