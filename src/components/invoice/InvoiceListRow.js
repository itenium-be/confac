import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { t, moneyFormat } from '../util.js';

import { ConfirmedDeleteIcon, EditIcon, AttachmentDownloadIcon, InvoiceVerifyIconToggle } from '../controls.js';
import { updateInvoice, deleteInvoice } from '../../actions/index.js';

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
        <td>{invoice.money.totalHours}</td>
        <td style={{textAlign: 'right'}}>{moneyFormat(invoice.money.total)}</td>
        <td className="icons-cell">
          <EditIcon onClick={'/invoice/' + invoice._id} />
          <InvoiceVerifyIconToggle
            invoice={invoice}
            title={t('invoice.verifyAction')}
          />
          <AttachmentDownloadIcon invoice={invoice} />
          <ConfirmedDeleteIcon
            title={t('invoice.deleteTitle')}
            onClick={() => this.props.deleteInvoice(invoice)}
          >
            {t('invoice.deletePopup', {number: invoice.number, client: invoice.client.name})}
          </ConfirmedDeleteIcon>
        </td>
      </tr>
    );
  }
}

export default connect(() => ({}), {updateInvoice, deleteInvoice})(InvoiceListRow);
