import moment from 'moment';
import {Db, ObjectID} from 'mongodb';
import {CollectionNames, SocketEventTypes, updateAudit} from '../../models/common';
import {EditClientRateType} from '../../models/projects';
import {IClient} from '../../models/clients';
import {ConfacRequest} from '../../models/technical';
import {ApiClient} from '../../services/billit';
import {ApiClientFactory, VatNumberFactory} from './billit';
import {emitEntityEvent} from './entity-events';
import {saveAudit} from './audit-logs';
import config from '../../config';

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


/** Check and sync the peppolEnabled status for a client. */
export async function syncClientPeppolStatus(req: ConfacRequest, client: IClient): Promise<IClient> {
  if (client.peppolEnabled === true) {
    return client;
  }

  const apiClient: ApiClient = ApiClientFactory.fromConfig(config);
  const vatNumber = VatNumberFactory.fromClient(client);
  const peppolResponse = await apiClient.getParticipantInformation(vatNumber);
  const peppolEnabled = peppolResponse.Registered;

  if (client.peppolEnabled !== peppolEnabled) {
    const updatedAudit = updateAudit(client.audit, req.user);
    const updatedClient = await req.db.collection<IClient>(CollectionNames.CLIENTS).findOneAndUpdate(
      {_id: new ObjectID(client._id)},
      {$set: {peppolEnabled, audit: updatedAudit}},
      {returnDocument: 'after'},
    );

    if (updatedClient.ok && updatedClient.value) {
      await saveAudit(req, 'client', client, updatedClient.value);

      emitEntityEvent(
        req,
        SocketEventTypes.EntityUpdated,
        CollectionNames.CLIENTS,
        updatedClient.value._id,
        updatedClient.value,
      );

      return updatedClient.value;
    }
  }

  return client;
}
