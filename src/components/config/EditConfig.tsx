import React, {Component} from 'react';
import {connect} from 'react-redux';
import {t} from '../util';
import {Container, Row, Form} from 'react-bootstrap';
import {configDefinition} from './models/ConfigConfig';
import * as Control from '../controls';
import {updateConfig} from '../../actions/index';
import { ConfigModel } from './models/ConfigModel';
import { ConfacState } from '../../reducers/app-state';
import { ArrayInput } from '../controls';
import { StickyFooter } from '../controls/skeleton/StickyFooter';


type EditConfigProps = {
  config: ConfigModel,
  updateConfig: (config: ConfigModel) => void,
}

type EditConfigState = ConfigModel;

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
            <ArrayInput
              config={configDefinition}
              model={this.state}
              onChange={(state: ConfigModel) => this.setState({...state})}
              tPrefix="config."
            />
          </Row>
        </Form>
        <StickyFooter>
            <Control.BusyButton onClick={this._save.bind(this)} data-tst="save">{t('save')}</Control.BusyButton>
        </StickyFooter>
      </Container>
    );
  }
}

export default connect((state: ConfacState) => ({config: state.config}), {updateConfig})(EditConfig);
