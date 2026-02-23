export type AuditModelTypes = 'config' | 'client' | 'project' | 'projectMonth' | 'invoice' | 'consultant' | 'user' | 'role';


/** Backend logging model */
export type AuditLog = {
  _id: string;
  user: string;
  model: AuditModelTypes;
  modelId: string;
  date: Date;
  diff: AuditChange[];
};


type AuditChangeKind = 'E' | 'N' | 'D' | 'A';


/** deep-diff return format */
export type AuditChange = {
  kind: AuditChangeKind;
  /** deep-diff returns ['path', 'prop'] bit this has been join('.')d */
  path: string;
  /** Only when kind=A */
  index: number;
  /** Only when kind=A */
  item: unknown;
  /** When kind!=A */
  lhs: unknown;
  /** When kind!=A */
  rhs: unknown;
};
