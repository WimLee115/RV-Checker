import type { RVData, RVSectionId } from '../core/types';

/** Interne ernst-niveaus — nooit direct getoond; de UI vertaalt via `t('severity.' + severity)`. */
export type Severity = 'fout' | 'rode-vlag' | 'aandachtspunt';

export type FindingDetail =
  | { kind: 'amount'; labelKey: string; amountCents: number }
  | { kind: 'amount-pair'; labelKey: string; expectedCents: number; actualCents: number; differenceCents: number }
  | { kind: 'list'; labelKey: string; items: string[] };

/**
 * Het resultaat van de regels-engine. Bevat uitsluitend vertaalsleutels + parameters, nooit
 * kant-en-klare tekst in een taal — zie plan §3/§5. De UI/rapport-laag roept hier `t()` op aan.
 */
export interface Finding {
  ruleId: string;
  severity: Severity;
  section: RVSectionId;
  titleKey: string;
  explanationKey: string;
  suggestionKey: string;
  params?: Record<string, string | number>;
  detail?: FindingDetail;
  tags?: string[];
}

export interface RuleContext {
  data: RVData;
}

export interface RuleCheckResult {
  params?: Record<string, string | number>;
  detail?: FindingDetail;
  /** Overschrijft de standaard severity van de regel voor dit ene resultaat (bv. context-afhankelijke escalatie). */
  severityOverride?: Severity;
  tags?: string[];
}

export interface Rule {
  id: string;
  severity: Severity;
  section: RVSectionId;
  /** Vertaalsleutel-prefix; de engine leidt hieruit `${i18nBaseKey}.title/.explanation/.suggestion` af. */
  i18nBaseKey: string;
  tags?: string[];
  check: (ctx: RuleContext) => RuleCheckResult[];
}
