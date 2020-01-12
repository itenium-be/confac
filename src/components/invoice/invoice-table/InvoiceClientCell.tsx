import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import t from '../../../trans';
import {ClientEditIcon} from '../../controls';
import {ClientModal} from '../../client/controls/ClientModal';
import {saveClient} from '../../../actions/index';
import {ConfacState} from '../../../reducers/app-state';
import {ClientModel} from '../../client/models/ClientModels';


type InvoiceClientCellProps = {
  clients: ClientModel[],
  client: ClientModel,
  saveClient: any,
}

type InvoiceClientCellState = {
  hover: boolean,
  modal: boolean,
}

export const InvoiceClientCell = connect((state: ConfacState) => ({
  clients: state.clients,
}), {saveClient})(
  class extends Component<InvoiceClientCellProps, InvoiceClientCellState> {
    constructor(props) {
      super(props);
      this.state = {
        hover: false,
        modal: false,
      };
    }

    render() {
      const invoiceClient = this.props.client;
      const client = this.props.clients.find((c) => c._id === invoiceClient._id);
      if (!client) {
        return <span>{invoiceClient.name}</span>;
      }
      return (
        <div
          onMouseEnter={() => this.setState({hover: true})}
          onMouseLeave={() => this.setState({hover: false})}
        >
          <Link to={`/clients/${client.slug}`} className="invoice-list-client">
            {client.name}
          </Link>

          <ClientEditIcon
            title={t('invoice.clientEditModal')}
            size={1}
            style={{marginLeft: 8, color: 'grey', visibility: this.state.hover ? 'unset' : 'hidden'}}
            client={client}
            onClick={() => this.setState({modal: true})}
            data-tst="edit"
            fa="fa fa-external-link-alt"
          />

          {this.state.modal && (
          <ClientModal
            client={client}
            show={this.state.modal}
            onClose={() => this.setState({modal: false, hover: false})}
          />
          )}
        </div>
      );
    }
  },
);
