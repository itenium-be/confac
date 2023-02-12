import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {formatDate, t} from '../utils';
import {IAudit} from '../../models';
import {ConfacState} from '../../reducers/app-state';
import {Icon} from '../controls/Icon';
import {Table} from 'react-bootstrap';
import {buildRequest, failure} from '../../actions';
import {Modal} from '../controls/Modal';
import {SearchStringInput} from '../controls/form-controls/inputs/SearchStringInput';


type AuditModelTypes = 'config' | 'client' | 'project' | 'projectMonth' | 'invoice' | 'consultant' | 'user' | 'role';


type AuditProps = {
  modelType: AuditModelTypes;
  model: any;
}

/** Displays basic audit info & icon to open details in a modal */
export const Audit = (props: AuditProps) => {
  const audit: IAudit = props.model.audit;
  const createdBy = useSelector((state: ConfacState) => state.user.users.find(x => x._id === (audit && audit.createdBy)));
  const modifiedBy = useSelector((state: ConfacState) => state.user.users.find(x => x._id === (audit && audit.modifiedBy)));

  if (!audit) {
    return null;
  }

  if (!audit.createdOn && !audit.modifiedOn) {
    return null;
  }

  return (
    <small className="created-on">
      {audit.createdOn && t('createdOn', {date: formatDate(audit.createdOn, 'DD/MM/YYYY'), hour: formatDate(audit.createdOn, 'H:mm')})}
      {createdBy && t('createdBy', {name: createdBy.alias})}

      {audit.modifiedOn && (
        <>
          {audit.createdOn && <br />}
          {t('modifiedOn', {date: formatDate(audit.modifiedOn), hour: formatDate(audit.modifiedOn, 'H:mm')})}
          {modifiedBy && t('modifiedBy', {name: modifiedBy.alias})}
          <FullAudit {...props} />
        </>
      )}
    </small>
  );
};




/** Icon to open the FullAuditModal */
export const FullAudit = (props: AuditProps) => {
  const [modal, setModal] = useState<boolean>(false);

  if (!props.model._id || !props.model.audit?.modifiedOn)
    return null;

  return (
    <>
      <Icon
        title={t('audit.openFullAuditModel')}
        size={1}
        style={{color: 'grey', marginLeft: 8, fontSize: 14}}
        onClick={() => setModal(true)}
        fa="fa fa-external-link-alt"
      />
      {modal && (
        <FullAuditModal onClose={() => setModal(false)} {...props} />
      )}
    </>
  );
};



/** Backend logging model */
type AuditLog = {
  _id: string;
  user: string;
  model: AuditModelTypes;
  modelId: string;
  date: Date;
  diff: AuditChange[];
}

type AuditChangeKind = 'E' | 'N' | 'D' | 'A';

/** deep-diff return format */
type AuditChange = {
  kind: AuditChangeKind;
  /** deep-diff returns ['path', 'prop'] bit this has been join('.')d */
  path: string;
  /** Only when kind=A */
  index: number;
  /** Only when kind=A */
  item: any;
  /** When kind!=A */
  lhs: any;
  /** When kind!=A */
  rhs: any;
}


type FullAuditModalProps = AuditProps & {
  onClose: () => void;
}

/** Fetches audit info from backend & displays the changes in a table */
export const FullAuditModal = (props: FullAuditModalProps) => {
  const [audit, setAudit] = useState<AuditLog[] | null>(null);
  const [needle, setNeedle] = useState('');
  useEffect(() => {
    fetch(buildRequest(`/config/audit?model=${props.modelType}&modelId=${props.model._id}`))
      .then(res => res.json())
      .then(fetchedAudit => typeof fetchedAudit.length === 'number' ? fetchedAudit : [])
      .then(fetchedAudit => setAudit(fetchedAudit.sort((a, b) => b.date.localeCompare(a.date))))
      .catch(err => failure(err));
  }, [props.modelType, props.model._id]);

  if (!audit)
    return null;

  if (!audit.length)
    return <span>{t('audit.noLogs')}</span>;

  let filteredAudit = audit;
  if (needle) {
    filteredAudit = filteredAudit.filter(auditLog => {
      const auditStr = JSON.stringify({
        user: auditLog.user,
        diff: auditLog.diff,
        date: auditLog.date,
      });
      return auditStr.toLocaleLowerCase().includes(needle.trim().toLocaleLowerCase());
    });
  }

  return (
    <Modal
      show={true}
      onClose={props.onClose}
      title={t('audit.fullAudit')}
    >
      <SearchStringInput value={needle} onChange={setNeedle} />
      <Table size="sm" bordered>
        <thead>
          <tr>
            <th style={{width: '25%'}}>{t('audit.change.field')}</th>
            <th>{t('audit.change.old')}</th>
            <th>{t('audit.change.new')}</th>
          </tr>
        </thead>
        {filteredAudit.map(change => <AuditChangeEntry key={change._id} change={change} modelType={props.modelType} />)}
      </Table>
    </Modal>
  );
};


function displayVal(value: any): string {
  if (typeof value === 'boolean')
    return value.toString();

  if (typeof value === 'number')
    return value.toFixed(2);

  if (typeof value === 'object')
    return JSON.stringify(value, undefined, 2);

  // Date format: 2023-02-12T00:22:45.183Z
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\./.test(value))
    return formatDate(value);

  return value;
}


/** tbody for 1 audit entry */
const AuditChangeEntry = ({change, modelType}: {change: AuditLog, modelType: AuditModelTypes}) => {
  // TODO: ideally uses modelType to translate the diff.path that has changed
  const user = useSelector((state: ConfacState) => state.user.users.find(x => x.email === change.user));

  return (
    <tbody>
      <tr>
        <td colSpan={3} style={{fontWeight: 'bold'}}>
          {t('audit.modifiedOn', {date: formatDate(change.date), hour: formatDate(change.date, 'H:mm')})}
          {t('modifiedBy', {name: user?.alias || change.user})}
          <small>{' (' + moment(change.date).fromNow() + ')'}</small>
        </td>
      </tr>
      {change.diff.map((diff, index) => (
        <tr key={index}>
          <td style={{wordBreak: 'break-all'}}>
            <AuditChangeEntryIcon diff={diff} />
            {diff.path + (diff.index ? `[${diff.index}]` : '')}
          </td>
          {diff.kind === 'A' || !diff.lhs || !diff.rhs ? (
            <td colSpan={2}><pre>{displayVal(diff.item || diff.lhs || diff.rhs)}</pre></td>
          ) : (
            <>
              <td>{displayVal(diff.lhs)}</td>
              <td>{displayVal(diff.rhs)}</td>
            </>
          )}
        </tr>
      ))}
    </tbody>
  );
}


const AuditChangeEntryIcon = (props: {diff: AuditChange}) => {
  const commonStyle = {marginRight: 8};
  switch (props.diff.kind) {
  case 'A':
    return <i className="" style={commonStyle} />;
  case 'D':
    return <i className="fa fa-trash" style={{color: 'red', ...commonStyle}} />;
  case 'E':
    return <i className="far fa-edit" style={{color: 'gray', ...commonStyle}} />;
  case 'N':
    return <i className="fa fa-plus" style={commonStyle} />;
  default:
    return null;
  }
}
