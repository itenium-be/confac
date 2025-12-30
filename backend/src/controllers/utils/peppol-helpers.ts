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

type UnitCodes = {
  unit: EditClientRateType;
  code: string;
};

export const PeppolUnitLineCodes: UnitCodes[] = [
  {unit: 'daily', code: 'DAY'},
  {unit: 'hourly', code: 'HUR'},
  {unit: 'km', code: 'KMT'},
  {unit: 'items', code: 'NAR'},
  {unit: 'other', code: 'C62'},
];
