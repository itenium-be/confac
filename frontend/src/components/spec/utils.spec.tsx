import { moneyFormat } from "../utils";


describe('moneyFormat', () => {
  it('should format positive numbers correctly', () => {
    expect(moneyFormat(1000)).toBe('€ 1.000,00');
    expect(moneyFormat(0)).toBe('€ 0,00');
    expect(moneyFormat(153.065)).toBe('€ 153,07');
  });

  it('should format negative numbers correctly', () => {
    expect(moneyFormat(-1000)).toBe('€ -1.000,00');
    expect(moneyFormat(-0)).toBe('€ 0,00');
    expect(moneyFormat(-153.065)).toBe('€ -153,07');
  });

  it('should handle string inputs correctly', () => {
    expect(moneyFormat('1000')).toBe('€ 1.000,00');
    expect(moneyFormat('0')).toBe('€ 0,00');
    expect(moneyFormat('153,065')).toBe('€ 153,07');
    expect(moneyFormat('-1000')).toBe('€ -1.000,00');
    expect(moneyFormat('-0')).toBe('€ 0,00');
    expect(moneyFormat('-153,065')).toBe('€ -153,07');
  });

  it('should handle invalid string inputs as 0,00', () => {
    expect(moneyFormat('abc')).toBe('€ 0,00');
    expect(moneyFormat('')).toBe('€ 0,00');
  });

});
