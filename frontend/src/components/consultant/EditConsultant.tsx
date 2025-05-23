import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Row, Form, Alert} from 'react-bootstrap';
import {useNavigate, useParams} from 'react-router';
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
import {Audit} from '../admin/audit/Audit';
import {Claim} from '../users/models/UserModel';
import useEntityChangedToast from '../hooks/useEntityChangedToast';


const useConsultantState = (consultantId: string) => {
  const storeConsultant = useSelector((state: ConfacState) => state.consultants.find(x => x.slug === consultantId || x._id === consultantId));
  const [consultant, setSimpleConsultant] = useState<ConsultantModel>(storeConsultant || getNewConsultant());

  const setConsultant = (model: ConsultantModel) => {
    setSimpleConsultant(model);
  };

  useEffect(() => {
    if (storeConsultant) {
      setConsultant(storeConsultant);
    } else {
      setConsultant(getNewConsultant());
    }
  }, [storeConsultant]);

  return {
    consultant,
    setConsultant,
  };
};


export const EditConsultant = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const {consultant, setConsultant} = useConsultantState(params.id);
  const consultantDuplicate = useSelector((state: ConfacState) => state.consultants
    .filter(x => x.email === consultant.email)
    .find(x => x.slug !== params.id && x._id !== params.id));

  useEntityChangedToast(consultant._id);

  const docTitle = consultant._id ? 'consultantEdit' : 'consultantNew';
  useDocumentTitle(docTitle, {name: `${consultant.firstName} ${consultant.name}`});

  const buttonDisabled = !consultant.name || !consultant.firstName;
  return (
    <Container className="edit-container">
      <Form>
        <Row className="page-title-container">
          <h1>{consultant._id ? `${consultant.firstName} ${consultant.name}` : t('consultant.createNew')}</h1>
          <Audit model={consultant} modelType="consultant" />
          {consultantDuplicate && consultant.email && <Alert variant="warning">{t('consultant.alreadyExists')}</Alert>}
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
          className="tst-save-consultant"
          disabled={buttonDisabled}
        >
          {t('save')}
        </BusyButton>
      </StickyFooter>
    </Container>
  );
};
