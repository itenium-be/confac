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


/** deep-diff return format */
type AuditChange = {
  kind: 'E' | 'N' | 'D' | 'A';
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

  return (
    <Modal
      show={true}
      onClose={props.onClose}
      title={t('audit.fullAudit')}
    >
      <Table size="sm">
        <thead>
          <tr>
            <th style={{width: '20%'}}>{t('audit.change.field')}</th>
            <th>{t('audit.change.old')}</th>
            <th>{t('audit.change.new')}</th>
          </tr>
        </thead>
        {audit.map(change => <AuditChangeEntry key={change._id} change={change} modelType={props.modelType} />)}
      </Table>
    </Modal>
  );
};


/** tbody for 1 audit entry */
const AuditChangeEntry = ({change, modelType}: {change: AuditLog, modelType: AuditModelTypes}) => {
  // TODO: ideally uses modelType to translate the diff.path that has changed
  const user = useSelector((state: ConfacState) => state.user.users.find(x => x.email === change.user));
  return (
    <tbody style={{borderBottom: '25px solid transparent'}}>
      <tr>
        <td colSpan={3} style={{borderBottomWidth: 0, fontWeight: 'bold'}}>
          {t('audit.modifiedOn', {date: formatDate(change.date), hour: formatDate(change.date, 'H:mm')})}
          {t('modifiedBy', {name: user?.alias || change.user})}
          <small>{' (' + moment(change.date).fromNow() + ')'}</small>
        </td>
      </tr>
      {change.diff.map((diff, index) => (
        <tr key={index}>
          <td>{diff.path + (diff.index ? `[${diff.index}]` : '')}</td>
          {diff.kind === 'A' ? (
            <td colSpan={2}><pre>{JSON.stringify(diff.item, undefined, 2)}</pre></td>
          ) : (
            <>
              <td>{diff.lhs?.toString()}</td>
              <td>{diff.rhs?.toString()}</td>
            </>
          )}
        </tr>
      ))}
    </tbody>
  );
}
