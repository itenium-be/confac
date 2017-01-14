import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { t } from '../util.js';

import { AddIcon } from '../controls.js';
import { Grid, Table } from 'react-bootstrap';
import ClientListRow, { ClientListHeader/*, ClientListFooter*/ } from './ClientListRow.js';

class ClientList extends Component {
  static propTypes = {
    clients: PropTypes.array.isRequired,
  }

  //<ClientListFooter clients={clients} />

  render() {
    const clients = this.props.clients;
    return (
      <Grid>
        <AddIcon onClick="/client/create" label={t('client.createNew')} />
        <Table condensed style={{marginTop: 10}}>
          <ClientListHeader />
          <tbody>
            {clients.sort((a, b) => a.name - b.name).map(client => (
              <ClientListRow client={client} key={client._id} />
            ))}
          </tbody>

        </Table>
      </Grid>
    );
  }
}

export default connect(state => ({clients: state.clients}), {})(ClientList);
