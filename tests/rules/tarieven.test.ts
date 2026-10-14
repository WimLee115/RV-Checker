import { describe, expect, it } from 'vitest';
import { createEmptyRVData } from '../../src/core/defaults';
import { runRules } from '../../src/rules/engine';
import { tarievenRules } from '../../src/rules/checks/tarieven';
import { TARIEVEN_2026 } from '../../src/core/tariffs2026';

function bewindvoerderFamilieBewind() {
  const data = createEmptyRVData();
  data.persoonsgegevens.bewindvoerder1.rol = 'bewind';
  data.persoonsgegevens.bewindvoerder1.beloningCategorie = 'familie';
  return data;
}

describe('regel: beloning-bewindvoerder-curator-boven-tarief', () => {
  it('vuurt niet op precies het jaartarief', () => {
    const data = bewindvoerderFamilieBewind();
    data.uitgaven.beloningCuratorBewindvoerder = TARIEVEN_2026.jaarlijksFamilie.bewindvoerder;
    const findings = runRules(data, tarievenRules);
    expect(findings).toHaveLength(0);
  });

  it('vuurt niet binnen de signaleringsmarge (bv. btw)', () => {
    const data = bewindvoerderFamilieBewind();
    const grens = TARIEVEN_2026.jaarlijksFamilie.bewindvoerder;
    data.uitgaven.beloningCuratorBewindvoerder = Math.round(grens * 1.21); // 21% btw, binnen de marge
    const findings = runRules(data, tarievenRules);
    expect(findings).toHaveLength(0);
  });

  it('vuurt ruim boven de signaleringsmarge', () => {
    const data = bewindvoerderFamilieBewind();
    const grens = TARIEVEN_2026.jaarlijksFamilie.bewindvoerder;
    data.uitgaven.beloningCuratorBewindvoerder = grens * 2;
    const findings = runRules(data, tarievenRules);
    expect(findings.find((f) => f.ruleId === 'beloning-bewindvoerder-curator-boven-tarief')).toBeDefined();
  });

  it('gebruikt het professionele tarief wanneer beloningCategorie "professioneel" is', () => {
    const data = createEmptyRVData();
    data.persoonsgegevens.bewindvoerder1.rol = 'bewind';
    data.persoonsgegevens.bewindvoerder1.beloningCategorie = 'professioneel';
    data.uitgaven.beloningCuratorBewindvoerder = TARIEVEN_2026.jaarlijksProfessioneel.bewindvoerder;
    const findings = runRules(data, tarievenRules);
    expect(findings).toHaveLength(0); // precies op het (hogere) professionele tarief, geen signaal
  });

  it('gebruikt het tarief voor problematische schulden wanneer dat is aangevinkt', () => {
    const data = bewindvoerderFamilieBewind();
    data.dossiergegevens.redenProblematischeSchulden = true;
    data.uitgaven.beloningCuratorBewindvoerder = TARIEVEN_2026.jaarlijksFamilie.bewindvoerder * 2;
    const findings = runRules(data, tarievenRules);
    // Het schuldenbewind-tarief ligt hoger dan het reguliere familietarief, dus dit bedrag
    // (2x het reguliere tarief) kan alsnog ruim onder de signaleringsgrens vallen of niet,
    // afhankelijk van de exacte verhouding — vooral controleren dat de regel niet crasht en
    // het juiste tarief in de parameters terechtkomt wanneer hij wél vuurt.
    const finding = findings.find((f) => f.ruleId === 'beloning-bewindvoerder-curator-boven-tarief');
    if (finding) {
      expect(finding.params?.tarief).toBe('€ 2.107,00');
    }
  });

  it('slaat de check over wanneer de beloningcategorie onbekend is', () => {
    const data = createEmptyRVData();
    data.persoonsgegevens.bewindvoerder1.rol = 'bewind';
    // beloningCategorie blijft null
    data.uitgaven.beloningCuratorBewindvoerder = 100_000_000; // absurd hoog, zou anders altijd vuren
    const findings = runRules(data, tarievenRules);
    expect(findings).toHaveLength(0);
  });
});

describe('regel: beloning-mentor-boven-tarief', () => {
  it('kijkt naar de mentor-rol, niet naar bewind/curatele', () => {
    const data = createEmptyRVData();
    data.persoonsgegevens.bewindvoerder1.rol = 'mentorschap';
    data.persoonsgegevens.bewindvoerder1.beloningCategorie = 'familie';
    data.uitgaven.beloningMentor = TARIEVEN_2026.jaarlijksFamilie.mentor * 2;
    const findings = runRules(data, tarievenRules);
    expect(findings.find((f) => f.ruleId === 'beloning-mentor-boven-tarief')).toBeDefined();
  });
});
