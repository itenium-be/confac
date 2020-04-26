import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import t from '../../../trans';
import {ClientModal} from '../../client/controls/ClientModal';
import {ConfacState} from '../../../reducers/app-state';
import {ClientModel} from '../../client/models/ClientModels';
import {Icon} from '../../controls/Icon';


type InvoiceClientCellProps = {
  client: ClientModel | undefined,
}

/** Link to a Client with option to open a Modal */
export const InvoiceClientCell = ({client, ...props}: InvoiceClientCellProps) => {
  const clients = useSelector((state: ConfacState) => state.clients);
  const [hover, setHover] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  if (!client) {
    return null;
  }

  // An Invoice keeps a copy of the client details, this is stored
  // in the InvoiceModel itself and is not present in the store
  // (they have no _id)
  const storeClient = clients.find(c => c._id === client._id);
  if (!storeClient) {
    return <span>{client.name}</span>;
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link to={`/clients/${client.slug}`} {...props}>
        {client.name}
      </Link>

      <Icon
        title={t('invoice.clientEditModal')}
        size={1}
        style={{marginLeft: 8, color: 'grey', visibility: hover ? 'unset' : 'hidden'}}
        onClick={() => setModal(true)}
        fa="fa fa-external-link-alt"
      />

      {modal && (
        <ClientModal
          client={client}
          show={modal}
          onClose={() => {
            setModal(false);
            setHover(false);
          }}
        />
      )}
    </div>
  );
};
