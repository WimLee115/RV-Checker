import type { RVData } from '../core/types';
import type { Finding, Rule } from './types';

/**
 * Draait alle regels tegen de ingevulde R&V-data. Eén falende regel mag nooit het hele
 * rapport blokkeren — hij wordt overgeslagen en gelogd, de overige regels draaien door.
 */
export function runRules(data: RVData, rules: Rule[]): Finding[] {
  const findings: Finding[] = [];

  for (const rule of rules) {
    let results;
    try {
      results = rule.check({ data });
    } catch (error) {
      console.error(`Regel "${rule.id}" is mislukt en wordt overgeslagen:`, error);
      continue;
    }

    for (const result of results) {
      findings.push({
        ruleId: rule.id,
        section: rule.section,
        severity: result.severityOverride ?? rule.severity,
        titleKey: `${rule.i18nBaseKey}.title`,
        explanationKey: `${rule.i18nBaseKey}.explanation`,
        suggestionKey: `${rule.i18nBaseKey}.suggestion`,
        params: result.params,
        detail: result.detail,
        tags: result.tags ?? rule.tags,
      });
    }
  }

  return findings;
}
