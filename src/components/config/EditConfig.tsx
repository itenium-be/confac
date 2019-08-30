import React, {Component} from 'react';
import {connect} from 'react-redux';
import {t} from '../util';
import {Container, Row, Col, Form} from 'react-bootstrap';
import {configDefinition, configSettingsDefinition, configInvoiceDefinition} from './models/ConfigConfig';
import * as Control from '../controls';
import {updateConfig} from '../../actions/index';
import { EditConfigModel, EditConfigCompanyModel } from './models/ConfigModel';
import { ConfacState } from '../../reducers/default-states';
import { EditConfigExtraFields } from './EditConfigExtraFields';
import { ArrayInput } from '../controls';
import { StickyFooter } from '../controls/skeleton/StickyFooter';


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

  _save(): void {
    console.log('save', this.state); // eslint-disable-line
    return this.props.updateConfig(this.state);
  }

  render() {
    return (
      <Container className="edit-container">
        <Form>
          <Row>
            <h1>{t('config.company.title')}</h1>
            <ArrayInput
              config={configDefinition}
              model={this.state.company}
              onChange={(company: EditConfigCompanyModel) => this.setState({company})}
              tPrefix="config.company."
            />
          </Row>

          <Row>
            <h1>{t('config.invoiceTitle')}</h1>
            <ArrayInput
              config={configInvoiceDefinition}
              model={this.state}
              onChange={(state: EditConfigModel) => this.setState({...state})}
              tPrefix="config."
            />
          </Row>


          <Row>
            <h1>{t('config.settingsTitle')}</h1>
            <ArrayInput
              config={configSettingsDefinition}
              model={this.state}
              onChange={(state: EditConfigModel) => this.setState({...state})}
              tPrefix="config."
            />
          </Row>


          <EditConfigExtraFields
            config={this.state}
            onChange={this.setState.bind(this)}
          />
        </Form>


        <StickyFooter>
            <Control.BusyButton onClick={this._save.bind(this)} data-tst="save">{t('save')}</Control.BusyButton>
        </StickyFooter>
      </Container>
    );
  }
}

export default connect((state: ConfacState) => ({config: state.config}), {updateConfig})(EditConfig);
