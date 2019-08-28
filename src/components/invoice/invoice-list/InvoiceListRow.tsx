import React, {Component} from 'react';
import {connect} from 'react-redux';
import {moneyFormat, t} from '../../util';
import cn from 'classnames';
import {ConfirmedDeleteIcon, EditIcon, InvoiceDownloadIcon, InvoicePreviewIcon, InvoiceVerifyIconToggle} from '../../controls';
import {deleteInvoice} from '../../../actions/index';
import {InvoiceWorkedDays} from './InvoiceWorkedDays';
import {InvoicesTotal} from '../invoice-edit/InvoiceTotal';
import {InvoiceAmountLabel} from '../controls/InvoicesSummary';
import EditInvoiceModel from '../models/EditInvoiceModel';



export const InvoiceListHeader = ({columns}) => (
  <thead>
    <tr>
      {columns.map((col, i) => <th key={i}>{col.header}</th>)}
      <th>{t('invoice.days')}</th>
      <th style={{width: '10%'}}>{t('invoice.totalTitle')}</th>
      <th>&nbsp;</th>
    </tr>
  </thead>
);


export const InvoiceListFooter = ({columns, invoices, isQuotation}) => {
  if (invoices.length === 0) {
    return null;
  }

  return (
    <tfoot>
      <tr>
        <td colSpan={columns.length}><InvoiceAmountLabel invoices={invoices} isQuotation={isQuotation} data-tst="list-total-invoices" /></td>
        <td><InvoiceWorkedDays invoices={invoices} data-tst="list-total-days" /></td>
        <td colSpan={2}><InvoicesTotal invoices={invoices} data-tst="list-total-money" /></td>
      </tr>
    </tfoot>
  );
};

type InvoiceListRowProps = {
  columns: Array<{
    header: string,
    value: Function,
    groupedBy?: boolean,
  }>,
  invoice: EditInvoiceModel,
  isFirstRow?: boolean
  onlyRowForMonth?: boolean,
}


export const InvoiceListRow = connect(null, {deleteInvoice})(class extends Component<InvoiceListRowProps & {deleteInvoice: any}> {
  render() {
    const {invoice, isFirstRow, onlyRowForMonth, columns} = this.props;
    const borderStyle = columns.some(col => col.groupedBy) ? {borderBottom: 0, borderTop: 0} : undefined;
    const tst = (key: string): string => `list-${invoice._id}-${key}`;

    const invoiceType = invoice.isQuotation ? 'quotation' : 'invoice';

    return (
      <tr className={cn({'table-warning': !invoice.verified && !invoice.isQuotation})} style={borderStyle}>
        {columns.map((col, i) => {
          const hideValue = !isFirstRow && col.groupedBy;
          return (
            <td key={i} style={col.groupedBy ? borderStyle : undefined} data-tst={tst(col.header)}>
              {hideValue ? null : col.value(invoice)}
            </td>
          );
        })}
        <td style={{whiteSpace: 'nowrap'}}>
          <InvoiceWorkedDays invoices={[invoice]} display={onlyRowForMonth ? undefined : 'invoice'} data-tst={tst('days')} />
        </td>
        <td style={{textAlign: 'right', whiteSpace: 'nowrap'}} data-tst={tst('money-total')}>
          {moneyFormat(invoice.money.total)}
        </td>
        <td className="icons-cell" style={{width: 240}}>
          <EditIcon onClick={`/${invoiceType}/${invoice.number}`} data-tst={tst('edit')} style={{marginRight: invoice.isQuotation ? undefined : -15}} />
          <InvoiceVerifyIconToggle invoice={invoice} data-tst={tst('verify')} />
          <InvoiceDownloadIcon invoice={invoice} data-tst={tst('download')} />
          <InvoicePreviewIcon invoice={invoice} data-tst={tst('preview')} />
          <ConfirmedDeleteIcon title={t(invoiceType + '.deleteTitle')} onClick={() => this.props.deleteInvoice(invoice)} data-tst={tst('delete')}>
            {t(invoiceType + '.deletePopup', {number: invoice.number, client: invoice.client.name})}
          </ConfirmedDeleteIcon>
        </td>
      </tr>
    );
  }
});
