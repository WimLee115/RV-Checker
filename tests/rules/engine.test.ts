import { describe, expect, it, vi } from 'vitest';
import { createEmptyRVData } from '../../src/core/defaults';
import { runRules } from '../../src/rules/engine';
import type { Rule } from '../../src/rules/types';

describe('runRules', () => {
  it('geeft geen findings terug wanneer geen enkele regel raakt', () => {
    const rule: Rule = {
      id: 'altijd-schoon',
      severity: 'aandachtspunt',
      section: 'samenvatting',
      i18nBaseKey: 'rules.altijdSchoon',
      check: () => [],
    };
    expect(runRules(createEmptyRVData(), [rule])).toEqual([]);
  });

  it('bouwt titleKey/explanationKey/suggestionKey uit de i18nBaseKey van de regel', () => {
    const rule: Rule = {
      id: 'test-regel',
      severity: 'fout',
      section: 'samenvatting',
      i18nBaseKey: 'rules.testRegel',
      check: () => [{ params: { bedrag: '€ 1,00' } }],
    };
    const findings = runRules(createEmptyRVData(), [rule]);
    expect(findings).toEqual([
      {
        ruleId: 'test-regel',
        section: 'samenvatting',
        severity: 'fout',
        titleKey: 'rules.testRegel.title',
        explanationKey: 'rules.testRegel.explanation',
        suggestionKey: 'rules.testRegel.suggestion',
        params: { bedrag: '€ 1,00' },
        detail: undefined,
        tags: undefined,
      },
    ]);
  });

  it('een falende regel blokkeert de overige regels niet', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const kapotteRegel: Rule = {
      id: 'kapot',
      severity: 'fout',
      section: 'samenvatting',
      i18nBaseKey: 'rules.kapot',
      check: () => {
        throw new Error('opzettelijke testfout');
      },
    };
    const werkendeRegel: Rule = {
      id: 'werkt-wel',
      severity: 'aandachtspunt',
      section: 'samenvatting',
      i18nBaseKey: 'rules.werktWel',
      check: () => [{}],
    };

    const findings = runRules(createEmptyRVData(), [kapotteRegel, werkendeRegel]);

    expect(findings).toHaveLength(1);
    expect(findings[0]?.ruleId).toBe('werkt-wel');
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
    consoleErrorSpy.mockRestore();
  });

  it('severityOverride in een check-resultaat overschrijft de standaard severity van de regel', () => {
    const rule: Rule = {
      id: 'escaleerbaar',
      severity: 'aandachtspunt',
      section: 'samenvatting',
      i18nBaseKey: 'rules.escaleerbaar',
      check: () => [{ severityOverride: 'rode-vlag' }],
    };
    const findings = runRules(createEmptyRVData(), [rule]);
    expect(findings[0]?.severity).toBe('rode-vlag');
  });

  it('tags op het check-resultaat gaan voor tags op de regel zelf', () => {
    const rule: Rule = {
      id: 'met-tags',
      severity: 'aandachtspunt',
      section: 'samenvatting',
      i18nBaseKey: 'rules.metTags',
      tags: ['regel-default'],
      check: () => [{ tags: ['resultaat-specifiek'] }],
    };
    const findings = runRules(createEmptyRVData(), [rule]);
    expect(findings[0]?.tags).toEqual(['resultaat-specifiek']);
  });
});
