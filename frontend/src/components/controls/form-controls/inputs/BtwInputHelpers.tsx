import {t} from '../../../utils';

/** Default to this country code if none provided */
const DefaultBtwCountry = 'BE';

export const BtwInRequest = t('taxRequest');

/**
 * Convert input to an unformatted Btw number
 */
export function parseBtw(str: string): string {
  if (!str) {
    return '';
  }

  if (str === BtwInRequest) {
    return str;
  }

  let btw = str.toUpperCase().replace(/[^0-9A-Z]/g, '');
  if (!/^[A-Z]{2}/.test(btw)) {
    btw = DefaultBtwCountry + btw;
  }
  if (!/^[A-Z]{2}[A-Z0-9]{8,12}$/.test(btw)) {
    return btw;
  }

  if (btw.startsWith('BE') && btw.length < 12) {
    btw = btw.slice(0, 2) + btw.slice(2).padStart(10, '0');
  }

  return btw;
}

/**
 * Formats to "BE 0123.456.789"
 * Expects input to be in "BE0123456789"
 */
export const formatBtw = (str: string): string => str.replace(/(\w{2})(\d{4})(\d{3})(\d{3})/, '$1 $2.$3.$4');
