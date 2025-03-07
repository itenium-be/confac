import {useState} from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment';
import {InvoiceClientCell} from '../invoice-table/InvoiceClientCell';
import {InvoiceNumberCell} from '../invoice-table/InvoiceNumberCell';
import InvoiceModel, { calculateDaysWorked } from './InvoiceModel';
import {formatDate, moneyFormat, searchinize} from '../../utils';
import {IListCell, IListRow, ListFilters} from '../../controls/table/table-models';
import {InvoiceWorkedDays} from '../invoice-list/InvoiceWorkedDays';
import {NotEmailedIcon, Icon} from '../../controls/Icon';
import {InvoiceListRowAction, InvoiceListRowActions} from '../invoice-table/InvoiceListRowActions';
import {getInvoiceListRowClass} from '../invoice-table/getInvoiceListRowClass';
import {InvoiceAmountLabel} from '../controls/InvoicesSummary';
import {InvoicesTotal} from '../invoice-edit/InvoiceTotal';
import {Features, IFeature, IFeatureBuilderConfig} from '../../controls/feature/feature-models';
import {features} from '../../../trans';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {ProjectMonthModal} from '../../project/controls/ProjectMonthModal';


export type InvoiceFeatureBuilderConfig = IFeatureBuilderConfig<InvoiceModel, ListFilters> & {
  isGroupedOnMonth: boolean;
  isQuotation: boolean;
  invoicePayDays: number;
  includedFields?: string[];
  disableFilters?: boolean;
  invoicesTotalOnly?: boolean;
  buttons?: InvoiceListRowAction[];
  currentInvoice?: InvoiceModel,
  defaultSorter?: (a: InvoiceModel, b: InvoiceModel) => number
};

export interface IInvoiceListData {
  invoices: InvoiceModel[],
  consultants: ConsultantModel[]
}


const InvoiceConsultantCell = ({invoice}: {invoice: InvoiceModel}) => {
  const [modal, setModal] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);

  const invoiceProjectMonth = invoice.projectMonth;
  if (!invoiceProjectMonth || !invoiceProjectMonth.consultantId) {
    return null;
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link to={invoiceProjectMonth.projectMonthId ? `/projects/${invoiceProjectMonth.projectMonthId}` : `/consultants/${invoiceProjectMonth.consultantId}`}>
        {invoiceProjectMonth.consultantName}
      </Link>
      {invoiceProjectMonth.projectMonthId && (
        <>
          <Icon
            style={{visibility: hover ? 'unset' : 'hidden', marginLeft: 8, color: 'grey'}}
            fa="fa fa-external-link-alt"
            size={1}
            onClick={() => setModal(true)}
            className="tst-open-project-modal"
          />
          {modal && (
            <ProjectMonthModal
              onClose={() => {
                setModal(false);
                setHover(false);
              }}
              projectMonth={invoiceProjectMonth.projectMonthId}
            />
          )}
        </>
      )}
    </div>
  );
};


const searchInvoices = (filters:  ListFilters, model: InvoiceModel) => {
    if (!filters.freeText) {
      return true;
    }
    return searchinize(
      `${model.client.name} ${model.projectMonth?.consultantName ?? ''}`,
    ).includes(searchinize(filters.freeText));
}

export function createInvoiceList(config: InvoiceFeatureBuilderConfig): IFeature<InvoiceModel> {

  const listRows: IListRow<InvoiceModel> = {
    className: invoice => getInvoiceListRowClass(invoice, config.invoicePayDays),
    cells: getInvoiceColumns(config),
  };

  let feature: IFeature<InvoiceModel, ListFilters> =  {
    key: Features.invoices,
    nav: m => `/invoices/${m === 'create' ? m : m.number}`,
    trans: features.invoice as any,
    list: {
      rows: listRows,
      data: config.data,
      sorter: config.defaultSorter ?? ( (a, b) => b.number - a.number ),
      filter: !config.disableFilters ? {
        fullTextSearch: searchInvoices,
        updateFilter: config.setFilters,
        state: config.filters,
      } : undefined
    },
  };

  feature.list.filter = {
    state: config.filters,
    updateFilter: config.setFilters,
    softDelete: true,
  };

  return feature
}


