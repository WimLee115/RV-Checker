import { describe, expect, it } from 'vitest';
import { betrokkeneSignalen, groupBySeverity } from '../../src/report/group-by-severity';
import type { Finding } from '../../src/rules/types';

function maakFinding(overrides: Partial<Finding>): Finding {
  return {
    ruleId: 'test',
    severity: 'aandachtspunt',
    section: 'samenvatting',
    titleKey: 'x.title',
    explanationKey: 'x.explanation',
    suggestionKey: 'x.suggestion',
    ...overrides,
  };
}

describe('groupBySeverity', () => {
  it('groepeert findings per severity, met lege arrays voor afwezige severities', () => {
    const findings = [maakFinding({ severity: 'fout' }), maakFinding({ severity: 'rode-vlag' })];
    const gegroepeerd = groupBySeverity(findings);
    expect(gegroepeerd.fout).toHaveLength(1);
    expect(gegroepeerd['rode-vlag']).toHaveLength(1);
    expect(gegroepeerd.aandachtspunt).toHaveLength(0);
  });

  it('geeft lege groepen terug bij een lege findings-lijst', () => {
    const gegroepeerd = groupBySeverity([]);
    expect(gegroepeerd).toEqual({ fout: [], 'rode-vlag': [], aandachtspunt: [] });
  });
});

describe('betrokkeneSignalen', () => {
  it('filtert alleen findings met de betrokkene-signaal-tag', () => {
    const findings = [
      maakFinding({ ruleId: 'a', tags: ['betrokkene-signaal'] }),
      maakFinding({ ruleId: 'b', tags: ['iets-anders'] }),
      maakFinding({ ruleId: 'c' }),
    ];
    const signalen = betrokkeneSignalen(findings);
    expect(signalen.map((f) => f.ruleId)).toEqual(['a']);
  });
});
