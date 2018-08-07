import React from 'react';
import {ClientEditIcon, HeaderWithEditIcon} from '../../controls.js';

const ClientDetails = ({client, onOpenDetails}) => (
  <div>
    <HeaderWithEditIcon label={client.name} size={4} data-tst="client-header">
      <ClientEditIcon
        onClick={onOpenDetails}
        client={client}
        title=""
        size={1}
        style={{marginLeft: 6}}
        data-tst="client-header-edit"
      />
    </HeaderWithEditIcon>
    <div data-tst="client-address">{client.address}</div>
    <div data-tst="client-city">{client.city}</div>
    <div data-tst="client-telephone">{client.telephone}</div>
    <div data-tst="client-btw">{client.btw}</div>
  </div>
);

export default ClientDetails;
