import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Row, Form} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {ConfacState} from '../../reducers/app-state';
import {t} from '../utils';
import {ArrayInput} from '../controls/form-controls/inputs/ArrayInput';
import {saveConsultant} from '../../actions';
import {StickyFooter} from '../controls/other/StickyFooter';
import {getNewConsultant} from './models/getNewConsultant';
import {ConsultantModel} from './models/ConsultantModel';
import {BusyButton} from '../controls/form-controls/BusyButton';
import {defaultConsultantProperties} from './models/ConsultantConfig';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {Audit} from '../admin/Audit';
import {Claim} from '../users/models/UserModel';
import {useParams} from 'react-router-dom';


export const EditConsultant = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const model = useSelector((state: ConfacState) => state.consultants.find(c => c.slug === params.id || c._id === params.id));
  const [consultant, setConsultant] = useState<ConsultantModel>(model || getNewConsultant());

  const docTitle = consultant._id ? 'consultantEdit' : 'consultantNew';
  useDocumentTitle(docTitle, {name: `${consultant.firstName} ${consultant.name}`});

  if (model && !consultant._id) {
    setConsultant(model);
  }

  const isButtonDisabled = (): boolean => {
    const {name, firstName} = consultant;

    if (!name || !firstName) {
      return true;
    }
    return false;
  };

  return (
    <Container className="edit-container">
      <Form>
        <Row className="page-title-container">
          <h1>{consultant._id ? `${consultant.firstName} ${consultant.name}` : t('consultant.createNew')}</h1>
          <Audit audit={consultant.audit} />
        </Row>
        <Row>
          <ArrayInput
            config={defaultConsultantProperties}
            model={consultant}
            onChange={(value: { [key: string]: any }) => setConsultant({...consultant, ...value})}
            tPrefix="consultant.props."
          />
        </Row>
      </Form>
      <StickyFooter claim={Claim.ManageConsultants}>
        <BusyButton
          onClick={() => dispatch(saveConsultant(consultant, undefined, history) as any)}
          disabled={isButtonDisabled()}
        >
          {t('save')}
        </BusyButton>
      </StickyFooter>
    </Container>
  );
};
