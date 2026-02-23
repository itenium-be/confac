import diff from 'deep-diff';
import {ConfacRequest} from '../../models/technical';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AuditableEntity = { _id?: any; audit?: any };

export async function saveAudit(
  req: ConfacRequest,
  model: 'client' | 'config' | 'consultant' | 'invoice' | 'project' | 'projectMonth' | 'user' | 'role',
  originalValue: AuditableEntity | null | undefined,
  newValue: AuditableEntity,
  extraExcludes?: string[],
) {
  const leDiff = (diff(originalValue, newValue) || [])
    .filter(x => !x.path || !['_id', 'audit'].includes(x.path[0] as string))
    .map(x => ({
      ...x,
      path: x.path?.join('.'),
      kind: x.kind === 'E' && 'rhs' in x && x.rhs === null ? 'D' : x.kind,
    }))
    .filter(x => !x.path || !(extraExcludes || []).includes(x.path as string))
    .filter(x => x.kind !== 'N' || ('rhs' in x && x.rhs));

  if (leDiff.length) {
    const log = {
      user: req.user.data.email,
      model,
      modelId: originalValue?._id,
      date: new Date().toISOString(),
      diff: leDiff,
    };
    await req.db.collection('logs_audit').insertOne(log);
  }
}

// deep-diff: https://www.npmjs.com/package/deep-diff
//
// Example output:
// [ { kind: 'E',
//     path: [ 'name' ],
//     lhs: 'original value',
//     rhs: 'new value' },
//   { kind: 'E',
//     path: [ 'details', 'with', 2 ],
//     lhs: 'elements',
//     rhs: 'more' },
//   { kind: 'A',
//     path: [ 'details', 'with' ],
//     index: 3,
//     item: { kind: 'N', rhs: 'elements' } },
//   { kind: 'A',
//     path: [ 'details', 'with' ],
//     index: 4,
//     item: { kind: 'N', rhs: { than: 'before' } } } ]
//
//
// Legend:
// kind - indicates the kind of change; will be one of the following:
//    N - indicates a newly added property/element
//    D - indicates a property/element was deleted
//    E - indicates a property/element was edited
//    A - indicates a change occurred within an array
// path - the property path (from the left-hand-side root)
// lhs - the value on the left-hand-side of the comparison (undefined if kind === 'N')
// rhs - the value on the right-hand-side of the comparison (undefined if kind === 'D')
// index - when kind === 'A', indicates the array index where the change occurred
// item - when kind === 'A', contains a nested change record indicating the change that occurred at the array index
