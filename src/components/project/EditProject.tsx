import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Row, Form} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {t} from '../utils';
import {ArrayInput} from '../controls/form-controls/inputs/ArrayInput';
import {saveProject} from '../../actions';
import {StickyFooter} from '../controls/other/StickyFooter';
import {BusyButton} from '../controls/form-controls/BusyButton';
import {IProjectModel} from './models/IProjectModel';
import {projectFormConfig} from './models/ProjectFormConfig';
import {getNewProject} from './models/getNewProject';
import {ConfacState} from '../../reducers/app-state';
import {getDefaultProjectMonthConfig} from './models/ProjectMonthModel';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {getNewClient} from '../client/models/getNewClient';
import {getNewConsultant} from '../consultant/models/getNewConsultant';
import {Audit} from '../admin/Audit';
import {CopyProject} from './CopyProject';
import {Claim} from '../users/models/UserModel';

interface EditProjectProps {
  match: {
    params: {id: string};
  };
}


export const EditProject = (props: EditProjectProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const model = useSelector((state: ConfacState) => state.projects.find(c => c._id === props.match.params.id));
  const consultants = useSelector((state: ConfacState) => state.consultants);
  const [project, setProject] = useState<IProjectModel>(model || getNewProject());
  const consultant = useSelector((state: ConfacState) => state.consultants.find(x => x._id === project.consultantId) || getNewConsultant());
  const clients = useSelector((state: ConfacState) => state.clients);
  const client = useSelector((state: ConfacState) => state.clients.find(x => x._id === project.client.clientId) || getNewClient());
  const [needsSync, setNeedsSync] = useState<{consultant: boolean, client: boolean}>({consultant: false, client: false});

  const docTitle = consultant._id ? 'projectEdit' : 'projectNew';
  useDocumentTitle(docTitle, {consultant: consultant.firstName, client: client.name});

  if (needsSync.consultant || needsSync.client) {
    let newProject = {...project};

    if (needsSync.consultant) {
      // Set ProjectMonth invoicing config based on the Consultant.Type
      const selectedConsultant = consultants.find(c => c._id === project.consultantId);
      newProject = {
        ...newProject,
        projectMonthConfig: {
          ...newProject.projectMonthConfig,
          ...getDefaultProjectMonthConfig(selectedConsultant && selectedConsultant.type),
        },
      };
    }

    if (needsSync.client) {
      // Set ProjectMonth invoicing config based on the Client.ChangingOrderNr
      const selectedClient = clients.find(x => x._id === project.client.clientId);
      if (selectedClient) {
        newProject.projectMonthConfig.changingOrderNr = selectedClient.defaultChangingOrderNr;
      }
    }

    setNeedsSync({consultant: false, client: false});
    setProject(newProject);
  }



  const setProjectInterceptor = (value: IProjectModel) => {
    const newProject = {...project, ...value};
    setProject(newProject);

    // Set a flag to update fields that receive default values from the
    // selected Consultant/Client. Cannot update them at this point because
    // the selectors have not yet included the Consultant/Client when the
    // user created a new entity with the CreateModal button
    const consultantChanged = value.consultantId !== project.consultantId;
    const clientChanged = value.client.clientId !== project.client.clientId;
    if (consultantChanged || clientChanged) {
      setNeedsSync({consultant: consultantChanged, client: clientChanged});
    }
  };

  const isButtonDisabled = !project.consultantId
    || !project.client || !project.client.clientId
    || (!project.client.defaultInvoiceLines.length && !project.client.defaultInvoiceLines[0].price)
    || !project.startDate;

  return (
    <Container className="edit-container">
      <Row className="page-title-container">
        <h1>{project._id ? t('project.project') : t('project.createNew')}</h1>
        <Audit audit={project.audit} />
      </Row>
      <Form>
        <Row>
          <ArrayInput
            config={projectFormConfig}
            model={project}
            onChange={(value: IProjectModel) => setProjectInterceptor(value)}
            tPrefix="project."
          />
        </Row>
      </Form>
      <StickyFooter claim={Claim.ManageProjects}>
        {project.endDate && <CopyProject projectToCopy={project} />}
        <BusyButton onClick={() => dispatch(saveProject(project, navigate) as any)} disabled={isButtonDisabled}>
          {t('save')}
        </BusyButton>
      </StickyFooter>
    </Container>
  );
};
