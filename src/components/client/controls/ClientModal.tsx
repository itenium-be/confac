import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Row, Form} from 'react-bootstrap';
import {t} from '../../utils';
import {saveClient} from '../../../actions/clientActions';
import {requiredClientProperties} from '../models/ClientConfig';
import {getNewClient} from '../models/getNewClient';
import {ClientModel} from '../models/ClientModels';
import {ConfigModel} from '../../config/models/ConfigModel';
import {ConfacState} from '../../../reducers/app-state';
import {btwResponseToModel} from '../NewClient';
import {BtwInput, BtwResponse} from '../../controls/form-controls/inputs/BtwInput';
import {ArrayInput} from '../../controls/form-controls/inputs/ArrayInput';
import {BaseModalProps, Modal} from '../../controls/Modal';


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

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: ClientModalProps) {
    if (nextProps.client !== this.props.client) {
      this.setState({...this.copyClient(nextProps)});
    }
  }

  onSave(): void {
    const updatedClient = this.state;
    const {onConfirm} = this.props;
    const onSuccess = onConfirm ? (clientWithServerValues: ClientModel) => (onConfirm && onConfirm(clientWithServerValues)) : null;
    this.props.saveClient(updatedClient, true, onSuccess);
  }

  copyClient(props: ClientModalProps): ClientModel {
    if (props.client) {
      return JSON.parse(JSON.stringify(props.client));
    }
    return getNewClient(props.config);
  }

  render() {
    const client: ClientModel = this.state as ClientModel;
    if (!client) {
      return null;
    }

    const NewClientForm = !client._id && !client.btw && (
      <BtwInput
        value={client.btw}
        onChange={(val: string) => { }}
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
      <Modal
        show={this.props.show}
        onClose={this.props.onClose}
        title={client._id ? client.name : t('client.createNew')}
        onConfirm={() => this.onSave()}
      >
        {NewClientForm || (
          <Form>
            <Container>
              <Row>
                <ArrayInput
                  config={requiredClientProperties}
                  model={client}
                  onChange={value => this.setState({...client, ...value})}
                  tPrefix="config.company."
                />
              </Row>
            </Container>
          </Form>
        )}
      </Modal>
    );
  }
}

export const ClientModal = connect((state: ConfacState) => ({config: state.config}), {saveClient})(ClientModalComponent);
