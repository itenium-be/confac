import {ObjectID} from 'bson';
import {CollectionNames, SocketEventTypes} from '../../models/common';
import {ConfacRequest} from '../../models/technical';

export function emitEntityEvent(
  req: ConfacRequest,
  eventType: SocketEventTypes,
  entityType: CollectionNames,
  entityId: ObjectID | null,
  entity: any | null,
  sendTo: 'everyone' | 'others' = 'others',
) {

  const sourceSocketId = req.headers ? req.headers['x-socket-id'] : null;
  const sourceUserAlias = req.user?.data?.alias;
  req.io.emit(eventType, {
    entityType,
    entity,
    entityId,
    sourceSocketId: sendTo === 'everyone' ? undefined : sourceSocketId,
    sourceUserAlias,
  } as EntityEventPayload);
}

interface EntityEventPayload {
  entityType: string;
  entity: any;
  entityId: ObjectID | null;
  sourceSocketId: string | undefined;
  sourceUserAlias: string | undefined;
}
