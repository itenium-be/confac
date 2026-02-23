import {ObjectId} from 'bson';
import {CollectionNames, SocketEventTypes} from '../../models/common';
import {ConfacRequest} from '../../models/technical';

interface EntityEventPayload {
  entityType: string;
  entity: unknown;
  entityId: ObjectId | null | string;
  sourceSocketId: string | string[] | undefined;
  sourceUserAlias: string | undefined;
}

export function emitEntityEvent(
  req: ConfacRequest,
  eventType: SocketEventTypes,
  entityType: CollectionNames,
  entityId: ObjectId | null | string,
  entity: unknown,
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
