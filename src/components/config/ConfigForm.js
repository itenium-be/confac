import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { t } from '../util.js';

import { ClientSelect, NumericInput, BusyButton } from '../controls.js';
import { Grid, Row, Col, Form } from 'react-bootstrap';
import { updateConfig } from '../../actions/index.js';

class ConfigForm extends Component {
  static propTypes = {
    config: PropTypes.shape({
      nextInvoiceNumber: PropTypes.number,
      defaultClient: PropTypes.string,
      company: PropTypes.object,
    }).isRequired,
    updateConfig: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = JSON.parse(JSON.stringify(props.config));
  }
  componentWillReceiveProps(nextProps) {
    this.setState(JSON.parse(JSON.stringify(nextProps.config)));
  }

  _save() {
    console.log('save', this.state);
    return this.props.updateConfig(this.state);
  }

  render() {
    return (
      <Grid>
        <Form>
          <Row>
            <Col sm={6}>
              <ClientSelect
                label={t('config.defaultClient')}
                value={this.state.defaultClient}
                onChange={item => this.setState({defaultClient: item._id})}
              />
            </Col>
            <Col sm={6}>
              <NumericInput
                label={t('config.nextInvoiceNumber')}
                value={this.state.nextInvoiceNumber}
                onChange={value => this.setState({nextInvoiceNumber: value})}
              />
            </Col>
          </Row>
          <Row style={{textAlign: 'center'}}>
            <BusyButton onClick={this._save.bind(this)}>{t('save')}</BusyButton>
          </Row>
        </Form>
      </Grid>
    );
  }
}

export default connect(state => ({config: state.config}), {updateConfig})(ConfigForm);
