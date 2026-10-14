type EventHandler = (event: Event) => void;

// Eén indexsignatuur die zowel losse string-attributen als de specifieke event-handler-
// props dekt — nodig omdat TS een intersectie van Record<string,string> met specifieke
// functie-properties afwijst (de functie-waarde past dan niet bij de stringindex).
type Attrs = {
  onInput?: EventHandler;
  onChange?: EventHandler;
  onClick?: EventHandler;
  onBlur?: EventHandler;
  [attribuut: string]: string | undefined | EventHandler;
};

const EVENT_HANDLER_KEYS = ['onInput', 'onChange', 'onClick', 'onBlur'] as const;

/** Kleine, afhankelijkheidsvrije element-bouwer — bespaart handmatig createElement/setAttribute-werk. */
export function h(tag: string, attrs: Attrs = {}, children: (Node | string)[] = []): HTMLElement {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined) continue;
    if ((EVENT_HANDLER_KEYS as readonly string[]).includes(key)) {
      const domEvent = key.slice(2).toLowerCase();
      el.addEventListener(domEvent, value as EventListener);
    } else if (key === 'class') {
      el.className = value as string;
    } else {
      el.setAttribute(key, value as string);
    }
  }

  for (const child of children) {
    el.append(child instanceof Node ? child : document.createTextNode(child));
  }

  return el;
}

export function clear(el: HTMLElement): void {
  el.replaceChildren();
}
