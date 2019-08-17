import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {t} from '../../util.js';
import * as Control from '../../controls.js';
import {Row, Form, Col} from 'react-bootstrap';
import {saveClient} from '../../../actions/appActions.js';
import {getNewClient, requiredClientProperties} from '../../client/EditClientViewModel.js';


class ClientModalComponent extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    saveClient: PropTypes.func.isRequired,
    client: PropTypes.object,
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func,
  }

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
    const onSuccess = this.props.onConfirm ? clientWithServerValues => this.props.onConfirm(clientWithServerValues) : null;
    this.props.saveClient(updatedClient, true, onSuccess);
  }

  render() {
    const client = this.state;
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
          <Row>
            <Control.InputArray
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
        </Form>
      </Control.Modal>
    );
  }
}

export const ClientModal = connect(state => ({config: state.config}), {saveClient})(ClientModalComponent);
