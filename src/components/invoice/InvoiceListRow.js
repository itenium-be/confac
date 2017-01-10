import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { t, moneyFormat } from '../util.js';

import { ConfirmedDeleteIcon, EditIcon } from '../controls.js';
import { deleteInvoice } from '../../actions/index.js';

class InvoiceListRow extends Component {
  static propTypes = {
    invoice: PropTypes.object.isRequired,
    deleteInvoice: PropTypes.func.isRequired,
  }
  render() {
    const invoice = this.props.invoice;
    return (
      <tr>
        <td>{invoice.number}</td>
        <td>{invoice.client.name}</td>
        <td>{invoice.date.format('YYYY-MM-DD')}</td>
        <td>{invoice.money.totalHours}</td>
        <td style={{textAlign: 'right'}}>{moneyFormat(invoice.money.total)}</td>
        <td className="icons-cell">
          <EditIcon onClick={'/invoice/' + invoice._id} />
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

export default connect(() => ({}), {deleteInvoice})(InvoiceListRow);
