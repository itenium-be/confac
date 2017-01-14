import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {t, moneyFormat} from '../util.js';

import {ConfirmedDeleteIcon, EditIcon, AttachmentDownloadIcon, InvoiceVerifyIconToggle} from '../controls.js';
import {updateInvoice, deleteInvoice} from '../../actions/index.js';
import {InvoiceWorkedDays} from './controls/InvoiceWorkedDays.js';
import {InvoicesTotal} from './controls/InvoiceTotal.js';



export const InvoiceListHeader = () => (
  <thead>
    <tr>
      <th>{t('invoice.numberShort')}</th>
      <th>{t('invoice.client')}</th>
      <th>{t('invoice.date')}</th>
      <th>{t('invoice.hoursShort')}</th>
      <th>{t('invoice.days')}</th>
      <th width="10%">{t('invoice.totalTitle')}</th>
      <th>&nbsp;</th>
    </tr>
  </thead>
);


export const InvoiceListFooter = ({invoices}) => {
  if (invoices.length === 0) {
    return null;
  }

  const moneys = invoices.map(i => i.money);
  return (
    <tfoot>
      <tr>
        <td colSpan={3}>{invoices.length} {t('invoice.invoices').toLowerCase()}</td>
        <td>{moneys.map(i => i.totalValue).reduce((a, b) => a + b, 0)}</td>
        <td><InvoiceWorkedDays invoices={invoices} /></td>
        <td colSpan={2}><InvoicesTotal invoices={invoices} /></td>
      </tr>
    </tfoot>
  );
};




class InvoiceListRow extends Component {
  static propTypes = {
    invoice: PropTypes.object.isRequired,
    deleteInvoice: PropTypes.func.isRequired,
  }
  render() {
    const invoice = this.props.invoice;
    return (
      <tr className={invoice.verified ? undefined : 'warning'}>
        <td>{invoice.number}</td>
        <td>{invoice.client.name}</td>
        <td>{invoice.date.format('YYYY-MM-DD')}</td>
        <td>{invoice.money.totalValue}</td>
        <td style={{whiteSpace: 'nowrap'}}><InvoiceWorkedDays invoices={invoice} /></td>
        <td style={{textAlign: 'right'}}>{moneyFormat(invoice.money.total)}</td>
        <td className="icons-cell" width="240px">
          <EditIcon onClick={'/invoice/' + invoice.number} />
          <InvoiceVerifyIconToggle invoice={invoice}/>
          <AttachmentDownloadIcon invoice={invoice} />
          <ConfirmedDeleteIcon title={t('invoice.deleteTitle')} onClick={() => this.props.deleteInvoice(invoice)}>
            {t('invoice.deletePopup', {number: invoice.number, client: invoice.client.name})}
          </ConfirmedDeleteIcon>
        </td>
      </tr>
    );
  }
}

export default connect(() => ({}), {updateInvoice, deleteInvoice})(InvoiceListRow);
