import {parseBtw, formatBtw} from '../BtwInput';

// BE0123456789
// NL0001234567

describe('BtWInput', () => {
  it('formats btw', () => {
    const result = formatBtw('BE0123456789');
    expect(result).toBe('BE 0123.456.789');
  });


  it('should add BE if not specified', () => {
    const result = parseBtw('0123456789');
    expect(result).toBe('BE0123456789');
  });

  it('should just return a correct btw', () => {
    const result = parseBtw('BE0123456789');
    expect(result).toBe('BE0123456789');
  });

  it('should replace dots etc', () => {
    const result = parseBtw('BE012.345.67.89');
    expect(result).toBe('BE0123456789');
  });

  it('should add zeroes for exact length', () => {
    const result = parseBtw('BE23456789');
    expect(result).toBe('BE0023456789');
  });

  it('should not add zeroes for non belgian', () => {
    const result = parseBtw('NL23456789');
    expect(result).toBe('NL23456789-2');
  });
});
