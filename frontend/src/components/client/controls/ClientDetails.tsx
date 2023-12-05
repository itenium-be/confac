import React from 'react';
import {Link} from 'react-router-dom';
import {t} from '../../utils';
import {ClientModel} from '../models/ClientModels';
import {EditIcon} from '../../controls/Icon';
import {HeaderWithEditIcon} from '../../controls/Headers';
import {ClientEditIcon} from './ClientEditIcon';

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
  <>
    <HeaderWithEditIcon label={client.name} size={4}>
      <ClientEditIcon
        onClick={onOpenDetails}
        client={client}
        title={t(onOpenDetailsTitle || 'edit')}
        style={{marginLeft: 6, marginRight: 12, fontSize: 14}}
        className="tst-icon-link"
        fa="fa fa-external-link-alt"
      />
      <Link to={`/clients/${client.slug}`} className="icon-link">
        <EditIcon
          style={{fontSize: 14}}
          title={t('client.viewDetails')}
        />
      </Link>
    </HeaderWithEditIcon>
    <div>{client.address}</div>
    <div>{client.city}</div>
    <div>{client.telephone}</div>
    <div>{client.btw}</div>
  </>
);

export default ClientDetails;
