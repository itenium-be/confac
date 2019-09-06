import React, {Component} from 'react';
import {connect} from 'react-redux';
import {t} from '../../util';
import * as Control from '../../controls';
import {Container, Row, Form} from 'react-bootstrap';
import { saveClient } from "../../../actions/clientActions";
import {requiredClientProperties} from '../models/ClientConfig';
import { getNewClient } from "../models/getNewClient";
import { ClientModel } from '../models/ClientModels';
import { ConfigModel } from '../../config/models/ConfigModel';
import { ConfacState } from '../../../reducers/default-states';
import { btwResponseToModel } from '../NewClient';
import { BtwInput, BtwResponse } from '../../controls/form-controls/inputs/BtwInput';
import { BaseModalProps } from '../../controls';


type ClientModalProps = BaseModalProps & {
  config: ConfigModel,
  saveClient: Function,
  onConfirm?: (client: ClientModel) => void,
  client: ClientModel | null,
}

type ClientModalState = {

}


class ClientModalComponent extends Component<ClientModalProps, ClientModalState> {
  constructor(props: ClientModalProps) {
    super(props);
    this.state = this.copyClient(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps: ClientModalProps) {
    if (nextProps.client !== this.props.client) {
      this.setState({...this.copyClient(nextProps)});
    }
  }

  copyClient(props: ClientModalProps): ClientModel {
    if (props.client) {
      return JSON.parse(JSON.stringify(props.client));
    }
    return getNewClient(props.config);
  }

  onSave(): void {
    const updatedClient = this.state;
    const onSuccess = this.props.onConfirm ? (clientWithServerValues: ClientModel) => (this.props.onConfirm && this.props.onConfirm(clientWithServerValues)) : null;
    this.props.saveClient(updatedClient, true, onSuccess);
  }

  render() {
    const client: ClientModel = this.state as ClientModel;
    if (!client) {
      return null;
    }

    const NewClientForm = !client._id && !client.btw && (
      <BtwInput
        value={client.btw}
        onChange={(val: string) => {}}
        onFinalize={(btw: string, btwResp?: BtwResponse) => {
          if (btwResp && btwResp.valid) {
            this.setState(btwResponseToModel(btwResp));
          } else {
            this.setState({btw: btw || ' '} as ClientModel);
          }
        }}
      />
    );

    return (
      <Control.Modal
        show={this.props.show}
        onClose={this.props.onClose}
        title={client._id ? client.name : t('client.createNew')}
        onConfirm={this.onSave.bind(this)}
      >
        {NewClientForm || (
          <Form>
            <Container>
              <Row>
                <Control.ArrayInput
                  config={requiredClientProperties}
                  model={client}
                  onChange={value => this.setState({...client, ...value})}
                  tPrefix="config.company."
                />
              </Row>
            </Container>
          </Form>
        )}
      </Control.Modal>
    );
  }
}

export const ClientModal = connect((state: ConfacState) => ({config: state.config}), {saveClient})(ClientModalComponent);
