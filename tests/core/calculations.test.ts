import { describe, expect, it } from 'vitest';
import { createEmptyRVData } from '../../src/core/defaults';
import {
  afwijkingGerapporteerdTotaalInkomen,
  afwijkingGerapporteerdTotaalUitgaven,
  afwijkingTotalen,
  controleVermogensopstelling,
  totaalInkomen,
  totaalSaldoBegindatum,
  totaalSaldoEinddatum,
  totaalUitgaven,
  totaalVermogenBerekend,
} from '../../src/core/calculations';

describe('afwijkingTotalen (Check 1)', () => {
  it('is 0 op een volledig lege staat', () => {
    expect(afwijkingTotalen(createEmptyRVData())).toBe(0);
  });

  it('is 0 wanneer de rekeningmutatie exact overeenkomt met inkomen min uitgaven', () => {
    const data = createEmptyRVData();
    data.inkomen.salaris = 200_000; // €2.000,00
    data.uitgaven.huurKostgeld = 80_000; // €800,00 -> verschil A-B = 120.000
    data.bezittingen.bankSpaarrekeningen = [
      {
        id: '1',
        omschrijving: 'Betaalrekening',
        iban: 'NL00BANK0000000001',
        saldoBegindatum: 100_000,
        saldoEinddatum: 220_000, // delta = 120.000, exact gelijk aan A-B
      },
    ];
    expect(afwijkingTotalen(data)).toBe(0);
  });

  it('detecteert een afwijking van €150,00 wanneer de rekeningmutatie niet klopt', () => {
    const data = createEmptyRVData();
    data.inkomen.salaris = 200_000;
    data.uitgaven.huurKostgeld = 80_000; // verschil A-B = 120.000
    data.bezittingen.bankSpaarrekeningen = [
      {
        id: '1',
        omschrijving: 'Betaalrekening',
        iban: 'NL00BANK0000000001',
        saldoBegindatum: 100_000,
        saldoEinddatum: 235_000, // delta = 135.000, verwacht 120.000 -> afwijking 15.000 cent
      },
    ];
    expect(afwijkingTotalen(data)).toBe(15_000);
  });

  it('telt leefgeldrekeningen mee naast bank- en spaarrekeningen', () => {
    const data = createEmptyRVData();
    data.bezittingen.bankSpaarrekeningen = [
      { id: '1', omschrijving: 'Betaalrekening', iban: 'NL00BANK0000000001', saldoBegindatum: 1_000, saldoEinddatum: 1_000 },
    ];
    data.bezittingen.leefgeldrekeningen = [
      { id: '2', omschrijving: 'Leefgeldrekening', iban: 'NL00BANK0000000002', saldoBegindatum: 500, saldoEinddatum: 600 },
    ];
    expect(totaalSaldoBegindatum(data)).toBe(1_500);
    expect(totaalSaldoEinddatum(data)).toBe(1_600);
  });

  it('behandelt niet-ingevulde bedragen (null) als 0 in de totalen', () => {
    const data = createEmptyRVData();
    data.inkomen.salaris = 50_000;
    // alle andere inkomens- en uitgavenvelden blijven null
    expect(totaalInkomen(data)).toBe(50_000);
    expect(totaalUitgaven(data)).toBe(0);
  });
});

describe('controleVermogensopstelling (Check 2)', () => {
  it('geeft null terug wanneer de gerapporteerde vermogenstotalen niet zijn ingevuld', () => {
    expect(controleVermogensopstelling(createEmptyRVData())).toBeNull();
  });

  it('is 0 wanneer de gerapporteerde totalen overeenkomen met de berekende detailtabellen', () => {
    const data = createEmptyRVData();
    data.bezittingen.bankSpaarrekeningen = [
      { id: '1', omschrijving: 'Betaalrekening', iban: 'NL00BANK0000000001', saldoBegindatum: 100_000, saldoEinddatum: 150_000 },
    ];
    data.bezittingen.aandelenObligaties = [
      { id: 'a1', omschrijving: 'Beleggingsfonds', waardeBegindatum: 50_000, waardeEinddatum: 70_000 },
    ];
    data.schulden.schuldeisers = [
      { id: 's1', naam: 'Schuldeiser X', bedragBegindatum: 20_000, bedragEinddatum: 10_000 },
    ];
    const begin = totaalVermogenBerekend(data, 'begin');
    const eind = totaalVermogenBerekend(data, 'eind');
    data.gerapporteerdeVermogenstotalen = {
      totaalVermogenBegindatum: begin,
      totaalVermogenEinddatum: eind,
    };
    expect(controleVermogensopstelling(data)).toBe(0);
  });

  it('signaleert een afwijking wanneer het document een ander totaal vermogen vermeldt dan de detailtabellen optellen', () => {
    const data = createEmptyRVData();
    data.bezittingen.bankSpaarrekeningen = [
      { id: '1', omschrijving: 'Betaalrekening', iban: 'NL00BANK0000000001', saldoBegindatum: 100_000, saldoEinddatum: 150_000 },
    ];
    data.gerapporteerdeVermogenstotalen = {
      totaalVermogenBegindatum: 100_000,
      totaalVermogenEinddatum: 200_000, // document claimt 200.000, detailtabellen tellen op tot 150.000
    };
    expect(controleVermogensopstelling(data)).toBe(50_000);
  });
});

describe('cross-check tegen door het document zelf gerapporteerde Totaal (A)/(B)', () => {
  it('geeft null terug wanneer het gerapporteerde totaal niet is overgenomen', () => {
    const data = createEmptyRVData();
    expect(afwijkingGerapporteerdTotaalInkomen(data)).toBeNull();
    expect(afwijkingGerapporteerdTotaalUitgaven(data)).toBeNull();
  });

  it('is 0 wanneer het gerapporteerde totaal overeenkomt met de som van de regels', () => {
    const data = createEmptyRVData();
    data.inkomen.salaris = 100_000;
    data.inkomen.pensioen = 50_000;
    data.inkomen.gerapporteerdTotaal = 150_000;
    expect(afwijkingGerapporteerdTotaalInkomen(data)).toBe(0);
  });

  it('detecteert een optelfout van de bewindvoerder in het eigen gerapporteerde totaal', () => {
    const data = createEmptyRVData();
    data.uitgaven.huurKostgeld = 80_000;
    data.uitgaven.energie = 20_000;
    data.uitgaven.gerapporteerdTotaal = 90_000; // document zegt 900,00; regels tellen op tot 1.000,00
    expect(afwijkingGerapporteerdTotaalUitgaven(data)).toBe(10_000);
  });
});
