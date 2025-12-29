import moment from 'moment';
import {Db} from 'mongodb';
import {CollectionNames} from '../../models/common';
import {EditClientRateType} from '../../models/projects';

const DEFAULT_PEPPOL_PIVOT_DATE = '2026-01-01';

export async function isPeppolActive(db: Db): Promise<boolean> {
  const dbConfig = await db.collection(CollectionNames.CONFIG).findOne({key: 'conf'});
  const peppolPivotDate = dbConfig?.peppolPivotDate || DEFAULT_PEPPOL_PIVOT_DATE;
  return moment().isSameOrAfter(peppolPivotDate, 'day');
}


// TODO: Peppol: We need to do this mapping...

/**
 * ISO 3166 country codes used to identify countries
 * This is a requirement for the e-invoice xml based on the peppol protocol
 * see https://docs.peppol.eu/poacc/billing/3.0/codelist/ISO3166/
 */
export const COUNTRY_CODES = [
  {code: 'BE', country: 'België'},
  {code: 'NL', country: 'Nederland'},
  {code: 'FR', country: 'Frankrijk'},
  {code: 'DE', country: 'Duitsland'},
  {code: 'GB', country: 'UK'},
];

/**
 * Endpoint scheme codes are a requirement for the e-invoice xml based on the peppol protocol and
 * represent international commercial entity codes
 * more info on endpoint scheme codes: https://docs.peppol.eu/poacc/billing/3.0/codelist/eas/ */
export const ENDPOINT_SCHEMES = [
  {country: 'BE', schemeID: '9925'},
  {country: 'NL', schemeID: '9944'},
  {country: 'FR', schemeID: '9957'},
  {country: 'DE', schemeID: '9930'},
  {country: 'GB', schemeID: '9932'},
];

/**
 * Unit codes are a requirement for the e-invoice xml based on the peppol protocol
 * more info on unit codes: more info on unit codes: https://docs.peppol.eu/poacc/billing/3.0/codelist/UNECERec20/
 */
type UnitCodes = {
  unit: EditClientRateType;
  code: string;
};

export const UNIT_CODES: UnitCodes[] = [
  {unit: 'daily', code: 'DAY'},
  {unit: 'hourly', code: 'HUR'},
  {unit: 'km', code: 'KMT'},
  {unit: 'items', code: 'NAR'},
  {unit: 'other', code: 'C62'},
];
