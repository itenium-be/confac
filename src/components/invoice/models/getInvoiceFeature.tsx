import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {InvoiceClientCell} from '../invoice-table/InvoiceClientCell';
import {InvoiceNumberCell} from '../invoice-table/InvoiceNumberCell';
import InvoiceModel from './InvoiceModel';
import {formatDate, moneyFormat} from '../../utils';
import {IListCell, IListRow} from '../../controls/table/table-models';
import {InvoiceWorkedDays} from '../invoice-list/InvoiceWorkedDays';
import {NotEmailedIcon, Icon} from '../../controls/Icon';
import {InvoiceListRowActions} from '../invoice-table/InvoiceListRowActions';
import {getInvoiceListRowClass} from '../invoice-table/getInvoiceListRowClass';
import {InvoiceAmountLabel} from '../controls/InvoicesSummary';
import {InvoicesTotal} from '../invoice-edit/InvoiceTotal';
import {IFeature} from '../../controls/feature/feature-models';
import {features} from '../../../trans';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {ProjectMonthModal} from '../../project/controls/ProjectMonthModal';
import {ConfacState} from '../../../reducers/app-state';
import {projectMonthResolve} from '../../project/ProjectMonthsLists';


export interface IInvoiceListData {
  invoices: InvoiceModel[],
  consultants: ConsultantModel[]
}

export interface IInvoiceListConfig {
  data: InvoiceModel[];

  isGroupedOnMonth: boolean;
  showOrderNr: boolean;
  isQuotation: boolean;
  invoicePayDays: number;
}

const InvoiceConsultantCell = ({invoice}: {invoice: InvoiceModel}) => {
  const [modal, setModal] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);
  const {projectMonthId} = invoice;
  const fullProjectMonth = useSelector((state: ConfacState) => {
    if (!projectMonthId) {
      return null;
    }
    const projectMonth = state.projectsMonth.find(pm => pm._id === projectMonthId);
    if (!projectMonth) return null;

    return projectMonthResolve(projectMonth, state);
  });

  const consultants = useSelector((state: ConfacState) => state.consultants);
  const consultant = consultants.find(c => c._id === invoice.consultantId);

  if (!consultant) return null;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link to={fullProjectMonth ? `/projects/${fullProjectMonth.project._id}` : `/consultants/${consultant.slug}`}>
        {`${consultant.firstName} ${consultant.name}`}
      </Link>
      {fullProjectMonth && (
        <>
          <Icon
            style={{visibility: hover ? 'unset' : 'hidden', marginLeft: 8, color: 'grey'}}
            fa="fa fa-external-link-alt"
            size={1}
            onClick={() => setModal(true)}
          />
          {modal && (
            <ProjectMonthModal
              onClose={() => {
                setModal(false);
                setHover(false);
              }}
              projectMonth={fullProjectMonth}
            />
          )}
        </>
      )}
    </div>
  );
};


export function createInvoiceList(config: IInvoiceListConfig): IFeature<InvoiceModel> {
  const colsTillTotalAmount = config.isGroupedOnMonth ? ['date-month', 'number', 'client'] : ['number', 'client', 'date-full'];
  const transPrefix = config.isQuotation ? 'quotation' : 'invoice';
  const listRows: IListRow<InvoiceModel> = {
    className: invoice => getInvoiceListRowClass(invoice, config.invoicePayDays),
    cells: getInvoiceColumns([
      ...colsTillTotalAmount,
      'total-amount',
      'buttons',
      'consultant',
      config.showOrderNr ? '' : 'orderNr',
      'invoice-days',
    ], transPrefix),
  };

  return {
    key: 'invoices',
    nav: m => `/invoices/${m === 'create' ? m : m.number}`,
    trans: features.invoice as any,
    list: {
      rows: listRows,
      data: config.data,
      sorter: (a, b) => b.number - a.number,
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
        data-tst="invoice-days"
      />
    ),
    footer: invoices => <InvoiceWorkedDays invoices={invoices} />,
  }, {
    key: 'total-amount',
    header: {
      title: 'invoice.totalTitle',
      width: '10%',
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
