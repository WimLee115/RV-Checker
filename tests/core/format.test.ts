import { describe, expect, it } from 'vitest';
import { formatEuro, parseEuroInput, sumCents } from '../../src/core/format';

describe('parseEuroInput', () => {
  it('behandelt lege invoer als "niet ingevuld" (null), geen fout', () => {
    expect(parseEuroInput('')).toBe(null);
    expect(parseEuroInput('   ')).toBe(null);
  });

  it('parseert NL-notatie met duizendtal-punt en komma-decimaal', () => {
    expect(parseEuroInput('1.234,56')).toBe(123456);
    expect(parseEuroInput('1.234.567,89')).toBe(123456789);
  });

  it('parseert bedragen zonder duizendtal-scheiding', () => {
    expect(parseEuroInput('1234,56')).toBe(123456);
    expect(parseEuroInput('100')).toBe(10000);
    expect(parseEuroInput('0')).toBe(0);
  });

  it('vult één decimaal cijfer aan tot centen', () => {
    expect(parseEuroInput('1,5')).toBe(150);
  });

  it('ondersteunt negatieve bedragen', () => {
    expect(parseEuroInput('-50,00')).toBe(-5000);
  });

  it('trimt omringende spaties', () => {
    expect(parseEuroInput('  1.234,56  ')).toBe(123456);
  });

  it('geeft undefined terug bij een punt als decimaalteken (geen NL-notatie)', () => {
    expect(parseEuroInput('12.34')).toBeUndefined();
  });

  it('geeft undefined terug bij een onjuiste duizendtal-groepering', () => {
    expect(parseEuroInput('1.23')).toBeUndefined();
  });

  it('geeft undefined terug bij niet-numerieke invoer', () => {
    expect(parseEuroInput('abc')).toBeUndefined();
  });
});

describe('formatEuro', () => {
  it('formatteert null als lege string', () => {
    expect(formatEuro(null)).toBe('');
  });

  it('formatteert hele euro-bedragen met duizendtal-punt', () => {
    expect(formatEuro(123456)).toBe('€ 1.234,56');
  });

  it('formatteert nul', () => {
    expect(formatEuro(0)).toBe('€ 0,00');
  });

  it('formatteert bedragen onder één euro met voorloopnul', () => {
    expect(formatEuro(5)).toBe('€ 0,05');
  });

  it('formatteert negatieve bedragen met een minteken vóór het euroteken', () => {
    expect(formatEuro(-5000)).toBe('-€ 50,00');
  });
});

describe('sumCents', () => {
  it('behandelt null als 0', () => {
    expect(sumCents(null, null)).toBe(0);
  });

  it('telt gevulde en lege waarden correct op', () => {
    expect(sumCents(100, null, 200)).toBe(300);
  });

  it('geeft 0 terug zonder argumenten', () => {
    expect(sumCents()).toBe(0);
  });
});
