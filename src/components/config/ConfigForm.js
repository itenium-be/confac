import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { t } from '../util.js';

import { ClientSelect, StringInput, BusyButton } from '../controls.js';
import { Grid, Row, Col, Form } from 'react-bootstrap';
import { updateConfig } from '../../actions/index.js';

class ConfigForm extends Component {
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
    console.log('save', this.state);
    return this.props.updateConfig(this.state);
  }

  render() {
    return (
      <Grid>
        <Form>
          <h3>{t('config.title')}</h3>
          <Row>
            <Col sm={4}>
              <ClientSelect
                label={t('config.defaultClient')}
                value={this.state.defaultClient}
                onChange={item => this.setState({defaultClient: item._id})}
              />
            </Col>
          </Row>
          <CompanyForm
            company={this.state.company}
            onChange={company => this.setState({company})}
          />

          <Row style={{textAlign: 'center'}}>
            <BusyButton onClick={this._save.bind(this)}>{t('save')}</BusyButton>
          </Row>
        </Form>
      </Grid>
    );
  }
}

const tc = key => t('config.company.' + key);

const CompanyForm = ({company, onChange}) => {
  if (!company) {
    return null;
  }

  var keys = ['name', 'address', 'city', 'telephone', 'email', 'btw', 'iban', 'bic', 'template'];
  keys = keys.concat(Object.keys(company).filter(k => !keys.includes(k)));

  return (
    <Row>
      <h4>{tc('title')}</h4>
      {keys.map(key => (
        <Col sm={4} key={key}>
          <StringInput
            label={tc(key)}
            value={company[key]}
            onChange={value => onChange({...company, [key]: value})}
          />
        </Col>
      ))}
    </Row>
  );
};


export default connect(state => ({config: state.config}), {updateConfig})(ConfigForm);
