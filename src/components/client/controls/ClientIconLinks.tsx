import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {saveClient} from '../../../actions';
import {Icon} from '../../controls/Icon';
import {t} from '../../utils';
import {ClientModel} from '../models/ClientModels';
import {ClientEditIcon} from './ClientEditIcon';
import {ClientModal} from './ClientModal';


type ClientProps = {
  client: ClientModel;
}


export const ClientIconLinks = ({client}: ClientProps) => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState<boolean>(false);

  return (
    <>
      <Icon
        title={t('consultant.openEditModal')}
        size={1}
        style={{color: 'grey', marginRight: 8}}
        onClick={() => setModal(true)}
        fa="fa fa-external-link-alt"
      />
      <ClientEditIcon client={client} style={{color: 'grey', fontSize: 14}} />

      {modal && (
        <ClientModal
          client={client}
          show={modal}
          onClose={() => setModal(false)}
          onConfirm={(c: ClientModel) => dispatch(saveClient(c) as any)}
        />
      )}
    </>
  );
};
