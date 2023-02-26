import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ConsultantModel } from '../models/ConsultantModel';
import { EditIcon, Icon } from '../../controls/Icon';
import { t } from '../../utils';
import { ConsultantModal } from './ConsultantModal';
import { saveConsultant } from '../../../actions/consultantActions';
import { ConsultantProps } from './ConsultantLink';

/** Consultant links to detail page and option to open details in modal */
export const ConsultantIconLinks = ({ consultant }: ConsultantProps) => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState<boolean>(false);

  return (
    <>
      <Icon
        title={t('consultant.openEditModal')}
        size={1}
        style={{ color: 'grey', marginRight: 8 }}
        onClick={() => setModal(true)}
        fa="fa fa-external-link-alt"
      />
      <Link to={`/consultants/${consultant.slug}`} className="icon-link">
        <EditIcon
          style={{ fontSize: 14 }}
          title={t('consultant.viewDetails')}
        />
      </Link>

      {modal && (
        <ConsultantModal
          consultant={consultant}
          show={modal}
          onClose={() => setModal(false)}
          onConfirm={(c: ConsultantModel) => dispatch(saveConsultant(c) as any)}
        />
      )}
    </>
  );
};
