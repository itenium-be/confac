import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {t} from '../../util';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';
import Select from 'react-select';

class ClientSelectComponent extends Component {
  static propTypes = {
    clients: PropTypes.array.isRequired,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    onChange: PropTypes.func.isRequired,
  }

  getClient(clientId) {
    return this.props.clients.find(c => c._id === clientId);
  }

  render() {
    const {value} = this.props;
    const selectedClientId = value && typeof value === 'object' ? value._id : value;
    const selectedClient = this.props.clients.find(c => c._id === selectedClientId);

    var clients = this.props.clients.filter(c => c.active);
    if (selectedClient && !selectedClient.active) {
      clients.push(selectedClient);
    }

    const options = clients.sort((a, b) => a.name.localeCompare(b.name)).map(item => ({value: item._id, label: item.name}));
    const selectedOption = options.find(o => o.value === selectedClientId);

    return (
      <Select
        value={selectedOption}
        options={options}
        onChange={item => this.props.onChange(item ? this.getClient(item.value) : null)}
        isClearable={true}
        placeholder={t('controls.selectPlaceholder')}
        className="tst-client-select"
      />
    );
  }
}

export const ClientSelect = EnhanceInputWithLabel(connect(state => ({clients: state.clients}))(ClientSelectComponent));
