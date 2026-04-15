import locals from '../pug-helpers';

describe('pug-helpers :: numberFormat', () => {
  it.each([
    [1234.5, '1.234,50'],
    [-1234.5, '-1.234,50'],
    [0, '0,00'],
    [100.555, '100,56'],
    [1234567.89, '1.234.567,89'],
    [0.1, '0,10'],
  ])('formats %s as "%s" (nl-BE)', (input, expected) => {
    expect(locals.numberFormat(input)).toBe(expected);
  });
});
