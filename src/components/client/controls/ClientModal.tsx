import React, {Component} from 'react';
import {connect} from 'react-redux';
import {t} from '../../util';
import * as Control from '../../controls';
import {Container, Row, Form, Col} from 'react-bootstrap';
import {saveClient} from '../../../actions/appActions';
import {getNewClient, requiredClientProperties} from '../models/EditClientModel';
import { EditClientModel } from '../models/ClientModels';
import { EditConfigModel } from '../../config/EditConfigModel';
import { ConfacState } from '../../../reducers/default-states';


type ClientModalProps = {
  config: EditConfigModel,
  saveClient: Function,
  client: EditClientModel | null,
  show: boolean,
  onClose: any,
  onConfirm?: Function,
}


class ClientModalComponent extends Component<ClientModalProps, ClientModalProps> {
  constructor(props) {
    super(props);
    this.state = this.copyClient(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.client !== this.props.client) {
      this.setState({...this.copyClient(nextProps)});
    }
  }

  copyClient(props) {
    if (props.client) {
      return JSON.parse(JSON.stringify(props.client));
    }
    return getNewClient(props.config);
  }

  onSave() {
    const updatedClient = this.state;
    const onSuccess = this.props.onConfirm ? (clientWithServerValues: EditClientModel) => (this.props.onConfirm && this.props.onConfirm(clientWithServerValues)) : null;
    this.props.saveClient(updatedClient, true, onSuccess);
  }

  render() {
    const client: any = this.state;
    if (!client) {
      return null;
    }

    return (
      <Control.Modal
        show={this.props.show}
        onClose={this.props.onClose}
        title={client._id ? client.name : t('client.createNew')}
        onConfirm={this.onSave.bind(this)}
      >
        <Form>
          <Container>
            <Row>
              <Control.ArrayInput
                config={requiredClientProperties}
                model={client}
                onChange={value => this.setState({...client, ...value})}
                tPrefix="config.company."
              />

              <Col sm={12}>
                <Control.TextareaInput
                  label={t('notes')}
                  placeholder={t('notes')}
                  value={client.notes}
                  onChange={value => this.setState({...client, notes: value})}
                  style={{height: 120}}
                />
              </Col>
            </Row>
          </Container>
        </Form>
      </Control.Modal>
    );
  }
}

export const ClientModal = connect((state: ConfacState) => ({config: state.config}), {saveClient})(ClientModalComponent);
