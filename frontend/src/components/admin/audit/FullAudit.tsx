import {useState} from 'react';
import {t} from '../../utils';
import {Icon} from '../../controls/Icon';
import {FullAuditModal} from './FullAuditModal';
import {AuditProps} from './Audit';

/** Icon to open the FullAuditModal */
export const FullAudit = (props: AuditProps) => {
  const [modal, setModal] = useState<boolean>(false);

  if (!props.model?._id || !props.model?.audit?.modifiedOn)
    return null;

  return (
    <>
      <Icon
        className="tst-open-audit-modal"
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
