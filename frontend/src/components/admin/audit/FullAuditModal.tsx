import { useEffect, useState } from 'react';
import { t } from '../../utils';
import { Table } from 'react-bootstrap';
import { buildRequest, failure } from '../../../actions';
import { Modal } from '../../controls/Modal';
import { SearchStringInput } from '../../controls/form-controls/inputs/SearchStringInput';
import { AuditProps } from './Audit';
import { AuditLog } from "./audit-models";
import { AuditChangeEntry } from './AuditChangeEntry';

type FullAuditModalProps = AuditProps & {
  onClose: () => void;
};


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
      dialogClassName="audit-modal"
    >
      <SearchStringInput value={needle} onChange={setNeedle} />
      <Table size="sm" bordered>
        <thead>
          <tr>
            <th style={{ width: '25%' }}>{t('audit.change.field')}</th>
            <th>{t('audit.change.new')}</th>
            <th>{t('audit.change.old')}</th>
          </tr>
        </thead>
        {filteredAudit.map(change => <AuditChangeEntry key={change._id} change={change} modelType={props.modelType} />)}
      </Table>
    </Modal>
  );
};
