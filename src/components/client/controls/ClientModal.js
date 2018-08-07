import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {t} from '../../util.js';

import * as Control from '../../controls.js';
import {Row, Form} from 'react-bootstrap';
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

  componentWillReceiveProps(nextProps) {
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
    this.props.saveClient(updatedClient, true);
    this.props.onConfirm(updatedClient);
    this.props.onClose();
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
        <Row>
          <Form>
            <Control.InputArray
              config={requiredClientProperties}
              model={client}
              onChange={value => this.setState({...client, ...value})}
              tPrefix="config.company."
            />
          </Form>
        </Row>
      </Control.Modal>
    );
  }
}

export const ClientModal = connect(state => ({config: state.config}), {saveClient})(ClientModalComponent);
