import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {ConsultantModel} from '../models/ConsultantModel';
import {Icon} from '../../controls/Icon';
import {t} from '../../utils';
import {ConsultantModal} from './ConsultantModal';
import {saveConsultant} from '../../../actions/consultantActions';


type ConsultantProps = {
  consultant: ConsultantModel;
}

export const ConsultantLink = ({consultant}: ConsultantProps) => (
  <Link to={`/consultants/${consultant.slug}`}>
    {`${consultant.firstName} ${consultant.name}`}
  </Link>
);


type ConsultantLinkWithModalProps = ConsultantProps & {
  showType?: boolean;
}


/** Link to a Consultant with option to open a Modal */
export const ConsultantLinkWithModal = ({consultant, showType}: ConsultantLinkWithModalProps) => {
  const dispatch = useDispatch();
  const [hover, setHover] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  if (!consultant) {
    return null;
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <ConsultantLink consultant={consultant} />

      {showType && (
        <>
          <small style={{paddingLeft: 6}}>
            {`(${t(`consultant.types.${consultant.type}`).toLowerCase()})`}
          </small>
        </>
      )}

      <Icon
        title={t('consultant.openEditModal')}
        size={1}
        style={{marginLeft: 8, color: 'grey', visibility: hover ? 'unset' : 'hidden'}}
        onClick={() => setModal(true)}
        fa="fa fa-external-link-alt"
      />

      {modal && (
        <ConsultantModal
          consultant={consultant}
          show={modal}
          onClose={() => {
            setModal(false);
            setHover(false);
          }}
          onConfirm={(c: ConsultantModel) => dispatch(saveConsultant(c) as any)}
        />
      )}
    </div>
  );
};

