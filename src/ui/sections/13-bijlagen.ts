import type { Bijlagen, RVData } from '../../core/types';
import { t } from '../../i18n/t';
import { h } from '../dom';
import { renderYesNoField } from '../fields';
import type { Store } from '../store';

const VELDEN: { key: keyof Bijlagen; labelKey: string }[] = [
  { key: 'rekeningafschriftenAanwezig', labelKey: 'steps.bijlagen.rekeningafschriftenAanwezig' },
  { key: 'pgbBeschikkingAanwezig', labelKey: 'steps.bijlagen.pgbBeschikkingAanwezig' },
  { key: 'machtigingenAanwezig', labelKey: 'steps.bijlagen.machtigingenAanwezig' },
  { key: 'wozBeschikkingEnHypotheekoverzichtAanwezig', labelKey: 'steps.bijlagen.wozBeschikkingEnHypotheekoverzichtAanwezig' },
  { key: 'nalatenschapDocumentenAanwezig', labelKey: 'steps.bijlagen.nalatenschapDocumentenAanwezig' },
];

export function renderBijlagenStap(store: Store<RVData>): HTMLElement {
  const data = store.get();
  const bijlagen = data.bijlagen;
  const onChange = (): void => store.notify();

  const velden = VELDEN.map((spec) =>
    renderYesNoField(
      { id: `bijlage-${spec.key}`, labelKey: spec.labelKey },
      () => bijlagen[spec.key],
      (waarde) => {
        bijlagen[spec.key] = waarde;
        onChange();
      },
    ),
  );

  return h('section', { class: 'stap', 'data-stap': 'bijlagen' }, [
    h('h2', {}, [t('steps.bijlagen.title')]),
    h('p', { class: 'stap-toelichting' }, [t('steps.bijlagen.toelichting')]),
    ...velden,
  ]);
}