export function getInvoiceColumns(config: InvoiceFeatureBuilderConfig): IListCell<InvoiceModel>[] {

  const includedFields = config.includedFields ?? [
    ...(config.isGroupedOnMonth ? ['date-month', 'number', 'client'] : ['number', 'client', 'date-full', 'period']),
    'total-amount',
    'buttons',
    'consultant',
    'orderNr',
    'invoice-days'
  ];
  const transPrefix = config.isQuotation ? 'quotation' : 'invoice';

  const isGroupedTable = includedFields.includes('date-month');
  const columns: IListCell<InvoiceModel>[] = [{
    key: 'date-month',
    header: `${transPrefix}.date`,
    value: (i: InvoiceModel) => i.date.format('MMM YYYY'),
    footer: (invoices: InvoiceModel[]) => <InvoiceAmountLabel invoices={invoices} isQuotation={invoices[0].isQuotation} />,
    sort: (i, i2) => i.date.valueOf() - i2.date.valueOf()
  }, {
    key: 'number',
    header: 'invoice.numberShort',
    value: (i: InvoiceModel) => <InvoiceNumberCell invoice={i} />,
    // eslint-disable-next-line max-len
    footer: (invoices: InvoiceModel[]) => !isGroupedTable && <InvoiceAmountLabel invoices={invoices} isQuotation={invoices[0].isQuotation} />,
    sort: (i, i2) => i.number - i2.number
  }, {
    key: 'client',
    header: 'invoice.client',
    value: (i: InvoiceModel) => <InvoiceClientCell client={i.client} />,
    sort: (i, i2) => i.client.name.localeCompare(i2.client.name)
  }, {
    key: 'date-full',
    header: `${transPrefix}.date`,
    value: (i: InvoiceModel) => formatDate(i.date),
    sort: (i, i2) => i.date.valueOf() - i2.date.valueOf()
  }, {
    key: 'period',
    header: `${transPrefix}.period`,
    value: (i: InvoiceModel) => i.projectMonth?.month && moment(i.projectMonth.month).format('M/YY'),
    sort: (i, i2) => (moment(i.projectMonth?.month).valueOf() ?? 0) - (moment(i2.projectMonth?.month).valueOf() ?? 0)
  }, {
    key: 'consultant',
    header: `${transPrefix}.consultant`,
    value: (i: InvoiceModel) => <InvoiceConsultantCell invoice={i} />,
    sort: (i, i2) => (i.projectMonth?.consultantName ?? '').localeCompare(i2.projectMonth?.consultantName ?? '')
  }, {
    key: 'orderNr',
    header: `${transPrefix}.orderNrShort`,
    value: (i: InvoiceModel) => i.orderNr,
    sort: (i, i2) => i.orderNr.localeCompare(i2.orderNr)
  }, {
    key: 'invoice-days',
    header: 'invoice.days',
    value: (invoice: InvoiceModel) => (
      <InvoiceWorkedDays
        invoices={[invoice]}
        display="invoice"
      />
    ),
    sort: (i, i2) => calculateDaysWorked([i]).daysWorked - calculateDaysWorked([i2]).daysWorked,
    footer: invoices => <InvoiceWorkedDays invoices={invoices} />,
  }, {
    key: 'total-amount',
    header: {
      title: 'invoice.totalTitle',
      width: 140,
    },
    style: {textAlign: 'right', whiteSpace: 'nowrap'},
    value: (invoice: InvoiceModel) => (
      <>
        {!invoice.verified && !invoice.lastEmail && <NotEmailedIcon style={{marginRight: 6, fontSize: 12}} />}
        {moneyFormat(invoice.money.total)}
      </>
    ),
    sort: (i, i2) => i.money.total - i2.money.total,
    footer: invoices => <InvoicesTotal invoices={invoices} totalOnly={config.invoicesTotalOnly} />,
  }, {
    key: 'buttons',
    header: '',
    className: 'icons-cell',
    value: (i: InvoiceModel) =>
    <InvoiceListRowActions
      invoice={i}
      buttons={config.buttons}
      hideEdit={(config.currentInvoice?.number ) === i.number}
    />,
  }];

  const result = columns.filter(col => includedFields.includes(col.key));
  // console.log('result, ', result);
  return result;
}
