import type { Finding, Severity } from '../rules/types';

export type GroupedFindings = Record<Severity, Finding[]>;

export const SEVERITY_ORDER: Severity[] = ['fout', 'rode-vlag', 'aandachtspunt'];

export function groupBySeverity(findings: Finding[]): GroupedFindings {
  const grouped: GroupedFindings = { fout: [], 'rode-vlag': [], aandachtspunt: [] };
  for (const finding of findings) {
    grouped[finding.severity].push(finding);
  }
  return grouped;
}

/** Signalen van betrokkene (niet akkoord, kon niet beoordelen, niet ondertekend, ...) — altijd
 *  prominent tonen, los van severity-volgorde, zie plan §4/§6. */
export function betrokkeneSignalen(findings: Finding[]): Finding[] {
  return findings.filter((finding) => finding.tags?.includes('betrokkene-signaal'));
}
