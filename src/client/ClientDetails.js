import React from 'react';
import t from '../trans.js';

const ClientDetails = ({client}) => (
  <div>
    <h3>{client.name}</h3>
    <div>{client.address}</div>
    <div>{client.city}</div>
    <div>{client.telephone}</div>
    <div>{client.btw}</div>
    <div><strong>{t('client.hourlyRate')}: €{client.rate.hourly}</strong></div>
  </div>
);

export default ClientDetails;
