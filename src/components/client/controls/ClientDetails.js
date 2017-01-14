import React from 'react';
import {EditIcon } from '../../controls.js';

const ClientDetails = ({client}) => (
  <div>
    <h4>
      {client.name}
      <small style={{marginLeft: 6}}>
        <EditIcon title="" size={1} onClick={'/client/' + client._id} />
      </small>
    </h4>
    <div>{client.address}</div>
    <div>{client.city}</div>
    <div>{client.telephone}</div>
    <div>{client.btw}</div>
  </div>
);

export default ClientDetails;
