import {ObjectID} from 'bson';
import {CollectionNames, SocketEventTypes} from '../../models/common';
import {ConfacRequest} from '../../models/technical';

export function emitEntityEvent(req: ConfacRequest, eventType: SocketEventTypes, entityType: CollectionNames, entityId: ObjectID | null, entity: any | null) {
  const sourceSocketId = req.headers ? req.headers['x-socket-id'] : null;
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
  entityId: ObjectID | null;
  sourceSocketId: string | undefined;
  sourceUserEmail: string | undefined;
}
