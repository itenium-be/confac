import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Container, Row, Form} from 'react-bootstrap';
import {t} from '../utils';
import {configDefinition} from './models/ConfigConfig';
import {updateConfig} from '../../actions/index';
import {ConfigModel} from './models/ConfigModel';
import {ConfacState} from '../../reducers/app-state';
import {StickyFooter} from '../controls/other/StickyFooter';
import {ArrayInput} from '../controls/form-controls/inputs/ArrayInput';
import {BusyButton} from '../controls/form-controls/BusyButton';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {Audit} from '../admin/Audit';
import {Claim} from '../users/models/UserModel';


type EditConfigProps = {
  config: ConfigModel,
  updateConfig: (config: ConfigModel) => void,
}


const EditConfig = (props: EditConfigProps) => {
  useDocumentTitle('config');
  const [state, setState] = useState<ConfigModel>(JSON.parse(JSON.stringify(props.config)));

  return (
    <Container className="edit-container">
      <Form>
        <Row>
          <ArrayInput
            config={configDefinition}
            model={state}
            onChange={(newState: ConfigModel) => setState({...newState})}
            tPrefix="config."
          />
        </Row>
        <Audit audit={props.config.audit} />
      </Form>
      <StickyFooter claim={Claim.ManageConfig}>
        <BusyButton onClick={() => props.updateConfig(state)}>{t('save')}</BusyButton>
      </StickyFooter>
    </Container>
  );
};


export default connect((state: ConfacState) => ({config: state.config}), {updateConfig})(EditConfig);
