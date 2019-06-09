import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {moneyFormat, t} from '../util.js';
import cn from 'classnames';
import {ConfirmedDeleteIcon, EditIcon, InvoiceDownloadIcon, InvoicePreviewIcon, InvoiceVerifyIconToggle} from '../controls.js';
import {deleteInvoice} from '../../actions/index.js';
import {InvoiceWorkedDays} from './controls/InvoiceWorkedDays.js';
import {InvoicesTotal} from './controls/InvoiceTotal.js';
import {InvoiceAmountLabel} from './controls/InvoicesSummary.js';



export const InvoiceListHeader = ({columns}) => (
  <thead>
    <tr>
      {columns.map((col, i) => <th key={i}>{col.header}</th>)}
      <th>{t('invoice.days')}</th>
      <th width="10%">{t('invoice.totalTitle')}</th>
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


export const InvoiceListRow = connect(null, {deleteInvoice})(class extends Component {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
      header: PropTypes.string.isRequired,
      value: PropTypes.func.isRequired,
    }).isRequired).isRequired,
    invoice: PropTypes.object.isRequired,
    deleteInvoice: PropTypes.func.isRequired,
    isFirstRow: PropTypes.bool,
    onlyRowForMonth: PropTypes.bool,
  }

  render() {
    const {invoice, isFirstRow, onlyRowForMonth, columns} = this.props;
    const borderStyle = columns.some(col => col.groupedBy) ? {borderBottom: 0, borderTop: 0} : undefined;
    const tst = key => `list-${invoice._id}-${key}`;

    const invoiceType = invoice.isQuotation ? 'quotation' : 'invoice';

    return (
      <tr className={cn({warning: !invoice.verified && !invoice.isQuotation})} style={borderStyle}>
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
        <td style={{textAlign: 'right'}} data-tst={tst('money-total')}>
          {moneyFormat(invoice.money.total)}
        </td>
        <td className="icons-cell" width="240px">
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
