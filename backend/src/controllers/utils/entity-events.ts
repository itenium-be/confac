import { ObjectID } from 'bson';
import {CollectionNames, SocketEventTypes} from '../../models/common';
import {ConfacRequest} from '../../models/technical';

export function emitEntityEvent(req: ConfacRequest, eventType: SocketEventTypes, entityType: CollectionNames, entity:any, entityId: ObjectID) {
  const sourceSocketId = req.headers['x-socket-id'];
  const sourceUserEmail = req.user?.data?.email;
  req.io.emit(eventType, {
    entityType,
    entity,
    entityId,
    sourceSocketId,
    sourceUserEmail,
  } as EntityEventPayload);
}

interface EntityEventPayload{
  entityType: string;
  entity: any;
  entityId: ObjectID;
  sourceSocketId: string | undefined;
  sourceUserEmail: string | undefined;
}