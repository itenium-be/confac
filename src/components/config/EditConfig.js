import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {t} from '../util.js';

import {Grid, Row, Col, Form} from 'react-bootstrap';
import {EditCompany} from './EditCompany.js';
import {ClientSelect, BusyButton, StringInput, PropertiesSelect, ExtraFieldsInput} from '../controls.js';
import {updateConfig} from '../../actions/index.js';

class EditConfig extends Component {
  static propTypes = {
    config: PropTypes.shape({
      defaultTax: PropTypes.number,
      defaultClient: PropTypes.string,
      company: PropTypes.object,
      extraConfigFields: PropTypes.array.isRequired,
      defaultExtraClientFields: PropTypes.array.isRequired,
      defaultExtraClientInvoiceFields: PropTypes.array.isRequired,
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
            <Col sm={4}>
              <StringInput
                label={t('config.defaultTax')}
                value={this.state.defaultTax}
                onChange={value => this.setState({defaultTax: value})}
                suffix="%"
              />
            </Col>
            <Col sm={4}>
              <StringInput
                label={t('attachment.types')}
                placeholder={t('attachment.typesPlaceholder')}
                value={this.state.attachmentTypes.join(',')}
                onChange={value => this.setState({attachmentTypes: value.split(',')})}
              />
            </Col>
          </Row>
          <EditCompany
            company={this.state.company}
            onChange={company => this.setState({company})}
          />


          <Row>
            <h4>{t('config.extraFields.title')}</h4>
            <Col sm={4}>
              <PropertiesSelect
                label={t('config.extraFields.config')}
                values={this.state.extraConfigFields}
                onChange={value => this.setState({extraConfigFields: value})}
              />
            </Col>
            <Col sm={4}>
              <PropertiesSelect
                label={t('config.extraFields.client')}
                values={this.state.defaultExtraClientFields}
                onChange={value => this.setState({defaultExtraClientFields: value})}
              />
            </Col>
            <Col sm={4}>
              <PropertiesSelect
                label={t('config.extraFields.clientInvoice')}
                values={this.state.defaultExtraClientInvoiceFields}
                onChange={value => this.setState({defaultExtraClientInvoiceFields: value})}
              />
            </Col>
          </Row>
          <Row>
            <ExtraFieldsInput
              properties={this.state.extraConfigFields}
              onChange={value => this.setState({extraConfigFields: value})}
            />
          </Row>


          <Row className="button-row">
            <BusyButton onClick={this._save.bind(this)}>{t('save')}</BusyButton>
          </Row>
        </Form>
      </Grid>
    );
  }
}

export default connect(state => ({config: state.config}), {updateConfig})(EditConfig);
