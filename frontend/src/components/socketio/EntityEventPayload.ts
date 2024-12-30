export interface EntityEventPayload {
  entityType: string;
  entity: any;
  entityId: string;
  sourceSocketId: string | undefined;
}
