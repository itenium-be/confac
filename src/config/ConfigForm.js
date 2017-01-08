import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import t from '../trans.js';

import { ClientSelect } from '../controls/index.js';
import { Grid, Row, Col, Form, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { updateConfig } from '../actions/index.js';

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
    this.props.updateConfig(this.state);
  }

  render() {
    return (
      <Grid>
        <Form>
          <Row>
            <Col sm={6}>
              <FormGroup>
                <ControlLabel>{t('config.defaultClient')}</ControlLabel>
                <ClientSelect
                  value={this.state.defaultClient}
                  onChange={item => this.setState({defaultClient: item._id})}
                />
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup>
                <ControlLabel>{t('config.nextInvoiceNumber')}</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.nextInvoiceNumber}
                  placeholder={t('config.nextInvoiceNumber')}
                  onChange={e => this.setState({nextInvoiceNumber: parseInt(e.target.value, 10)})}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row style={{textAlign: 'center'}}>
            <Button bsSize="large" bsStyle="primary" onClick={this._save.bind(this)}>{t('save')}</Button>
          </Row>
        </Form>
      </Grid>
    );
  }
}

export default connect(state => ({config: state.config}), {updateConfig})(ConfigForm);
