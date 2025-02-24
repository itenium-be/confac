import {Component, useState} from 'react';
import {connect} from 'react-redux';
import {Container, Row, Form, Col} from 'react-bootstrap';
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
  title?: string,
  saveClient: Function,
  onConfirm?: (client: ClientModel) => void,
  client: ClientModel | null,
}

type ClientModalState = {
  client: ClientModel,
  btwResponse: ClientModel | null,
};


class ClientModalComponent extends Component<ClientModalProps, ClientModalState> {
  constructor(props: ClientModalProps) {
    super(props);
    this.state = {
      client: this.copyClient(props),
      btwResponse: null,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: ClientModalProps) {
    if (nextProps.client !== this.props.client) {
      this.setState({client: {...this.copyClient(nextProps)}});
    }
  }

  onSave(): void {
    const updatedClient = this.state.client;
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
    const client: ClientModel = this.state.client as ClientModel;
    if (!client) {
      return null;
    }

    const NewClientForm = !client._id && !client.btw && (
      <>
        <BtwInputComponent
          defaultBtw={client.btw}
          onFinalize={(btw: string, btwResp?: BtwResponse) => {
            if (btwResp && btwResp.valid) {
              this.setState({client: btwResponseToModel(btwResp)});
            } else {
              this.setState({client: {...client, btw: btw || ' '}});
            }
          }}
          onBtwChange={(btw: BtwResponse) => this.setState({btwResponse: btwResponseToModel(btw)})}
        />
        {this.state.btwResponse && (
          <Row style={{marginTop: 25}}>
            <Col>
              <h3>{this.state.btwResponse.name}</h3>
              <div>{this.state.btwResponse.address}</div>
              <div>{this.state.btwResponse.city}</div>
            </Col>
          </Row>
        )}
      </>
    );

    const modalTitle = this.props.title ?? t('client.createNewModal.client')
    return (
      <Modal
        show={this.props.show}
        onClose={this.props.onClose}
        title={client._id ? client.name : modalTitle}
        onConfirm={() => this.onSave()}
        dialogClassName="client-modal"
      >
        {NewClientForm || (
          <Form>
            <Container>
              <Row>
                <ArrayInput
                  config={requiredClientProperties}
                  model={client}
                  onChange={value => this.setState({client: {...client, ...value}})}
                  tPrefix="client."
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




type BtwInputComponentProps = {
  defaultBtw: string;
  onFinalize: (btw: string, btwResp?: BtwResponse) => void;
  onBtwChange?: (btw: BtwResponse) => void;
}


/** Small BtwInput wrapper that keeps its own btw: string state */
const BtwInputComponent = ({defaultBtw, onFinalize, onBtwChange}: BtwInputComponentProps) => {
  const [btw, setBtw] = useState<string>(defaultBtw);

  return (
    <BtwInput
      value={btw}
      onChange={(val: string) => setBtw(val)}
      onFinalize={onFinalize}
      onBtwChange={onBtwChange}
    />
  );
};
