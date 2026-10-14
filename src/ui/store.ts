/**
 * Minimale observable store. Bewaart één gedeeld, muteerbaar object; velden schrijven er
 * direct in en roepen `notify()` aan. Er is bewust geen her-render-op-elke-wijziging: alleen
 * afgeleide knooppunten (lopende totalen, taalwissel, stap-navigatie) abonneren zich — zie
 * plan §4, dit voorkomt focusverlies tijdens het typen.
 */
export interface Store<T> {
  get(): T;
  notify(): void;
  subscribe(listener: () => void): () => void;
}

export function createStore<T>(initial: T): Store<T> {
  const state = initial;
  const listeners = new Set<() => void>();

  return {
    get: () => state,
    notify: () => listeners.forEach((listener) => listener()),
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
