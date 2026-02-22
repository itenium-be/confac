import {trans, features} from './trans.nl';

export {features};


export default function Translate(key: string, params?: object): string {
  if (!key) {
    return 'UNDEFINED KEY';
  }

  let str: any;
  if (key.indexOf('.') === -1) {
    str = trans[key];
  } else {
    str = key.split('.').reduce((o, i) => {
      if (!o || !o[i]) {
        console.error(`trans.ts: Could not find '${key}' on`, o);
        return key;
      }
      return o[i];
    }, trans);
  }

  if (str === undefined) {
    return key;
  }

  if (str.indexOf('{}') !== -1) {
    return str.replace('{}', params);
  }
  if (typeof params === 'object') {
    Object.keys(params).forEach(paramKey => {
      str = str.replace(`{${paramKey}}`, params[paramKey]);
    });
  }

  return str;
}
