import {useSelector} from 'react-redux';
import {formatDate, t} from '../../utils';
import {IAudit} from '../../../models';
import {ConfacState} from '../../../reducers/app-state';
import {AuditModelTypes} from './audit-models';
import {FullAudit} from './FullAudit';


export type AuditProps = {
  modelType: AuditModelTypes;
  model: {_id: string; audit?: IAudit};
}

/** Displays basic audit info & icon to open details in a modal */
export const Audit = (props: AuditProps) => {
  const audit: IAudit = props.model?.audit;
  const createdBy = useSelector((state: ConfacState) => state.user.users.find(x => x._id === (audit && audit.createdBy)));
  const modifiedBy = useSelector((state: ConfacState) => state.user.users.find(x => x._id === (audit && audit.modifiedBy)));

  if (!audit) {
    return null;
  }

  if (!audit.createdOn && !audit.modifiedOn) {
    return null;
  }

  const createdByAlias = createdBy?.alias || audit.createdBy;
  const modifiedByAlias = modifiedBy?.alias || audit.modifiedBy;
  return (
    <small className="created-on">
      {audit.createdOn && t('createdOn', {date: formatDate(audit.createdOn, 'DD/MM/YYYY'), hour: formatDate(audit.createdOn, 'H:mm')})}
      {createdByAlias && t('createdBy', {name: createdByAlias})}

      {audit.modifiedOn && (
        <>
          {audit.createdOn && <br />}
          {t('modifiedOn', {date: formatDate(audit.modifiedOn), hour: formatDate(audit.modifiedOn, 'H:mm')})}
          {modifiedByAlias && t('modifiedBy', {name: modifiedByAlias})}
          <FullAudit {...props} />
        </>
      )}
    </small>
  );
};
