import type { Inkomen, RVData } from '../../core/types';
import { t } from '../../i18n/t';
import { h } from '../dom';
import { type CurrencyFieldSpec, renderCurrencyField, renderCurrencyFieldList, renderTextField } from '../fields';
import type { Store } from '../store';

type InkomenBedragVeld = Exclude<keyof Inkomen, 'overigeInkomstenSpecificatie' | 'gerapporteerdTotaal'>;

const VELDEN: CurrencyFieldSpec<InkomenBedragVeld>[] = [
  { key: 'salaris', labelKey: 'steps.inkomen.fields.salaris' },
  { key: 'uitkering', labelKey: 'steps.inkomen.fields.uitkering' },
  { key: 'pensioen', labelKey: 'steps.inkomen.fields.pensioen' },
  { key: 'vakantiegeld', labelKey: 'steps.inkomen.fields.vakantiegeld' },
  { key: 'inkomenUitOnderneming', labelKey: 'steps.inkomen.fields.inkomenUitOnderneming' },
  { key: 'bijzondereBijstandBewindMentorCurator', labelKey: 'steps.inkomen.fields.bijzondereBijstandBewindMentorCurator' },
  { key: 'bijzondereBijstandOverig', labelKey: 'steps.inkomen.fields.bijzondereBijstandOverig' },
  { key: 'huurinkomsten', labelKey: 'steps.inkomen.fields.huurinkomsten' },
  { key: 'belastingteruggave', labelKey: 'steps.inkomen.fields.belastingteruggave' },
  { key: 'toeslagenHuurtoeslag', labelKey: 'steps.inkomen.fields.toeslagenHuurtoeslag' },
  { key: 'toeslagenZorgtoeslag', labelKey: 'steps.inkomen.fields.toeslagenZorgtoeslag' },
  { key: 'toeslagenKinderopvangtoeslag', labelKey: 'steps.inkomen.fields.toeslagenKinderopvangtoeslag' },
  { key: 'toeslagenKindgebondenBudget', labelKey: 'steps.inkomen.fields.toeslagenKindgebondenBudget' },
  { key: 'tegemoetkomingReiskosten', labelKey: 'steps.inkomen.fields.tegemoetkomingReiskosten' },
  { key: 'tegemoetkomingZiektekostenWlz', labelKey: 'steps.inkomen.fields.tegemoetkomingZiektekostenWlz' },
  { key: 'rente', labelKey: 'steps.inkomen.fields.rente' },
  { key: 'dividend', labelKey: 'steps.inkomen.fields.dividend' },
  { key: 'schenkingen', labelKey: 'steps.inkomen.fields.schenkingen' },
  { key: 'nalatenschapUitkering', labelKey: 'steps.inkomen.fields.nalatenschapUitkering' },
  { key: 'alimentatieOntvangen', labelKey: 'steps.inkomen.fields.alimentatieOntvangen' },
  { key: 'kinderbijslag', labelKey: 'steps.inkomen.fields.kinderbijslag' },
  { key: 'studiefinancieringBetrokkene', labelKey: 'steps.inkomen.fields.studiefinancieringBetrokkene' },
  { key: 'terugstortingDerden', labelKey: 'steps.inkomen.fields.terugstortingDerden' },
  { key: 'vrijwilligersvergoeding', labelKey: 'steps.inkomen.fields.vrijwilligersvergoeding' },
  { key: 'overigeInkomsten', labelKey: 'steps.inkomen.fields.overigeInkomsten' },
];

export function renderInkomenStap(store: Store<RVData>): HTMLElement {
  const data = store.get();
  const inkomen = data.inkomen;
  const onChange = (): void => store.notify();

  const velden = renderCurrencyFieldList(
    'inkomen',
    VELDEN,
    (key) => inkomen[key],
    (key, waarde) => {
      inkomen[key] = waarde;
      onChange();
    },
  );

  const specificatie = renderTextField(
    { id: 'inkomen-overige-specificatie', labelKey: 'steps.inkomen.overigeInkomstenSpecificatie' },
    () => inkomen.overigeInkomstenSpecificatie,
    (waarde) => {
      inkomen.overigeInkomstenSpecificatie = waarde;
      onChange();
    },
  );

  const gerapporteerdTotaal = renderCurrencyField(
    { id: 'inkomen-gerapporteerd-totaal', labelKey: 'steps.inkomen.gerapporteerdTotaal' },
    () => inkomen.gerapporteerdTotaal,
    (waarde) => {
      inkomen.gerapporteerdTotaal = waarde;
      onChange();
    },
  );

  return h('section', { class: 'stap', 'data-stap': 'inkomen' }, [
    h('h2', {}, [t('steps.inkomen.title')]),
    ...velden,
    specificatie,
    h('hr', {}),
    gerapporteerdTotaal,
  ]);
}
