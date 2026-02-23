import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Container, Row, Form, Col} from 'react-bootstrap';
import {useBlocker, useNavigate, useParams} from 'react-router';
import {t} from '../utils';
import {ArrayInput} from '../controls/form-controls/inputs/ArrayInput';
import {deleteProject, saveProject as dispatchSaveProject} from '../../actions';
import {useAppDispatch} from '../hooks/useAppDispatch';
import {StickyFooter} from '../controls/other/StickyFooter';
import {BusyButton} from '../controls/form-controls/BusyButton';
import {IProjectModel, ProjectClientInvoiceLine} from './models/IProjectModel';
import {getNewProject, getNewProjectEndCustomer} from './models/getNewProject';
import {ConfacState} from '../../reducers/app-state';
import {getDefaultProjectMonthConfig} from './models/ProjectMonthModel';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {Audit} from '../admin/audit/Audit';
import {CopyProject} from './CopyProject';
import {Claim} from '../users/models/UserModel';
import {SingleContractIcon} from '../client/contract/SingleContractIcon';
import {EnhanceWithConfirmation} from '../enhancers/EnhanceWithConfirmation';
import {Button} from '../controls/form-controls/Button';
import {isDateIntervalValid} from '../controls/other/ProjectValidator';
import useEntityChangedToast from '../hooks/useEntityChangedToast';
import {getProjectFormConfig} from './models/ProjectFormConfig';
import {NotesWithCommentsModalButton} from '../controls/form-controls/button/NotesWithCommentsModalButton';
import {ChangesModal} from '../controls/other/ChangesModal';


const ConfirmationButton = EnhanceWithConfirmation(Button);


const useProjectState = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const storeProject = useSelector((state: ConfacState) => state.projects.find(c => c._id === params.id));

  const consultants = useSelector((state: ConfacState) => state.consultants);
  const [project, setSimpleProject] = useState<IProjectModel>(storeProject || getNewProject());
  const clients = useSelector((state: ConfacState) => state.clients);

  const [hasChanges, setHasChanges] = useState(false);
  const blocker = useBlocker(({currentLocation, nextLocation}) => {
    if (currentLocation.pathname === nextLocation.pathname) {
      return false;
    }

    return hasChanges;
  });

  const hasProjectMonths = useSelector((state: ConfacState) => state.projectsMonth.some(pm => pm.projectId === params.id));


  useEffect(() => {
    setHasChanges(false);
    if (storeProject) {
      setSimpleProject(storeProject);
    } else {
      setSimpleProject(getNewProject());
    }
  }, [storeProject]);


  const setProject = (value: IProjectModel) => {
    setHasChanges(true);
    const newProject = {...project, ...value};

    // Set ProjectMonth invoicing config based on the Client.ChangingOrderNr
    if (newProject.client.clientId !== project.client.clientId) {
      const selectedClient = clients.find(x => x._id === newProject.client.clientId);
      if (selectedClient) {
        newProject.projectMonthConfig = {
          ...newProject.projectMonthConfig,
          changingOrderNr: selectedClient.defaultChangingOrderNr,
        };

        if (selectedClient.defaultInvoiceLines?.length > 1) {
          newProject.client = {
            ...newProject.client,
            advancedInvoicing: true,
            defaultInvoiceLines: selectedClient.defaultInvoiceLines as ProjectClientInvoiceLine[]
          };
        }
      }
    }

    // Set ProjectMonth invoicing config based on the Consultant.Type
    if (newProject.consultantId !== project.consultantId) {
      const selectedConsultant = consultants.find(c => c._id === newProject.consultantId);
      if (selectedConsultant) {
        newProject.projectMonthConfig = {
          ...newProject.projectMonthConfig,
          ...getDefaultProjectMonthConfig(selectedConsultant.type),
        };
      }
    }

    // Enable/Disable "project is via client at end customer"
    if (!newProject.forEndCustomer && newProject.endCustomer) {
      newProject.client = {
        ...newProject.client,
        clientId: newProject.endCustomer.clientId,
      };
      newProject.endCustomer = null;
    } else if (newProject.forEndCustomer && !newProject.endCustomer) {
      newProject.endCustomer = {
        ...getNewProjectEndCustomer(),
        clientId: newProject.client.clientId,
      };
      newProject.client = {
        ...newProject.client,
        clientId: '',
      };
    }

    setSimpleProject(newProject);
  };

  const saveProject = () => {
    setHasChanges(false);
    dispatch(dispatchSaveProject(project, navigate));
  };

  return {
    project,
    setProject,
    canDelete: !hasProjectMonths,
    blocker,
    saveProject,
  };
};

const useEditProjectTitle = (project: IProjectModel) => {
  const consultant = useSelector((state: ConfacState) => state.consultants.find(x => x._id === project.consultantId));
  const client = useSelector((state: ConfacState) => state.clients.find(x => x._id === project.client.clientId));
  const docTitle = consultant?._id ? 'projectEdit' : 'projectNew';
  useDocumentTitle(docTitle, {consultant: consultant?.firstName ?? '', client: client?.name ?? ''});
};


export const EditProject = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {project, setProject, canDelete, blocker, saveProject} = useProjectState();
  const client = useSelector((state: ConfacState) => state.clients.find(x => x._id === project.client.clientId));

  useEntityChangedToast(project._id);
  useEditProjectTitle(project);

  const clientFormConfig = getProjectFormConfig(project);

  const isButtonDisabled = !project.consultantId
    || !project.client || !project.client.clientId
    || (!project.client.defaultInvoiceLines.length && !project.client.defaultInvoiceLines[0].price)
    || !project.startDate || (project.endDate ? !isDateIntervalValid(project.startDate, project.endDate) : false);

  return (
    <Container className="edit-container">
      <ChangesModal blocker={blocker} />
      <Row className="page-title-container">
        <h1>
          {project._id ? t('project.project') : t('project.createNew')}
          <NotesWithCommentsModalButton
            claim={Claim.ManageProjects}
            value={{comments: project.comments || []}}
            onChange={val => setProject({...project, comments: val.comments})}
            title={t('project.comments')}
            style={{marginLeft: 6, marginBottom: 6}}
            showNote={false}
          />
        </h1>
        <Audit model={project} modelType="project" />
      </Row>
      <Row>
        <Col>
          <h2>
            <SingleContractIcon
              contracts={client ? [project.contract, client?.frameworkAgreement] : [project.contract]}
              style={{fontSize: 28}}
            />
            {t('project.contract.title')}
          </h2>
        </Col>
      </Row>
      <Form>
        <Row>
          <ArrayInput
            config={clientFormConfig}
            model={project}
            onChange={(value: IProjectModel) => setProject(value)}
            tPrefix="project."
          />
        </Row>
      </Form>
      <StickyFooter claim={Claim.ManageProjects}>
        <ConfirmationButton
          className="tst-confirm-delete-project"
          onClick={() => dispatch(deleteProject(project._id, navigate))}
          variant="danger"
          title={t('project.deleteConfirm.title')}
          componentChildren={t('delete')}
          claim={claims => canDelete && !!project._id && claims.includes(Claim.DeleteProject)}
        >
          {t('project.deleteConfirm.content')}
        </ConfirmationButton>
        {project.endDate && project._id && <CopyProject projectToCopy={project} />}
        <BusyButton className="tst-save-project" onClick={saveProject} disabled={isButtonDisabled}>
          {t('save')}
        </BusyButton>
      </StickyFooter>
    </Container>
  );
};
