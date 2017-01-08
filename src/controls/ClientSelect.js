import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

class ClientSelectComponent extends Component {
  static propTypes = {
    clients: PropTypes.array.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }

  getClient(clientId) {
    return this.props.clients.find(c => c._id === clientId);
  }

  render() {
    return (
      <Select
        value={this.props.value}
        options={this.props.clients.map(item => ({value: item._id, label: item.name}))}
        onChange={item => this.props.onChange(this.getClient(item.value))}
        clearable={false}
      />
    );
  }
}

export const ClientSelect = connect(state => ({clients: state.clients}))(ClientSelectComponent);
