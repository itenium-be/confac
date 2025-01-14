import { useSelector } from 'react-redux';
import moment from 'moment';
import { formatDate, t } from '../../utils';
import { ConfacState } from '../../../reducers/app-state';
import { AuditChangeEntryIcon } from './AuditChangeEntryIcon';
import { AuditLog, AuditModelTypes } from "./audit-models";

/** tbody for 1 audit entry */
export const AuditChangeEntry = ({ change, modelType }: { change: AuditLog; modelType: AuditModelTypes; }) => {
  // TODO: ideally uses modelType to translate the diff.path that has changed
  const user = useSelector((state: ConfacState) => state.user.users.find(x => x.email === change.user));

  return (
    <tbody>
      <tr>
        <td colSpan={3} style={{ fontWeight: 'bold' }}>
          {t('audit.modifiedOn', { date: formatDate(change.date), hour: formatDate(change.date, 'H:mm') })}
          {t('modifiedBy', { name: user?.alias || change.user })}
          <small>{' (' + moment(change.date).fromNow() + ')'}</small>
        </td>
      </tr>
      {change.diff.map((diff, index) => (
        <tr key={index}>
          <td style={{ wordBreak: 'break-all' }}>
            <AuditChangeEntryIcon diff={diff} />
            {diff.path + (diff.index ? `[${diff.index}]` : '')}
          </td>
          {diff.kind === 'A' || !diff.lhs || !diff.rhs ? (
            <td colSpan={2}><pre>{displayVal(diff.item || diff.lhs || diff.rhs)}</pre></td>
          ) : (
            <>
              <td>{displayVal(diff.rhs)}</td>
              <td>{displayVal(diff.lhs)}</td>
            </>
          )}
        </tr>
      ))}
    </tbody>
  );
};


function displayVal(value: any): string {
  if (typeof value === 'boolean')
    return value.toString();

  if (typeof value === 'number') {
    if (Number.isInteger(value))
      return value.toString();

    return value.toFixed(2);
  }

  if (typeof value === 'object')
    return JSON.stringify(value, undefined, 2);

  // Date format: 2023-02-12T00:22:45.183Z
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\./.test(value))
    return formatDate(value);

  return value;
}
