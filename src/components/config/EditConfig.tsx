import React, {Component} from 'react';
import {connect} from 'react-redux';
import {t} from '../util';
import {Container, Row, Col, Form} from 'react-bootstrap';
import {EditCompany} from './EditCompany';
import * as Control from '../controls';
import {updateConfig} from '../../actions/index';
import { EditConfigModel } from './EditConfigModel';
import { ConfacState } from '../../reducers/default-states';


type EditConfigProps = {
  config: EditConfigModel,
  updateConfig: Function,
}

type EditConfigState = EditConfigModel;

class EditConfig extends Component<EditConfigProps, EditConfigState> {
  constructor(props: EditConfigProps) {
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
      <Container className="edit-container">
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
            <Col>
              <Control.BusyButton onClick={this._save.bind(this)} data-tst="save">{t('save')}</Control.BusyButton>
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }
}

export default connect((state: ConfacState) => ({config: state.config}), {updateConfig})(EditConfig);




const EditConfigUserSettings = ({config, onChange}) => (
  <Row>
    <h1>{t('config.settingsTitle')}</h1>
    <Col sm={4}>
      <Control.Switch
        label={t('config.showOrderNr')}
        checked={config.showOrderNr}
        onChange={(checked: boolean) => onChange({showOrderNr: checked})}
        data-tst="config.showOrderNr"
      />
    </Col>

    <Col sm={4}>
      <Control.Switch
        label={t('config.groupByMonth')}
        checked={config.groupInvoiceListByMonth}
        onChange={(checked: boolean) => onChange({groupInvoiceListByMonth: checked})}
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
        onChange={item => onChange({defaultClient: item ? item._id : null})}
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
