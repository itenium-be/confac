import React, {Component} from 'react';
import {connect} from 'react-redux';
import {t} from '../util';

import {ClientEditIcon, InvoiceWorkedDays, InvoicesSummary, DeleteIcon} from '../controls';
import {saveClient} from '../../actions/index';
import EditInvoiceModel from '../invoice/models/EditInvoiceModel';
import { EditClientModel } from './models/ClientModels';


export const ClientListHeader = () => (
  <thead>
    <tr>
      <th>{t('client.name')}</th>
      <th>{t('client.contact')}</th>
      <th>{t('client.timeTitle')}</th>
      <th>{t('invoice.amount')}</th>
      <th>&nbsp;</th>
    </tr>
  </thead>
);


type ClientListRowProps = {
  invoices: EditInvoiceModel[],
  saveClient: Function,
  client: EditClientModel,
}

class ClientListRow extends Component<ClientListRowProps> {
  render() {
    const {client} = this.props;
    const invoices = this.props.invoices.filter(i => i.client._id === client._id);
    const tst = key => `client-${client.name}-${key}`;
    return (
      <tr className={client.active ? undefined : 'table-danger'} data-tst={tst('row')}>
        <td>
          <strong data-tst={tst('name')}>{client.name}</strong>
          <br />
          <span data-tst={tst('btw')}>{client.btw}</span>
        </td>
        <td>
          <span data-tst={tst('address')}>{client.address}</span>
          <br />
          <span data-tst={tst('city')}>{client.city}</span>
          <br />
          <span data-tst={tst('telephone')}>{client.telephone}</span>
        </td>
          <td><InvoiceWorkedDays invoices={invoices} display="client" data-tst={tst('days')} /></td>
        <td style={{whiteSpace: 'nowrap'}}><InvoicesSummary invoices={invoices} data-tst={tst('summary')} /></td>
        <td className="icons-cell">
          <ClientEditIcon client={client} data-tst={tst('edit')} />
          <DeleteIcon
            onClick={() => this.props.saveClient({...client, active: !client.active}, true)}
            title={client.active ? t('client.deactivateTitle') : t('client.activateTitle')}
            data-tst={tst('delete')}
          />
        </td>
      </tr>
    );
  }
}

export default connect(null, {saveClient})(ClientListRow);
