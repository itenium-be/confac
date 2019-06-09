import React from 'react';
import {Link} from 'react-router';
import {ClientEditIcon, HeaderWithEditIcon, EditIcon} from '../../controls.js';
import {t} from '../../util.js';

const ClientDetails = ({client, onOpenDetails, onOpenDetailsTitle}) => (
  <div>
    <HeaderWithEditIcon label={client.name} size={4} data-tst="client-header">
      <ClientEditIcon
        onClick={onOpenDetails}
        client={client}
        title={t(onOpenDetailsTitle || 'edit')}
        size={1}
        style={{marginLeft: 8, marginRight: 8}}
        data-tst="client-header-edit"
        fa="fa fa-external-link"
      />
      <Link to={'/client/' + client.slug} className="icon-link">
        <EditIcon
          size={1}
          style={{marginLeft: 6}}
          data-tst="client-header-view"
          title={t('client.viewDetails')}
        />
      </Link>
    </HeaderWithEditIcon>
    <div data-tst="client-address">{client.address}</div>
    <div data-tst="client-city">{client.city}</div>
    <div data-tst="client-telephone">{client.telephone}</div>
    <div data-tst="client-btw">{client.btw}</div>
  </div>
);

export default ClientDetails;
