import { getLocale, setLocale } from '../i18n/t';
import { LOCALE_NAMES, SUPPORTED_LOCALES } from '../i18n/types';
import { h } from './dom';

/**
 * Toont elke taal in haar eigen naam (geen vlaggen — een taal is geen land), markeert de
 * actieve. Bouwt zichzelf één keer op basis van de huidige taal; een taalwissel laat de
 * aanroeper (main.ts) dit element volledig opnieuw opbouwen, samen met de rest van de
 * vertaalde inhoud — zie de toelichting bij `render()` in main.ts. Geen eigen
 * onLocaleChange-abonnement hier, dat zou dubbelop zijn en bij elke wissel een niet
 * opgeruimd abonnement achterlaten.
 */
export function renderLanguageSwitcher(): HTMLElement {
  const container = h('div', { class: 'taalkeuze', role: 'group', 'aria-label': 'Taal / Language / لغة / Język' });

  container.replaceChildren(
    ...SUPPORTED_LOCALES.map((locale) => {
      const actief = locale === getLocale();
      return h(
        'button',
        {
          type: 'button',
          class: actief ? 'taalkeuze-knop taalkeuze-knop-actief' : 'taalkeuze-knop',
          'aria-pressed': String(actief),
          onClick: () => setLocale(locale),
        },
        [LOCALE_NAMES[locale]],
      );
    }),
  );

  return container;
}
