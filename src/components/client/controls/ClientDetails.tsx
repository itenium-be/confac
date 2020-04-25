import React from 'react';
import {Link} from 'react-router-dom';
import {t} from '../../utils';
import {ClientModel} from '../models/ClientModels';
import {EditIcon, ClientEditIcon} from '../../controls/Icon';
import {HeaderWithEditIcon} from '../../controls/Headers';

type ClientDetailsProps = {
  client: ClientModel;
  onOpenDetails: Function;
  onOpenDetailsTitle: string;
}

/**
 * A small box with general client details
 * Can open client edit in modal or fullscreen
 * (used in EditInvoice)
 */
const ClientDetails = ({client, onOpenDetails, onOpenDetailsTitle}: ClientDetailsProps) => (
  <div>
    <HeaderWithEditIcon label={client.name} size={4}>
      <ClientEditIcon
        onClick={onOpenDetails}
        client={client}
        title={t(onOpenDetailsTitle || 'edit')}
        size={1}
        style={{marginLeft: 8, marginRight: 8}}
        fa="fa fa-external-link-alt"
      />
      <Link to={`/clients/${client.slug}`} className="icon-link">
        <EditIcon
          size={1}
          style={{marginLeft: 6}}
          title={t('client.viewDetails')}
        />
      </Link>
    </HeaderWithEditIcon>
    <div>{client.address}</div>
    <div>{client.city}</div>
    <div>{client.telephone}</div>
    <div>{client.btw}</div>
  </div>
);

export default ClientDetails;
