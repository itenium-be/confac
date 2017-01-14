import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { t/*, moneyFormat*/ } from '../util.js';

import { ConfirmedDeleteIcon, EditIcon } from '../controls.js';
import { deleteClient } from '../../actions/index.js';



export const ClientListHeader = () => (
  <thead>
    <tr>
      <th>{t('client.name')}</th>
      <th>{t('client.contact')}</th>
      <th>{t('invoice.invoices')}</th>
      <th>{t('client.rate')}</th>
      <th>{t('client.totals')}</th>
      <th>&nbsp;</th>
    </tr>
  </thead>
);



class ClientListRow extends Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    deleteClient: PropTypes.func.isRequired,
  }
  render() {
    const client = this.props.client;
    return (
      <tr>
        <td>
          <strong>{client.name}</strong>
          <br />
          {client.btw}
        </td>
        <td>
          {client.address}
          <br />
          {client.city}
          <br />
          {client.telephone}
        </td>
        <td>{6}</td>
        <td>{client.rate.value}</td>
        <td>{client.rate.description}</td>
        <td className="icons-cell">
          <EditIcon onClick={'/client/' + client._id} />
          <ConfirmedDeleteIcon
            title={t('invoice.deleteTitle')}
            onClick={() => this.props.deleteClient(client)}
          >
            {t('invoice.deletePopup', {name: client.name})}
          </ConfirmedDeleteIcon>
        </td>
      </tr>
    );
  }
}



export const ClientListFooter = ({clients}) => {
  if (clients.length === 0) {
    return null;
  }

  return (
    <tfoot>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </tfoot>
  );
};



export default connect(() => ({}), {deleteClient})(ClientListRow);
