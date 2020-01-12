import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Row, Form} from 'react-bootstrap';
import {t} from '../utils';
import {configDefinition} from './models/ConfigConfig';
import {updateConfig} from '../../actions/index';
import {ConfigModel} from './models/ConfigModel';
import {ConfacState} from '../../reducers/app-state';
import {StickyFooter} from '../controls/skeleton/StickyFooter';
import {ArrayInput} from '../controls/form-controls/inputs/ArrayInput';
import {BusyButton} from '../controls/form-controls/BusyButton';


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

  // eslint-disable-next-line camelcase
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
          <BusyButton onClick={() => this._save()} data-tst="save">{t('save')}</BusyButton>
        </StickyFooter>
      </Container>
    );
  }
}

export default connect((state: ConfacState) => ({config: state.config}), {updateConfig})(EditConfig);
