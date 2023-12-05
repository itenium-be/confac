import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Container, Row, Form, Col} from 'react-bootstrap';
import {t} from '../utils';
import {configDefinition} from './models/ConfigConfig';
import {updateConfig} from '../../actions/index';
import {ConfigModel} from './models/ConfigModel';
import {ConfacState} from '../../reducers/app-state';
import {StickyFooter} from '../controls/other/StickyFooter';
import {ArrayInput} from '../controls/form-controls/inputs/ArrayInput';
import {BusyButton} from '../controls/form-controls/BusyButton';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {Audit} from '../admin/audit/Audit';
import {Claim} from '../users/models/UserModel';
import {GenericAttachmentDropzone} from '../controls/attachments/GenericAttachmentDropzone';
import {ClaimGuard} from '../enhancers/EnhanceWithClaim';


const EditConfig = () => {
  useDocumentTitle('config');
  const dispatch = useDispatch();
  const config = useSelector((state: ConfacState) => state.config);
  const [state, setState] = useState<ConfigModel>(JSON.parse(JSON.stringify(config)));

  const termsAndConditions = config.attachments.find(x => x.type === 'TermsAndConditions');
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
        <ClaimGuard claim={Claim.ManageConfig}>
          <Row style={{marginBottom: 16}} >
            <Col>
              <Form.Label>{t('config.termsAndConditions')}</Form.Label>
              <GenericAttachmentDropzone
                dropzonePlaceholderText={t('config.emailTermsAndConditions')}
                context={{modelType: 'config', id: config._id!, attachmentType: 'TermsAndConditions'}}
                attachment={termsAndConditions}
              />
            </Col>
          </Row>
        </ClaimGuard>
        <Row>
          <h4>{t('config.audit')}</h4>
          <Audit model={config} modelType="config" />
        </Row>
      </Form>
      <StickyFooter claim={Claim.ManageConfig}>
        <BusyButton className="tst-btn-save" onClick={() => dispatch(updateConfig(state) as any)}>{t('save')}</BusyButton>
      </StickyFooter>
    </Container>
  );
};

export default EditConfig;
