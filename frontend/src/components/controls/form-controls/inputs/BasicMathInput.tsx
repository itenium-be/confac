import React from 'react';
import {BaseInput, BaseInputProps} from './BaseInput';
import {parseIntOrFloat} from './input-util';


type BasicMathInputProps = BaseInputProps<number | undefined> & {
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
 * ATTN: onChange returns a string (whatever the user has put in)
 * ATTN: onBlur it will call onChange with a resolved number
 */
export const BasicMathInput = ({value, onChange, float = false, allowHours = false, ...props}: BasicMathInputProps) => {
  return (
    <BaseInput
      type="text"
      value={(value === 0 || value) ? value : ''}
      onChange={e => onChange(e.target.value)}
      onBlur={e => {
        if (!e.target.value) {
          onChange(undefined);
        } else {
          onChange(basicMath(e.target.value, float, allowHours));
        }
      }}
      {...props}
    />
  );
};

/**
 * Converts a currency string into a number
 */
export function getMoney(str: string): number | null {
  const result = sanitize(str);
  return convertToNumber(result, true) || null;
}

/**
 * Convert a string to a number
 */
function convertToNumber(input: string | number, asFloat: boolean): number {
  if (typeof input === 'number') {
    return input;
  }

  let str = input;
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
    result = `${parts[0]}.${(parts[1] / 60) * 100}`;
  }
  return convertToNumber(result, asFloat);
}


/**
 * Turn a string into number and evaluate simple math
 */
export function basicMath(input: string, asFloat: boolean = false, allowHours: boolean = false): number {
  const str = sanitize(input);
  return mathEval(str, asFloat, allowHours);
}

/**
 * Remove € and spaces
 */
function sanitize(input: string): string {
  let str = input.replace(/€/g, '');
  str = str.replace(/ /g, '');
  return str;
}
