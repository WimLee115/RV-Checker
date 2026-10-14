// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { createEmptyRVData } from '../../src/core/defaults';
import { clearDraft, hasDraft, loadDraft, saveDraft } from '../../src/core/persistence';

describe('draft-opslag', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('geeft null terug wanneer er nog geen concept is opgeslagen', () => {
    expect(loadDraft()).toBeNull();
    expect(hasDraft()).toBe(false);
  });

  it('bewaart en herstelt een concept ongewijzigd', () => {
    const data = createEmptyRVData();
    data.dossiergegevens.dossiernummer = 'BM12345';
    data.inkomen.salaris = 123_456;

    saveDraft(data);

    expect(hasDraft()).toBe(true);
    expect(loadDraft()).toEqual(data);
  });

  it('wist een opgeslagen concept', () => {
    saveDraft(createEmptyRVData());
    clearDraft();
    expect(loadDraft()).toBeNull();
  });

  it('degradeert naar "geen concept" bij corrupte JSON, zonder te crashen', () => {
    localStorage.setItem('rv-checker:draft:v1', '{ dit is geen geldige JSON');
    expect(loadDraft()).toBeNull();
  });

  it('degradeert naar "geen concept" bij een object dat niet op RVData lijkt', () => {
    localStorage.setItem('rv-checker:draft:v1', JSON.stringify({ iets: 'anders' }));
    expect(loadDraft()).toBeNull();
  });

  it('degradeert naar "geen concept" bij een ouder/onbekend schemaVersion', () => {
    const data = { ...createEmptyRVData(), schemaVersion: 2 };
    localStorage.setItem('rv-checker:draft:v1', JSON.stringify(data));
    expect(loadDraft()).toBeNull();
  });
});
