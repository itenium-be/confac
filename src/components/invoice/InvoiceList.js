import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import moment from 'moment';
import { t, moneyFormat } from '../util.js';

import { ConfirmationIcon, AddIcon, DeleteIcon } from '../controls.js';
import { Grid, Table } from 'react-bootstrap';
// import ClientDetails from '../client/ClientDetails.js';
// import CreateInvoiceLines from './CreateInvoiceLines.js';
// import InvoiceTotal from './InvoiceTotal.js';
//import { fetchInvoices } from '../../actions/index.js';

class InvoiceList extends Component {
  static propTypes = {
    //fetchInvoices: PropTypes.func.isRequired,
    invoices: PropTypes.array.isRequired,
  }
  // constructor(props) {
  //   super(props);
  // }
  // componentDidMount() {
  //   //this.props.fetchInvoices();
  // }

  // componentWillReceiveProps(nextProps) {
  //   if (!this.state.client && nextProps.config.defaultClient) {
  //     const client = this.props.clients.find(c => c._id === nextProps.config.defaultClient);
  //     this.selectClient(client);
  //   }
  //   this.setState({number: nextProps.config.nextInvoiceNumber});
  // }

  render() {
    return (
      <Grid>
        <AddIcon onClick="/invoice/create" label={t('nav.create')} />
        <Table condensed>
          <thead>
            <tr>
              <th>{t('invoice.numberShort')}</th>
              <th>{t('invoice.client')}</th>
              <th>{t('invoice.date')}</th>
              <th>{t('invoice.totalTitle')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.invoices.map(invoice => {
              // const confirmation = {
              //   title: t('invoice.deleteTitle'),
              //   body: t('invoice.deletePopup'),
              // };
              return (
                <tr key={invoice._id}>
                  <td>{invoice.number}</td>
                  <td>{invoice.client.name}</td>
                  <td>{invoice.date.format('YYYY-MM-DD')}</td>
                  <td style={{textAlign: 'right'}}>{moneyFormat(invoice.money.total)}</td>
                  <td>
                    <ConfirmationIcon
                      icon={DeleteIcon}
                      title={t('invoice.deleteTitle')}
                      onClick={() => this.props.deleteInvoice(invoice)}
                    >
                      {t('invoice.deletePopup', {number: invoice.number, client: invoice.client.name})}
                    </ConfirmationIcon>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Grid>
    );
  }
}

export default connect(state => ({invoices: state.invoices}), {})(InvoiceList);
