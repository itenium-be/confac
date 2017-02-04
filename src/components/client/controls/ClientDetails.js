import React from 'react';
import {ClientEditIcon, HeaderWithEditIcon} from '../../controls.js';

const ClientDetails = ({client}) => (
  <div>
    <HeaderWithEditIcon label={client.name} size={4}>
      <ClientEditIcon client={client} title="" size={1} style={{marginLeft: 6}} />
    </HeaderWithEditIcon>
    <div>{client.address}</div>
    <div>{client.city}</div>
    <div>{client.telephone}</div>
    <div>{client.btw}</div>
  </div>
);

export default ClientDetails;
