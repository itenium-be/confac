import React, {Component} from 'react';
import {connect} from 'react-redux';
import Select from 'react-select';
import {t} from '../../utils';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';
import {ConfacState} from '../../../reducers/app-state';
import {ClientModel} from '../models/ClientModels';
import {SelectItem} from '../../../models';


type ClientSelectProps = {
  clients: ClientModel[],
  /**
   * The client _id
   */
  value: string,
  onChange: (clientId: string, client: ClientModel) => void,
}

class ClientSelectComponent extends Component<ClientSelectProps> {
  getClient(clientId: string): ClientModel {
    return this.props.clients.find((c) => c._id === clientId) as ClientModel;
  }

  render() {
    const {value} = this.props;
    const selectedClientId = value && typeof value === 'object' ? value._id : value;
    const selectedClient = this.props.clients.find((c) => c._id === selectedClientId);

    const clients = this.props.clients.filter((c) => c.active);
    if (selectedClient && !selectedClient.active) {
      clients.push(selectedClient);
    }

    const options: SelectItem[] = clients.sort((a, b) => a.name.localeCompare(b.name)).map((item) => ({value: item._id, label: item.name}));
    const selectedOption = options.find((o) => o.value === selectedClientId);

    return (
      <Select
        value={selectedOption}
        options={options as any}
        onChange={((item: SelectItem) => this.props.onChange(item && item.value as string, item && this.getClient(item.value as string))) as any}
        isClearable
        placeholder={t('controls.selectPlaceholder')}
        className="tst-client-select"
      />
    );
  }
}

export const ClientSelect = EnhanceInputWithLabel(connect((state: ConfacState) => ({clients: state.clients}))(ClientSelectComponent));
