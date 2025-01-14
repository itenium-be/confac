export interface EntityEventPayload {
  entityType: string;
  entity: any;
  entityId: string | null;
  sourceSocketId: string | undefined;
  sourceUserEmail: string | undefined;
}
