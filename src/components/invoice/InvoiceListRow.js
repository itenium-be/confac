import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {t, moneyFormat} from '../util.js';

import {ConfirmedDeleteIcon, EditIcon, InvoiceDownloadIcon, InvoiceVerifyIconToggle} from '../controls.js';
import {deleteInvoice} from '../../actions/index.js';
import {InvoiceWorkedDays} from './controls/InvoiceWorkedDays.js';
import {InvoicesTotal} from './controls/InvoiceTotal.js';


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


export const InvoiceListFooter = ({columns, invoices}) => {
  if (invoices.length === 0) {
    return null;
  }

  return (
    <tfoot>
      <tr>
        <td colSpan={columns.length}>{invoices.length} {t('invoice.invoices').toLowerCase()}</td>
        <td><InvoiceWorkedDays invoices={invoices} /></td>
        <td colSpan={2}><InvoicesTotal invoices={invoices} /></td>
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
    return (
      <tr className={invoice.verified ? undefined : 'warning'} style={borderStyle}>
        {columns.map((col, i) => {
          const hideValue = !isFirstRow && col.groupedBy;
          return (
            <td key={i} style={col.groupedBy ? borderStyle : undefined}>
              {hideValue ? null : col.value(invoice)}
            </td>
          );
        })}
        <td style={{whiteSpace: 'nowrap'}}><InvoiceWorkedDays invoices={[invoice]} display={onlyRowForMonth ? undefined : 'invoice'} /></td>
        <td style={{textAlign: 'right'}}>{moneyFormat(invoice.money.total)}</td>
        <td className="icons-cell" width="240px">
          <EditIcon onClick={'/invoice/' + invoice.number} />
          <InvoiceVerifyIconToggle invoice={invoice}/>
          <InvoiceDownloadIcon invoice={invoice} />
          <ConfirmedDeleteIcon title={t('invoice.deleteTitle')} onClick={() => this.props.deleteInvoice(invoice)}>
            {t('invoice.deletePopup', {number: invoice.number, client: invoice.client.name})}
          </ConfirmedDeleteIcon>
        </td>
      </tr>
    );
  }
});
