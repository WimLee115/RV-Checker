import { describe, expect, it } from 'vitest';
import { createEmptyRVData } from '../../src/core/defaults';
import { runRules } from '../../src/rules/engine';
import { gekoppeldePostenRules } from '../../src/rules/checks/gekoppeldeposten';
import { volledigheidRules } from '../../src/rules/checks/volledigheid';
import { aandachtspuntenRules } from '../../src/rules/checks/aandachtspunten';
import { bijlagenRules } from '../../src/rules/checks/bijlagen';
import { ondertekeningRules } from '../../src/rules/checks/ondertekening';

describe('gekoppelde posten (R8)', () => {
  it('vuurt wanneer een geoormerkte vergoeding is ontvangen maar niet doorbetaald', () => {
    const data = createEmptyRVData();
    data.inkomen.tegemoetkomingReiskosten = 57_146;
    data.uitgaven.reiskostenBetrokkene = null;
    const findings = runRules(data, gekoppeldePostenRules);
    expect(findings).toHaveLength(1);
    expect(findings[0]?.severity).toBe('aandachtspunt');
  });

  it('vuurt niet wanneer de vergoeding wel (deels) is doorbetaald', () => {
    const data = createEmptyRVData();
    data.inkomen.tegemoetkomingReiskosten = 57_146;
    data.uitgaven.reiskostenBetrokkene = 10_000;
    const findings = runRules(data, gekoppeldePostenRules);
    expect(findings.find((f) => f.ruleId.includes('reiskosten'))).toBeUndefined();
  });
});

describe('volledigheid (R5)', () => {
  it('vuurt wanneer schulden=ja maar geen schuldeisers zijn ingevuld', () => {
    const data = createEmptyRVData();
    data.schulden.heeftSchulden = true;
    const findings = runRules(data, volledigheidRules);
    expect(findings.find((f) => f.ruleId === 'schulden-ja-zonder-schuldeisers')).toBeDefined();
  });

  it('vuurt niet wanneer schulden=ja en er schuldeisers zijn ingevuld', () => {
    const data = createEmptyRVData();
    data.schulden.heeftSchulden = true;
    data.schulden.schuldeisers = [{ id: '1', naam: 'Schuldeiser X', bedragBegindatum: 1_000, bedragEinddatum: 500 }];
    const findings = runRules(data, volledigheidRules);
    expect(findings.find((f) => f.ruleId === 'schulden-ja-zonder-schuldeisers')).toBeUndefined();
  });
});

describe('aandachtspunten (R9/R10)', () => {
  it('signaleert expliciete €0,00 kledinggeld, maar niet een leeg (niet-ingevuld) veld', () => {
    const dataExpliciet = createEmptyRVData();
    dataExpliciet.uitgaven.kledingEnSchoenen = 0;
    expect(runRules(dataExpliciet, aandachtspuntenRules).find((f) => f.ruleId.includes('kleding'))).toBeDefined();

    const dataLeeg = createEmptyRVData();
    expect(runRules(dataLeeg, aandachtspuntenRules).find((f) => f.ruleId.includes('kleding'))).toBeUndefined();
  });

  it('signaleert giften boven de drempel als rode-vlag', () => {
    const data = createEmptyRVData();
    data.uitgaven.giftenEnSchenkingen = 60_000;
    const finding = runRules(data, aandachtspuntenRules).find((f) => f.ruleId === 'giften-boven-drempel');
    expect(finding?.severity).toBe('rode-vlag');
  });
});

describe('bijlagen-checklist (R11)', () => {
  it('vuurt pas na een expliciete "nee", niet wanneer nog niet beantwoord', () => {
    const data = createEmptyRVData();
    data.pgb.heeftPgb = true;

    const nogNietBeantwoord = runRules(data, bijlagenRules);
    expect(nogNietBeantwoord.find((f) => f.ruleId === 'bijlage-pgb-beschikking-ontbreekt')).toBeUndefined();

    data.bijlagen.pgbBeschikkingAanwezig = false;
    const expliciteNee = runRules(data, bijlagenRules);
    expect(expliciteNee.find((f) => f.ruleId === 'bijlage-pgb-beschikking-ontbreekt')).toBeDefined();
  });
});

describe('betrokkene-signalen (R7)', () => {
  it('tagt "betrokkene-signaal" findings zodat het rapport ze apart kan uitlichten', () => {
    const data = createEmptyRVData();
    data.meningBetrokkene.eensMetAntwoorden = false;
    const finding = runRules(data, ondertekeningRules).find((f) => f.ruleId === 'betrokkene-niet-eens-met-antwoorden');
    expect(finding?.tags).toContain('betrokkene-signaal');
  });
});
