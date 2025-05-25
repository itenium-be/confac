import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Row, Form, Alert} from 'react-bootstrap';
import {useNavigate, useParams, useBlocker} from 'react-router';
import {ConfacState} from '../../reducers/app-state';
import {t} from '../utils';
import {ArrayInput} from '../controls/form-controls/inputs/ArrayInput';
import {saveConsultant as dispatchSaveConsultant} from '../../actions';
import {StickyFooter} from '../controls/other/StickyFooter';
import {getNewConsultant} from './models/getNewConsultant';
import {ConsultantModel} from './models/ConsultantModel';
import {BusyButton} from '../controls/form-controls/BusyButton';
import {defaultConsultantProperties} from './models/ConsultantConfig';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {Audit} from '../admin/audit/Audit';
import {Claim} from '../users/models/UserModel';
import useEntityChangedToast from '../hooks/useEntityChangedToast';
import {ChangesModal} from '../controls/other/ChangesModal';

const useConsultantState = (consultantId: string) => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const storeConsultant = useSelector((state: ConfacState) => state.consultants.find(x => x.slug === consultantId || x._id === consultantId));
  const [consultant, setSimpleConsultant] = useState<ConsultantModel>(storeConsultant || getNewConsultant());
  const [hasChanges, setHasChanges] = useState(false);

  const blocker = useBlocker(({currentLocation, nextLocation}) => {
    if (currentLocation.pathname === nextLocation.pathname) {
      return false;
    }

    return hasChanges;
  });

  const setConsultant = (model: ConsultantModel) => {
    setHasChanges(true);
    setSimpleConsultant(model);
  };

  useEffect(() => {
    setHasChanges(false);
    if (storeConsultant) {
      setSimpleConsultant(storeConsultant);
    } else {
      setSimpleConsultant(getNewConsultant());
    }
  }, [storeConsultant]);

  const saveConsultant = () => {
    setHasChanges(false);
    dispatch(dispatchSaveConsultant(consultant, undefined, history) as any);
  };

  return {
    consultant,
    setConsultant,
    blocker,
    saveConsultant,
  };
};


export const EditConsultant = () => {
  const params = useParams<{id: string}>();
  const {consultant, setConsultant, blocker, saveConsultant} = useConsultantState(params.id ?? '');
  const consultantDuplicate = useSelector((state: ConfacState) => state.consultants
    .filter(x => x.email === consultant.email)
    .find(x => x.slug !== params.id && x._id !== params.id));

  useEntityChangedToast(consultant._id);

  const docTitle = consultant._id ? 'consultantEdit' : 'consultantNew';
  useDocumentTitle(docTitle, {name: `${consultant.firstName} ${consultant.name}`});

  const buttonDisabled = !consultant.name || !consultant.firstName;
  return (
    <Container className="edit-container">
      <ChangesModal blocker={blocker} />
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
          onClick={saveConsultant}
          className="tst-save-consultant"
          disabled={buttonDisabled}
        >
          {t('save')}
        </BusyButton>
      </StickyFooter>
    </Container>
  );
};
