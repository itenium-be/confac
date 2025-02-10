import {Link} from 'react-router-dom';
import {IList, IListCell, ClientListFilters} from '../../controls/table/table-models';
import {Features, IFeature, IFeatureBuilderConfig} from '../../controls/feature/feature-models';
import {features} from '../../../trans';
import {ClientModel} from './ClientModels';
import {InvoiceWorkedDays} from '../../invoice/invoice-list/InvoiceWorkedDays';
import InvoiceModel from '../../invoice/models/InvoiceModel';
import {InvoicesSummary} from '../../invoice/controls/InvoicesSummary';
import {DeleteIcon} from '../../controls/icons/DeleteIcon';
import {t} from '../../utils';
import {searchClientForList} from './searchClientFor';
import {getInvoiceYears} from '../../invoice/models/InvoiceListModel';
import {YearsSelect} from '../../controls/form-controls/select/YearsSelect';
import {ClientEditIcon} from '../controls/ClientEditIcon';
import {Claim} from '../../users/models/UserModel';


export type ClientFeatureBuilderConfig = IFeatureBuilderConfig<ClientModel, ClientListFilters> & {
  invoices: InvoiceModel[];
};


const clientListConfig = (config: ClientFeatureBuilderConfig): IList<ClientModel, ClientListFilters> => {
  const cells: IListCell<ClientModel>[] = [{
    key: 'name',
    header: 'client.name',
    value: client => (
      <>
        <Link to={`/clients/${client.slug}`}>
          <strong>{client.name}</strong>
        </Link>
        <br />
        <span>{client.btw}</span>
      </>
    ),
    sort: (c1, c2) => c1.name.localeCompare(c2.name)
  }, {
    key: 'type',
    header: 'client.type',
    value: client => (<>{client.type.map( t => (<><span>{t}</span><br /></>))}</>)
  }, {
    key: 'contact',
    header: 'client.contact',
    value: client => (
      <>
        <span>{client.address}</span>
        <br />
        <span>{client.postalCode} {client.city}</span>
        <br />
        <span>{client.telephone}</span>
      </>
    ),
    sort: (c1, c2) => c1.address.localeCompare(c2.address)
  }, {
    key: 'time-invested',
    header: 'client.timeTitle',
    value: client => {
      let clientInvoices = config.invoices.filter(i => i.client._id === client._id);
      if (config.filters.years && config.filters.years.length) {
        clientInvoices = clientInvoices.filter(i => config.filters.years.includes(i.date.year()));
      }
      return <InvoiceWorkedDays invoices={clientInvoices} display="client" />;
    },
  }, {
    key: 'invoices',
    header: 'invoice.amount',
    value: client => {
      let clientInvoices = config.invoices.filter(i => i.client._id === client._id);
      if (config.filters.years && config.filters.years.length) {
        clientInvoices = clientInvoices.filter(i => config.filters.years.includes(i.date.year()));
      }
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
          claim={Claim.ManageClients}
          onClick={() => config.save({...client, active: !client.active}, true)}
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
    data: config.data,
    sorter: (a, b) => a.name.localeCompare(b.name),
  };
};


export const clientFeature = (config: ClientFeatureBuilderConfig): IFeature<ClientModel, ClientListFilters> => {
  const feature: IFeature<ClientModel, ClientListFilters> = {
    key: Features.clients,
    nav: m => `/clients/${m === 'create' ? m : m.slug}`,
    trans: features.client as any,
    list: clientListConfig(config),
  };

  feature.list.filter = {
    state: config.filters,
    updateFilter: config.setFilters,
    fullTextSearch: searchClientForList,
    softDelete: true,
    extras: () => (
      <YearsSelect
        values={config.filters.years}
        years={getInvoiceYears(config.invoices)}
        onChange={(values: number[]) => config.setFilters({...config.filters, years: values || []})}
      />
    ),
  };

  return feature;
};
