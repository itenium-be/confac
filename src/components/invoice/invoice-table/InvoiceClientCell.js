import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import t from '../../../trans.js';
import {ClientEditIcon} from '../../controls';
import {ClientModal} from '../../client/controls/ClientModal';
import {saveClient} from '../../../actions/index.js';


export const InvoiceClientCell = connect(state => ({
  clients: state.clients,
}), {saveClient})(
class extends Component {
  static propTypes = {
    clients: PropTypes.array.isRequired,
    client: PropTypes.object.isRequired,
    saveClient: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      modal: false,
    };
  }

  render() {
    const invoiceClient = this.props.client;
    const client = this.props.clients.find(c => c._id === invoiceClient._id);
    return (
      <div
        onMouseEnter={() => this.setState({hover: true})}
        onMouseLeave={() => this.setState({hover: false})}
      >
        <Link to={'/client/' + client.slug} className="invoice-list-client">
          {client.name}
        </Link>

        <ClientEditIcon
          title={t('invoice.clientEditModal')}
          size={1}
          style={{marginLeft: 8, color: 'grey', visibility: this.state.hover ? 'unset' : 'hidden'}}
          client={client}
          onClick={() => this.setState({modal: true})}
          data-tst="edit"
          fa="fa fa-external-link"
        />

        {this.state.modal && <ClientModal
          client={client}
          show={this.state.modal}
          onClose={() => this.setState({modal: false, hover: false})}
        />}
      </div>
    );
  }
});
