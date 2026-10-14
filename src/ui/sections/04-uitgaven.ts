import type { RVData, Uitgaven } from '../../core/types';
import { t } from '../../i18n/t';
import { h } from '../dom';
import { type CurrencyFieldSpec, renderCurrencyField, renderCurrencyFieldList, renderTextField } from '../fields';
import type { Store } from '../store';

type UitgavenBedragVeld = Exclude<keyof Uitgaven, 'overigeUitgavenSpecificatie' | 'gerapporteerdTotaal'>;

const VELDEN: CurrencyFieldSpec<UitgavenBedragVeld>[] = [
  { key: 'leefgeldZakgeld', labelKey: 'steps.uitgaven.fields.leefgeldZakgeld' },
  { key: 'huurKostgeld', labelKey: 'steps.uitgaven.fields.huurKostgeld' },
  { key: 'hypotheekRenteAflossing', labelKey: 'steps.uitgaven.fields.hypotheekRenteAflossing' },
  { key: 'energie', labelKey: 'steps.uitgaven.fields.energie' },
  { key: 'water', labelKey: 'steps.uitgaven.fields.water' },
  { key: 'vasteTelefoonTvInternet', labelKey: 'steps.uitgaven.fields.vasteTelefoonTvInternet' },
  { key: 'mobieleTelefoon', labelKey: 'steps.uitgaven.fields.mobieleTelefoon' },
  { key: 'servicekosten', labelKey: 'steps.uitgaven.fields.servicekosten' },
  { key: 'premieZiektekostenverzekering', labelKey: 'steps.uitgaven.fields.premieZiektekostenverzekering' },
  { key: 'premieBrandInboedelAansprakelijkheid', labelKey: 'steps.uitgaven.fields.premieBrandInboedelAansprakelijkheid' },
  { key: 'premieAutoverzekering', labelKey: 'steps.uitgaven.fields.premieAutoverzekering' },
  { key: 'premieUitvaartverzekering', labelKey: 'steps.uitgaven.fields.premieUitvaartverzekering' },
  { key: 'premiePakketverzekeringOverig', labelKey: 'steps.uitgaven.fields.premiePakketverzekeringOverig' },
  { key: 'kledingEnSchoenen', labelKey: 'steps.uitgaven.fields.kledingEnSchoenen' },
  { key: 'persoonlijkeVerzorging', labelKey: 'steps.uitgaven.fields.persoonlijkeVerzorging' },
  { key: 'renteAflossingSchuldenAndersDanHypotheek', labelKey: 'steps.uitgaven.fields.renteAflossingSchuldenAndersDanHypotheek' },
  { key: 'bankkosten', labelKey: 'steps.uitgaven.fields.bankkosten' },
  { key: 'debetrente', labelKey: 'steps.uitgaven.fields.debetrente' },
  { key: 'inkomstenbelasting', labelKey: 'steps.uitgaven.fields.inkomstenbelasting' },
  { key: 'motorrijtuigenbelasting', labelKey: 'steps.uitgaven.fields.motorrijtuigenbelasting' },
  { key: 'gemeentelijkeHeffingen', labelKey: 'steps.uitgaven.fields.gemeentelijkeHeffingen' },
  { key: 'waterschapsbelastingen', labelKey: 'steps.uitgaven.fields.waterschapsbelastingen' },
  { key: 'overigeBelastingen', labelKey: 'steps.uitgaven.fields.overigeBelastingen' },
  { key: 'eigenBijdrageWlzZiektekosten', labelKey: 'steps.uitgaven.fields.eigenBijdrageWlzZiektekosten' },
  { key: 'eigenRisicoZvw', labelKey: 'steps.uitgaven.fields.eigenRisicoZvw' },
  { key: 'eigenBijdrageWmoCak', labelKey: 'steps.uitgaven.fields.eigenBijdrageWmoCak' },
  { key: 'kostenAutoOverig', labelKey: 'steps.uitgaven.fields.kostenAutoOverig' },
  { key: 'reiskostenBetrokkene', labelKey: 'steps.uitgaven.fields.reiskostenBetrokkene' },
  { key: 'reiskostenDerden', labelKey: 'steps.uitgaven.fields.reiskostenDerden' },
  { key: 'hobbysContributiesAbonnementen', labelKey: 'steps.uitgaven.fields.hobbysContributiesAbonnementen' },
  { key: 'vakantie', labelKey: 'steps.uitgaven.fields.vakantie' },
  { key: 'boetes', labelKey: 'steps.uitgaven.fields.boetes' },
  { key: 'cadeaus', labelKey: 'steps.uitgaven.fields.cadeaus' },
  { key: 'giftenEnSchenkingen', labelKey: 'steps.uitgaven.fields.giftenEnSchenkingen' },
  { key: 'uitgaveIngevolgeMachtiging', labelKey: 'steps.uitgaven.fields.uitgaveIngevolgeMachtiging' },
  { key: 'beloningCuratorBewindvoerder', labelKey: 'steps.uitgaven.fields.beloningCuratorBewindvoerder' },
  { key: 'beloningMentor', labelKey: 'steps.uitgaven.fields.beloningMentor' },
  { key: 'kinderopvang', labelKey: 'steps.uitgaven.fields.kinderopvang' },
  { key: 'juridischeKosten', labelKey: 'steps.uitgaven.fields.juridischeKosten' },
  { key: 'medischeKostenMedicatie', labelKey: 'steps.uitgaven.fields.medischeKostenMedicatie' },
  { key: 'alimentatieBetaald', labelKey: 'steps.uitgaven.fields.alimentatieBetaald' },
  { key: 'kinderbijslagGestortOpLeefgeldrekening', labelKey: 'steps.uitgaven.fields.kinderbijslagGestortOpLeefgeldrekening' },
  { key: 'boedelafdrachtMsnpWsnp', labelKey: 'steps.uitgaven.fields.boedelafdrachtMsnpWsnp' },
  { key: 'kostenDieren', labelKey: 'steps.uitgaven.fields.kostenDieren' },
  { key: 'ouderbijdrageLbio', labelKey: 'steps.uitgaven.fields.ouderbijdrageLbio' },
  { key: 'overigeUitgaven', labelKey: 'steps.uitgaven.fields.overigeUitgaven' },
];

export function renderUitgavenStap(store: Store<RVData>): HTMLElement {
  const data = store.get();
  const uitgaven = data.uitgaven;
  const onChange = (): void => store.notify();

  const velden = renderCurrencyFieldList(
    'uitgaven',
    VELDEN,
    (key) => uitgaven[key],
    (key, waarde) => {
      uitgaven[key] = waarde;
      onChange();
    },
  );

  const specificatie = renderTextField(
    { id: 'uitgaven-overige-specificatie', labelKey: 'steps.uitgaven.overigeUitgavenSpecificatie' },
    () => uitgaven.overigeUitgavenSpecificatie,
    (waarde) => {
      uitgaven.overigeUitgavenSpecificatie = waarde;
      onChange();
    },
  );

  const gerapporteerdTotaal = renderCurrencyField(
    { id: 'uitgaven-gerapporteerd-totaal', labelKey: 'steps.uitgaven.gerapporteerdTotaal' },
    () => uitgaven.gerapporteerdTotaal,
    (waarde) => {
      uitgaven.gerapporteerdTotaal = waarde;
      onChange();
    },
  );

  return h('section', { class: 'stap', 'data-stap': 'uitgaven' }, [
    h('h2', {}, [t('steps.uitgaven.title')]),
    ...velden,
    specificatie,
    h('hr', {}),
    gerapporteerdTotaal,
  ]);
}
