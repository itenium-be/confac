import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate, useParams} from 'react-router';
import {Container, Row, Form} from 'react-bootstrap';
import {t} from '../utils';
import {ArrayInput} from '../controls/form-controls/inputs/ArrayInput';
import {deleteProjectsMonth, patchProjectsMonth} from '../../actions';
import {StickyFooter} from '../controls/other/StickyFooter';
import {BusyButton} from '../controls/form-controls/BusyButton';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {Audit} from '../admin/audit/Audit';
import {Claim} from '../users/models/UserModel';
import {getNewProjectMonth} from './models/getNewProject';
import {ProjectMonthModel} from './models/ProjectMonthModel';
import {projectMonthFormProperties} from './models/ProjectFormConfig';
import {useProjectsMonth} from '../hooks/useProjects';
import {EnhanceWithConfirmation} from '../enhancers/EnhanceWithConfirmation';
import {Button} from '../controls/form-controls/Button';
import useEntityChangedToast from '../hooks/useEntityChangedToast';

const ConfirmationButton = EnhanceWithConfirmation(Button);


export const EditProjectMonths = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const model = useProjectsMonth(params.projectMonthId);
  const [projectMonth, setProjectMonth] = useState<ProjectMonthModel>((model && model.details) || getNewProjectMonth());

  useEntityChangedToast(projectMonth._id);

  const docTitle = projectMonth._id ? 'projectMonthEdit' : 'projectMonthNew';
  const consultantName = (model && model.consultantName) || '';
  const clientName = (model && model.client.name) || '';
  useDocumentTitle(docTitle, {consultantName, clientName});
  const navigate = useNavigate();

  if (model && !projectMonth._id) {
    setProjectMonth(model.details);
  }

  return (
    <Container className="edit-container">
      <Form>
        <Row className="page-title-container">
          <h1>{model ? `${model.consultantName} @ ${clientName}` : t('titles.projectMonthNew')}</h1>
          <Audit model={model?.details} modelType="projectMonth" />
        </Row>
        <Row>
          <ArrayInput
            config={projectMonthFormProperties}
            model={projectMonth}
            onChange={(value: { [key: string]: any }) => setProjectMonth({...projectMonth, ...value})}
            tPrefix="projectMonth.props."
          />
        </Row>
      </Form>
      <StickyFooter>
        <ConfirmationButton
          className="tst-confirm-delete-project-month"
          onClick={() => dispatch(deleteProjectsMonth(projectMonth._id, navigate) as any)}
          variant="danger"
          title={t('projectMonth.deleteConfirm.title')}
          componentChildren={t('delete')}
          claim={Claim.DeleteProjectMonth}
        >
          {t('projectMonth.deleteConfirm.content')}
        </ConfirmationButton>
        <BusyButton
          className="tst-validate-project-month"
          onClick={() => dispatch(patchProjectsMonth(projectMonth) as any)}
          claim={Claim.ValidateProjectMonth}
        >
          {t('save')}
        </BusyButton>
      </StickyFooter>
    </Container>
  );
};
