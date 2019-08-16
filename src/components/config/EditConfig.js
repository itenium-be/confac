import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {t} from '../util.js';
import {Grid, Row, Col, Form} from 'react-bootstrap';
import {EditCompany} from './EditCompany.js';
import * as Control from '../controls.js';
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
      defaultInvoiceDateStrategy: PropTypes.string,
    }).isRequired,
    updateConfig: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = JSON.parse(JSON.stringify(props.config));
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(JSON.parse(JSON.stringify(nextProps.config)));
  }

  _save() {
    console.log('save', this.state); // eslint-disable-line
    return this.props.updateConfig(this.state);
  }

  render() {
    return (
      <Grid className="edit-container">
        <Form>
          <EditCompany
            company={this.state.company}
            onChange={company => this.setState({company})}
          />


          <EditConfigInvoice
            config={this.state}
            onChange={this.setState.bind(this)}
          />


          <EditConfigUserSettings
            config={this.state}
            onChange={this.setState.bind(this)}
          />


          <EditConfigExtraFields
            config={this.state}
            onChange={this.setState.bind(this)}
          />



          <Row className="button-row">
            <Control.BusyButton onClick={this._save.bind(this)} data-tst="save">{t('save')}</Control.BusyButton>
          </Row>
        </Form>
      </Grid>
    );
  }
}

export default connect(state => ({config: state.config}), {updateConfig})(EditConfig);




const EditConfigUserSettings = ({config, onChange}) => (
  <Row>
    <h1>{t('config.settingsTitle')}</h1>
    <Col sm={4}>
      <Control.Switch
        label={t('config.showOrderNr')}
        checked={config.showOrderNr}
        onChange={checked => onChange({showOrderNr: checked})}
        data-tst="config.showOrderNr"
      />
    </Col>

    <Col sm={4}>
      <Control.Switch
        label={t('config.groupByMonth')}
        checked={config.groupInvoiceListByMonth}
        onChange={checked => onChange({groupInvoiceListByMonth: checked})}
        data-tst="config.groupByMonth"
      />
    </Col>
  </Row>
);



const EditConfigInvoice = ({config, onChange}) => (
  <Row>
    <h1>{t('config.invoiceTitle')}</h1>
    <Col sm={4}>
      <Control.ClientSelect
        label={t('config.defaultClient')}
        value={config.defaultClient}
        onChange={item => onChange({defaultClient: item._id})}
        data-tst="config.defaultClient"
      />
    </Col>

    <Col sm={4}>
      <Control.StringInput
        label={t('config.defaultTax')}
        value={config.defaultTax}
        onChange={value => onChange({defaultTax: value})}
        suffix="%"
        data-tst="config.defaultTax"
      />
    </Col>

    <Col sm={4}>
      <Control.StringsSelect
        label={t('attachment.types')}
        values={config.attachmentTypes}
        onChange={values => onChange({attachmentTypes: values})}
        data-tst="config.attachmentTypes"
      />
    </Col>

    <Col sm={4}>
      <Control.InvoiceLineTypeSelect
        label={t('config.defaultInvoiceLineType')}
        type={config.defaultInvoiceLineType}
        onChange={value => onChange({defaultInvoiceLineType: value})}
        data-tst="config.defaultInvoiceLineType"
      />
    </Col>

    <Col sm={4}>
      <Control.InvoiceDateStrategySelect
        label={t('config.defaultInvoiceDateStrategy')}
        value={config.defaultInvoiceDateStrategy}
        data-tst="config.defaultInvoiceDateStrategy"
        onChange={value => onChange({defaultInvoiceDateStrategy: value})}
      />
    </Col>
  </Row>
);






const EditConfigExtraFields = ({config, onChange}) => (
  <div>
    <Row>
      <h1>{t('config.extraFields.title')}</h1>
      <Col sm={4}>
        <Control.PropertiesSelect
          label={t('config.extraFields.config')}
          values={config.extraConfigFields}
          onChange={value => onChange({extraConfigFields: value})}
          data-tst="config.extraFields.title"
        />
      </Col>
      <Col sm={4}>
        <Control.PropertiesSelect
          label={t('config.extraFields.client')}
          values={config.defaultExtraClientFields}
          onChange={value => onChange({defaultExtraClientFields: value})}
          data-tst="config.extraFields.client"
        />
      </Col>
      <Col sm={4}>
        <Control.PropertiesSelect
          label={t('config.extraFields.clientInvoice')}
          values={config.defaultExtraClientInvoiceFields}
          onChange={value => onChange({defaultExtraClientInvoiceFields: value})}
          data-tst="config.extraFields.clientInvoice"
        />
      </Col>
    </Row>
    <Row>
      <Control.ExtraFieldsInput
        properties={config.extraConfigFields}
        onChange={value => onChange({extraConfigFields: value})}
        data-tst="config.extraConfigFields"
      />
    </Row>
  </div>
);
