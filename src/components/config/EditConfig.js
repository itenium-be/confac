import React, {Component, PropTypes } from 'react';
import {connect } from 'react-redux';
import {t } from '../util.js';

import {Grid, Row, Col, Form } from 'react-bootstrap';
import {EditCompany } from './EditCompany.js';
import {ClientSelect, BusyButton } from '../controls.js';
import {updateConfig } from '../../actions/index.js';

class EditConfig extends Component {
  static propTypes = {
    config: PropTypes.shape({
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
    console.log('save', this.state); // eslint-disable-line
    return this.props.updateConfig(this.state);
  }

  render() {
    return (
      <Grid>
        <Form>
          <Row>
            <h3>{t('config.title')}</h3>
            <Col sm={4}>
              <ClientSelect
                label={t('config.defaultClient')}
                value={this.state.defaultClient}
                onChange={item => this.setState({defaultClient: item._id})}
              />
            </Col>
          </Row>
          <EditCompany
            company={this.state.company}
            onChange={company => this.setState({company})}
          />

          <Row className="button-row">
            <BusyButton onClick={this._save.bind(this)}>{t('save')}</BusyButton>
          </Row>
        </Form>
      </Grid>
    );
  }
}

export default connect(state => ({config: state.config}), {updateConfig})(EditConfig);
