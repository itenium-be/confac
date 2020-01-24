import React from 'react';
import {Link} from 'react-router-dom';
import {IList, IListCell} from '../../controls/table/table-models';
import {IFeature} from '../../controls/feature/feature-models';
import {features} from '../../../trans';
import {ClientModel} from './ClientModels';
import {InvoiceWorkedDays} from '../../invoice/invoice-list/InvoiceWorkedDays';
import InvoiceModel from '../../invoice/models/InvoiceModel';
import {InvoicesSummary} from '../../invoice/controls/InvoicesSummary';
import {ClientEditIcon, DeleteIcon} from '../../controls/Icon';
import {t} from '../../utils';


export type ClientFeature = {
  clients: ClientModel[];
  invoices: InvoiceModel[];
  saveClient: Function;
}


const clientListConfig = (config: ClientFeature): IList<ClientModel> => {
  const cells: IListCell<ClientModel>[] = [{
    key: 'name',
    header: 'client.name',
    value: client => (
      <>
        <Link to={`clients/${client.slug}`}>
          <strong>{client.name}</strong>
        </Link>
        <br />
        <span>{client.btw}</span>
      </>
    ),
  }, {
    key: 'contact',
    header: 'client.contact',
    value: client => (
      <>
        <span>{client.address}</span>
        <br />
        <span>{client.city}</span>
        <br />
        <span>{client.telephone}</span>
      </>
    ),
  }, {
    key: 'time-invested',
    header: 'client.timeTitle',
    value: client => {
      const clientInvoices = config.invoices.filter(i => i.client._id === client._id);
      return <InvoiceWorkedDays invoices={clientInvoices} display="client" />;
    },
  }, {
    key: 'invoices',
    header: 'invoice.amount',
    value: client => {
      const clientInvoices = config.invoices.filter(i => i.client._id === client._id);
      return <InvoicesSummary invoices={clientInvoices} />;
    },
  }, {
    key: 'buttons',
    header: '',
    className: 'icons-cell',
    value: client => (
      <>
        <ClientEditIcon client={client} />
        <DeleteIcon
          onClick={() => config.saveClient({...client, active: !client.active}, true)}
          title={client.active ? t('client.deactivateTitle') : t('client.activateTitle')}
        />
      </>
    ),
  }];

  return {
    rows: {
      className: client => (client.active ? undefined : 'table-danger'),
      cells,
    },
    data: config.clients,
    sorter: (a, b) => a.name.localeCompare(b.name),
  };
};


export const clientFeature = (config: ClientFeature): IFeature<ClientModel> => {
  return {
    nav: m => `/clients/${m === 'create' ? m : m.slug}`,
    trans: features.client as any,
    list: clientListConfig(config),
  };
};
