import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {t} from '../util.js';

import {AddIcon, Switch} from '../controls.js';
import {Grid, Table} from 'react-bootstrap';
import ClientListRow, {ClientListHeader} from './ClientListRow.js';

class ClientList extends Component {
  static propTypes = {
    clients: PropTypes.array.isRequired,
  }
  constructor() {
    super();
    this.state = {showDeleted: false};
  }

  render() {
    var clients = this.props.clients;
    if (!this.state.showDeleted) {
      clients = clients.filter(c => c.active);
    }
    return (
      <Grid>
        <AddIcon onClick="/client/create" label={t('client.createNew')} />

        <div className="pull-right" style={{width: 220}}>
          <Switch
            checked={this.state.showDeleted}
            onChange={checked => this.setState({showDeleted: checked})}
            label={t('client.showInactive')}
            onColor="#F2DEDE"
          />
        </div>

        <Table condensed style={{marginTop: 10}}>
          <ClientListHeader />
          <tbody>
            {clients.sort((a, b) => a.name.localeCompare(b.name)).map(client => (
              <ClientListRow client={client} key={client._id} />
            ))}
          </tbody>
        </Table>
      </Grid>
    );
  }
}

export default connect(state => ({clients: state.clients}), {})(ClientList);
