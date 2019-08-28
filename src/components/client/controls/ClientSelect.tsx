import React, {Component} from 'react';
import {connect} from 'react-redux';
import {t} from '../../util';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';
import Select from 'react-select';
import { ConfacState } from '../../../reducers/default-states';
import { EditClientModel } from '../ClientModels';


type ClientSelectProps = {
  clients: EditClientModel[],
  /**
   * The client or the _id
   */
  value: EditClientModel | string,
  onChange: Function,
}

class ClientSelectComponent extends Component<ClientSelectProps> {
  getClient(clientId: string): EditClientModel {
    return this.props.clients.find(c => c._id === clientId) as EditClientModel;
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

export const ClientSelect = EnhanceInputWithLabel(connect((state: ConfacState) => ({clients: state.clients}))(ClientSelectComponent));
