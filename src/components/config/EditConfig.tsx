import React, {Component} from 'react';
import {connect} from 'react-redux';
import {t} from '../util';
import {Container, Row, Col, Form} from 'react-bootstrap';
import {EditCompany} from './EditCompany';
import * as Control from '../controls';
import {updateConfig} from '../../actions/index';
import { EditConfigModel, EditConfigCompanyModel } from './models/ConfigModel';
import { ConfacState } from '../../reducers/default-states';
import { EditConfigInvoice } from './EditConfigInvoice';
import { EditConfigUserSettings } from './EditConfigUserSettings';
import { EditConfigExtraFields } from './EditConfigExtraFields';


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
          <EditCompany
            company={this.state.company}
            onChange={(company: EditConfigCompanyModel) => this.setState({company})}
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
        </Form>


        <Row className="button-row">
          <Col>
            <Control.BusyButton onClick={this._save.bind(this)} data-tst="save">{t('save')}</Control.BusyButton>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect((state: ConfacState) => ({config: state.config}), {updateConfig})(EditConfig);
