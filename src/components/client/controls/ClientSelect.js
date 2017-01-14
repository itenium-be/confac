import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { LabeledInput } from '../../controls.js';
import Select from 'react-select';

class ClientSelectComponent extends Component {
  static propTypes = {
    clients: PropTypes.array.isRequired,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
  }

  getClient(clientId) {
    return this.props.clients.find(c => c._id === clientId);
  }

  render() {
    const {value} = this.props;
    const selectedClientId = typeof value === 'object' ? value._id : value;
    const selectedClient = this.props.clients.find(c => c._id === selectedClientId);

    var clients = this.props.clients.filter(c => c.active);
    if (selectedClient && !selectedClient.active) {
      clients.push(selectedClient);
    }

    const Selecter = (
      <Select
        value={selectedClientId}
        options={clients.sort((a, b) => a.name.localeCompare(b.name)).map(item => ({value: item._id, label: item.name}))}
        onChange={item => this.props.onChange(this.getClient(item.value))}
        clearable={false}
      />
    );

    if (this.props.label) {
      return (
        <LabeledInput label={this.props.label}>
          {Selecter}
        </LabeledInput>
      );
    }
    return Selecter;
  }
}

export const ClientSelect = connect(state => ({clients: state.clients}))(ClientSelectComponent);