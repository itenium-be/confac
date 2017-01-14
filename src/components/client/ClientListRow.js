import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {t} from '../util.js';

import {EditIcon, InvoiceWorkedDays, InvoicesSummary, DeleteIcon} from '../controls.js';
import {saveClient} from '../../actions/index.js';


export const ClientListHeader = () => (
  <thead>
    <tr>
      <th>{t('client.name')}</th>
      <th>{t('client.contact')}</th>
      <th>{t('client.rate.title')}</th>
      <th>{t('client.timeTitle')}</th>
      <th>{t('invoice.invoices')}</th>
      <th>&nbsp;</th>
    </tr>
  </thead>
);


class ClientListRow extends Component {
  static propTypes = {
    invoices: PropTypes.array.isRequired,
    saveClient: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
  }
  render() {
    const {client} = this.props;
    const invoices = this.props.invoices.filter(i => i.client._id === client._id);
    return (
      <tr className={client.active ? undefined : 'danger'}>
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
        <td>{client.rate.value}</td>
        <td><InvoiceWorkedDays invoices={invoices} display="client" /></td>
        <td style={{whiteSpace: 'nowrap'}}><InvoicesSummary invoices={invoices} /></td>
        <td className="icons-cell" width="120px">
          <EditIcon onClick={'/client/' + client._id} />
          <DeleteIcon
            onClick={() => this.props.saveClient({...client, active: !client.active})}
            title={client.active ? t('client.deactivateTitle') : t('client.activateTitle')}
          />
        </td>
      </tr>
    );
  }
}

export default connect(state => ({invoices: state.invoices}), {saveClient})(ClientListRow);
