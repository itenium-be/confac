import { BaseInput, BaseInputProps } from "./BaseInput";
import React from "react";
import { parseIntOrFloat } from "./input-util";


type BasicMathInputProps = BaseInputProps<number> & {
  /**
   * True: allow decimals
   */
  float?: boolean,
  /**
   * Allow parsing 10:50 as time
   */
  allowHours?: boolean,
}


/**
 * Component that parses simple math onBlur
 */
export const BasicMathInput = ({ value, onChange, float = false, allowHours = false, ...props }: BasicMathInputProps) => {
  return (
    <BaseInput
      type="text"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      onBlur={e => onChange(basicMath(e.target.value, float, allowHours))}
      {...props}
    />
  );
};

/**
 * Converts a currency string into a number
 */
export function getMoney(str: string): number | null {
  let result = sanitize(str);
  return convertToNumber(result, true) || null;
}

/**
 * Convert a string to a number
 */
function convertToNumber(str: string | number, asFloat: boolean): number {
  if (typeof str === 'number') {
    return str;
  }

  if (str.includes(',') && str.includes('.')) {
    if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
      str = str.replace(/\./g, '');
    } else {
      str = str.replace(/,/g, '');
    }
  }
  str = str.replace(',', '.');
  return parseIntOrFloat(str, asFloat);
}


/**
 * Evaluate simple math
 * ATTN: This is pretty basic!!
 *       !!! 5+5*2 === 10*2 !!!
 */
function mathEval(str: string, asFloat: boolean, allowHours?: boolean): number {
  let result: number | string = str;
  if (str.includes('*')) {
    const parts = str.split('*');
    result = parts.reduce((acc, cur) => acc * mathEval(cur, asFloat), 1);

  } else if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length !== 2) {
      throw Error('Multiple "/" Not implemented');
    }
    result = mathEval(parts[0], asFloat) / mathEval(parts[1], asFloat);

  } else if (str.includes('+')) {
    const parts = str.split('+');
    result = parts.reduce((acc, cur) => acc + mathEval(cur, asFloat), 0);

  } else if (str.includes('-')) {
    const parts = str.split('-');
    if (parts.length > 2) {
      throw Error('Multiple "-" Not implemented');
    }
    if (parts.length === 2) {
      result = mathEval(parts[0], asFloat) - mathEval(parts[1], asFloat);
    }
  } else if (allowHours && str.includes(':')) {
    const parts = str.split(':').map(s => parseInt(s, 10));
    result = parts[0] + '.' + (parts[1] / 60 * 100);
  }
  return convertToNumber(result, asFloat);
}


/**
 * Turn a string into number and evaluate simple math
 */
export function basicMath(str: string, asFloat: boolean = false, allowHours: boolean = false): number {
  str = sanitize(str);
  return mathEval(str, asFloat, allowHours);
}

/**
 * Remove € and spaces
 */
function sanitize(str: string): string {
  str = str.replace(/€/g, '');
  str = str.replace(/ /g, '');
  return str;
}
