import { describe, expect, it } from 'vitest';
import { createEmptyRVData } from '../../src/core/defaults';
import { runRules } from '../../src/rules/engine';
import { reconciliationRules } from '../../src/rules/checks/reconciliation';

describe('regel: afwijking-totalen', () => {
  it('geeft geen finding wanneer alles klopt', () => {
    const data = createEmptyRVData();
    data.inkomen.salaris = 200_000;
    data.uitgaven.huurKostgeld = 80_000;
    data.bezittingen.bankSpaarrekeningen = [
      { id: '1', omschrijving: 'Betaalrekening', iban: 'NL00BANK0000000001', saldoBegindatum: 100_000, saldoEinddatum: 220_000 },
    ];
    const findings = runRules(data, reconciliationRules);
    expect(findings.find((f) => f.ruleId === 'afwijking-totalen')).toBeUndefined();
  });

  it('geeft een "fout"-finding met het juiste bedrag bij een afwijking', () => {
    const data = createEmptyRVData();
    data.inkomen.salaris = 200_000;
    data.uitgaven.huurKostgeld = 80_000;
    data.bezittingen.bankSpaarrekeningen = [
      { id: '1', omschrijving: 'Betaalrekening', iban: 'NL00BANK0000000001', saldoBegindatum: 100_000, saldoEinddatum: 235_000 },
    ];
    const findings = runRules(data, reconciliationRules);
    const finding = findings.find((f) => f.ruleId === 'afwijking-totalen');
    expect(finding?.severity).toBe('fout');
    expect(finding?.params?.bedrag).toBe('€ 150,00');
    expect(finding?.detail).toEqual({ kind: 'amount', labelKey: 'rules.afwijkingTotalen.detailLabel', amountCents: 15_000 });
  });
});

describe('regel: controle-vermogensopstelling', () => {
  it('geeft geen finding wanneer de gerapporteerde totalen niet zijn ingevuld', () => {
    const findings = runRules(createEmptyRVData(), reconciliationRules);
    expect(findings.find((f) => f.ruleId === 'controle-vermogensopstelling')).toBeUndefined();
  });

  it('geeft een "fout"-finding wanneer het document een ander vermogenstotaal claimt dan de detailtabellen optellen', () => {
    const data = createEmptyRVData();
    data.bezittingen.bankSpaarrekeningen = [
      { id: '1', omschrijving: 'Betaalrekening', iban: 'NL00BANK0000000001', saldoBegindatum: 100_000, saldoEinddatum: 150_000 },
    ];
    data.gerapporteerdeVermogenstotalen = { totaalVermogenBegindatum: 100_000, totaalVermogenEinddatum: 200_000 };
    const findings = runRules(data, reconciliationRules);
    const finding = findings.find((f) => f.ruleId === 'controle-vermogensopstelling');
    expect(finding?.severity).toBe('fout');
    expect(finding?.params?.bedrag).toBe('€ 500,00');
  });
});

describe('regels: afwijking tussen berekend en gerapporteerd Totaal (A)/(B)', () => {
  it('vuurt wanneer het document zelf een ander Totaal (A) claimt dan de opgetelde regels', () => {
    const data = createEmptyRVData();
    data.inkomen.salaris = 100_000;
    data.inkomen.pensioen = 50_000;
    data.inkomen.gerapporteerdTotaal = 140_000; // document zegt 1.400,00; regels tellen op tot 1.500,00
    const findings = runRules(data, reconciliationRules);
    const finding = findings.find((f) => f.ruleId === 'afwijking-gerapporteerd-totaal-inkomen');
    expect(finding?.severity).toBe('fout');
    expect(finding?.params?.bedrag).toBe('€ 100,00');
  });

  it('vuurt niet wanneer het gerapporteerde Totaal (B) overeenkomt', () => {
    const data = createEmptyRVData();
    data.uitgaven.huurKostgeld = 80_000;
    data.uitgaven.gerapporteerdTotaal = 80_000;
    const findings = runRules(data, reconciliationRules);
    expect(findings.find((f) => f.ruleId === 'afwijking-gerapporteerd-totaal-uitgaven')).toBeUndefined();
  });
});
