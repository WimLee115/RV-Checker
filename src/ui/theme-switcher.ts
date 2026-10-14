import { t } from '../i18n/t';
import { h } from './dom';
import { getEffectiefThema, wisselThema } from './theme';

/** Toont de actie die een klik uitvoert (dus "Donkere modus" terwijl licht actief is, en
 *  omgekeerd) — consistent met hoe de taalknoppen werken, maar hier als enkele schakelaar. */
export function renderThemaSchakelaar(): HTMLElement {
  const volgendeThema = getEffectiefThema() === 'donker' ? 'licht' : 'donker';
  const labelKey = volgendeThema === 'donker' ? 'thema.naarDonker' : 'thema.naarLicht';

  return h(
    'button',
    { type: 'button', class: 'thema-knop', onClick: () => wisselThema() },
    [t(labelKey)],
  );
}
