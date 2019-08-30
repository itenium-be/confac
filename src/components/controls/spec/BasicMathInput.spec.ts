import { basicMath } from "../form-controls/inputs/BasicMathInput";

describe('BasicMathInput', () => {
  it('Replaces comma to dot', () => {
    const result = basicMath('100,50', true);
    expect(result).toBe(100.50);
  });

  it('Removes € sign', () => {
    const result = basicMath('€100');
    expect(result).toBe(100);
  });

  it('Ignores spaces', () => {
    const result = basicMath('  100.2 ', true);
    expect(result).toBe(100.2);
  });

  it('Parses full currency display', () => {
    let result = basicMath('  € 1,000.2 ', true);
    expect(result).toBe(1000.2);

    result = basicMath('€1 000.2', true);
    expect(result).toBe(1000.2);
  });

  it('Parses full currency display with , thousands and . decimal separators', () => {
    const result = basicMath('€1,000.2', true);
    expect(result).toBe(1000.2);
  });

  it('Parses full currency display with , decimal and . thousands separators', () => {
    const result = basicMath('€1.000,2', true);
    expect(result).toBe(1000.2);
  });

  it('It evaluates *', () => {
    const result = basicMath('100*2');
    expect(result).toBe(200);
  });

  it('It evaluates +', () => {
    const result = basicMath('100 + 2');
    expect(result).toBe(102);
  });

  it('It evaluates /', () => {
    const result = basicMath('100 / 2');
    expect(result).toBe(50);
  });

  it('It understands - as sign not subtraction', () => {
    const result = basicMath('-2');
    expect(result).toBe(-2);
  });

  it('It evaluates -', () => {
    const result = basicMath('100 - 2');
    expect(result).toBe(98);
  });

  it('It does not evaluate hh:mm unless allowHours=true', () => {
    const result = basicMath('5:30', true, false);
    expect(result).toBe(5);
  });

  it('It evaluates hh:mm when allowHours=true', () => {
    const result = basicMath('5:30', true, true);
    expect(result).toBe(5.5);
  });

  it('works for a real world number (be locale)', () => {
    const result = basicMath('€ 1.000.000,20', true);
    expect(result).toBe(1000000.2);
  });

  it('works for a real world number (en locale)', () => {
    const result = basicMath('€ 1,000,000.20', true);
    expect(result).toBe(1000000.2);
  });

  it('works for a real world addition scenario', () => {
    const result = basicMath('€1,000,000.30 + € 1.000.000,20', true);
    expect(result).toBe(2000000.5);
  });
});
