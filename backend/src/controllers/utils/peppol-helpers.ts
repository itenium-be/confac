import moment from 'moment';
import {Db} from 'mongodb';
import {CollectionNames} from '../../models/common';

const DEFAULT_PEPPOL_PIVOT_DATE = '2026-01-01';

export async function isPeppolActive(db: Db): Promise<boolean> {
  const dbConfig = await db.collection(CollectionNames.CONFIG).findOne({key: 'conf'});
  const peppolPivotDate = dbConfig?.peppolPivotDate || DEFAULT_PEPPOL_PIVOT_DATE;
  return moment().isSameOrAfter(peppolPivotDate, 'day');
}
