import React from 'react';

const ClientDetails = ({client}) => (
  <div>
    <h4>{client.name}</h4>
    <div>{client.address}</div>
    <div>{client.city}</div>
    <div>{client.telephone}</div>
    <div>{client.btw}</div>
  </div>
);

export default ClientDetails;
