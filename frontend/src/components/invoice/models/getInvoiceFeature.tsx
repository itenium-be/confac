import {useState} from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment';
import {InvoiceClientCell} from '../invoice-table/InvoiceClientCell';
import {InvoiceNumberCell} from '../invoice-table/InvoiceNumberCell';
import InvoiceModel from './InvoiceModel';
import {formatDate, moneyFormat, searchinize} from '../../utils';
import {IListCell, IListFilter, IListRow, ListFilters} from '../../controls/table/table-models';
import {InvoiceWorkedDays} from '../invoice-list/InvoiceWorkedDays';
import {NotEmailedIcon, Icon} from '../../controls/Icon';
import {InvoiceListRowActions} from '../invoice-table/InvoiceListRowActions';
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
console.log("serach", filters, model)
    return searchinize(
      `${model.client.name} ${model.projectMonth?.consultantName ?? ''}`,
    ).includes(searchinize(filters.freeText));
}

export function createInvoiceList(config: InvoiceFeatureBuilderConfig): IFeature<InvoiceModel> {
  const includedFields = config.includedFields ?? [
    ...(config.isGroupedOnMonth ? ['date-month', 'number', 'client'] : ['number', 'client', 'date-full', 'period']),
    'total-amount',
    'buttons',
    'consultant',
    'orderNr',
    'invoice-days'
  ];
  const transPrefix = config.isQuotation ? 'quotation' : 'invoice';
  const listRows: IListRow<InvoiceModel> = {
    className: invoice => getInvoiceListRowClass(invoice, config.invoicePayDays),
    cells: getInvoiceColumns(includedFields, transPrefix),
  };

  return {
    key: Features.invoices,
    nav: m => `/invoices/${m === 'create' ? m : m.number}`,
    trans: features.invoice as any,
    list: {
      rows: listRows,
      data: config.data,
      sorter: (a, b) => b.number - a.number,
      filter: !config.disableFilters ? {
        fullTextSearch: searchInvoices,
        updateFilter: config.setFilters,
        state: config.filters,
      } : undefined
    },
  };
}


export function getInvoiceColumns(includeFields: string[], transPrefix: string): IListCell<InvoiceModel>[] {
  const isGroupedTable = includeFields.includes('date-month');
  const columns: IListCell<InvoiceModel>[] = [{
    key: 'date-month',
    header: `${transPrefix}.date`,
    value: (i: InvoiceModel) => i.date.format('MMM YYYY'),
    footer: (invoices: InvoiceModel[]) => <InvoiceAmountLabel invoices={invoices} isQuotation={invoices[0].isQuotation} />,
  }, {
    key: 'number',
    header: 'invoice.numberShort',
    value: (i: InvoiceModel) => <InvoiceNumberCell invoice={i} />,
    // eslint-disable-next-line max-len
    footer: (invoices: InvoiceModel[]) => !isGroupedTable && <InvoiceAmountLabel invoices={invoices} isQuotation={invoices[0].isQuotation} />,
  }, {
    key: 'client',
    header: 'invoice.client',
    value: (i: InvoiceModel) => <InvoiceClientCell client={i.client} />,
  }, {
    key: 'date-full',
    header: `${transPrefix}.date`,
    value: (i: InvoiceModel) => formatDate(i.date),
  }, {
    key: 'period',
    header: `${transPrefix}.period`,
    value: (i: InvoiceModel) => i.projectMonth?.month && moment(i.projectMonth.month).format('M/YY'),
  }, {
    key: 'consultant',
    header: `${transPrefix}.consultant`,
    value: (i: InvoiceModel) => <InvoiceConsultantCell invoice={i} />,
  }, {
    key: 'orderNr',
    header: `${transPrefix}.orderNrShort`,
    value: (i: InvoiceModel) => i.orderNr,
  }, {
    key: 'invoice-days',
    header: 'invoice.days',
    value: (invoice: InvoiceModel) => (
      <InvoiceWorkedDays
        invoices={[invoice]}
        display="invoice"
      />
    ),
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
    footer: invoices => <InvoicesTotal invoices={invoices} />,
  }, {
    key: 'buttons',
    header: '',
    style: {width: 240},
    className: 'icons-cell',
    value: (i: InvoiceModel) => <InvoiceListRowActions invoice={i} />,
  }];

  const result = columns.filter(col => includeFields.includes(col.key));
  // console.log('result, ', result);
  return result;
}
