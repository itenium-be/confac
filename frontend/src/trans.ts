import {trans, features} from './trans.nl';

export {features};


export default function Translate(key: string, params?: Record<string, string | number | null | undefined>): string {
  if (!key) {
    return 'UNDEFINED KEY';
  }

  let str: string;
  if (key.indexOf('.') === -1) {
    str = (trans as Record<string, unknown>)[key] as string;
  } else {
    str = key.split('.').reduce((o: Record<string, unknown>, i: string) => {
      if (!o || !o[i]) {
        console.error(`trans.ts: Could not find '${key}' on`, o);
        return key as unknown as Record<string, unknown>;
      }
      return o[i] as Record<string, unknown>;
    }, trans as Record<string, unknown>) as unknown as string;
  }

  if (str === undefined) {
    return key;
  }

  if (str.indexOf('{}') !== -1) {
    return str.replace('{}', String(params));
  }
  if (typeof params === 'object' && params !== null) {
    Object.keys(params).forEach(paramKey => {
      str = str.replace(`{${paramKey}}`, String(params[paramKey]));
    });
  }

  return str;
}
