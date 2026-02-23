export interface EntityEventPayload {
  entityType: string;
  entity: unknown;
  entityId: string | null;
  sourceSocketId: string | undefined;
  sourceUserAlias: string | undefined;
}
