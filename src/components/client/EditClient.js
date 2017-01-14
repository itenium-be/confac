import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { t } from '../util.js';

import { BusyButton, NumericInput, StringInput, StringInputArray } from '../controls.js';
import { Grid, Row, Col, Form } from 'react-bootstrap';
import { saveClient } from '../../actions/index.js';

class EditClient extends Component {
  static propTypes = {
    clients: PropTypes.array.isRequired,
    isLoaded: PropTypes.bool,
    saveClient: PropTypes.func.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string
    }),
  }
  constructor(props) {
    super(props);
    this.state = this.copyClient(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoaded !== this.props.isLoaded
      || nextProps.params.id !== this.props.params.id
      || nextProps.clients !== this.props.clients) {

      this.setState({...this.copyClient(nextProps)});
    }
  }

  copyClient(props) {
    if (props.params.id) {
      // Existing client
      const client = props.clients.find(c => c._id === props.params.id);
      if (client) {
        return JSON.parse(JSON.stringify(client));
      }
      return null;
    }

    // New client
    return {rate: {}};
  }

  _onSave() {
    this.props.saveClient(this.state);
  }

  render() {
    const client = this.state;
    if (!client) {
      return <div />;
    }

    return (
      <Grid>
        <Form>
          <Row>
            <StringInputArray
              keys={['name', 'address', 'city', 'btw', 'telephone']}
              model={client}
              tPrefix="config.company."
            />
          </Row>
          <Row>
            <Col sm={4}>
              <StringInput
                label={t('invoice.fileName')}
                value={client.invoiceFileName}
                onChange={value => this.setState({...client, invoiceFileName: value})}
              />
            </Col>
          </Row>

          <Row className="button-row">
            <BusyButton onClick={this._onSave.bind(this)}>{t('save')}</BusyButton>
          </Row>
        </Form>
      </Grid>
    );
  }
}

export default connect(state => ({
  clients: state.clients,
  isLoaded: state.app.isLoaded,
}), {saveClient})(EditClient);
