import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Container, Row, Form, Col} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';
import {ConfacState} from '../../reducers/app-state';
import {t} from '../utils';
import {ArrayInput} from '../controls/form-controls/inputs/ArrayInput';
import {ConsultantModal} from '../consultant/controls/ConsultantModal';
import {saveProject} from '../../actions';
import {StickyFooter} from '../controls/skeleton/StickyFooter';
import {ConsultantModel} from '../consultant/models/ConsultantModel';
import {ConsultantSearchSelect} from '../consultant/controls/ConsultantSearchSelect';
import {Button} from '../controls/form-controls/Button';
import {BusyButton} from '../controls/form-controls/BusyButton';
import {ProjectModel} from './models/ProjectModel';
import {projectFormConfig} from './models/ProjectFormConfig';
import {getNewProject} from './models/getNewProject';


interface EditProjectProps {
  saveProject: (project: ProjectModel, history: any) => void;
  lastAddedConsultantId: string;
}

const EditProject = (props: EditProjectProps) => {
  const history = useHistory();
  const [modalClientId, setModalClientId] = useState<string | undefined>(undefined);
  const [project, setProjectProperties] = useState<ProjectModel>(getNewProject());

  useEffect(() => {
    setProjectProperties({...project, consultantId: props.lastAddedConsultantId});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.lastAddedConsultantId]);

  const isButtonDisabled = (): boolean => {
    const {consultantId} = project;
    return !consultantId;
  };

  return (
    <Container className="edit-container">
      <Row className="page-title-container">
        <h1>{t('project.createNew')}</h1>
      </Row>
      <Form>
        <Row>
          <Col sm={5}>
            {modalClientId && <ConsultantModal show={!!modalClientId} onClose={() => setModalClientId(undefined)} />}

            <ConsultantSearchSelect
              label="Consultant"
              value={project.consultantId}
              onChange={(consultantId: string) => setProjectProperties({...project, consultantId})}
            />
          </Col>
          <Col sm={5} style={{display: 'flex', alignItems: 'center'}}>
            <Button icon="fa fa-plus" size="sm" variant="secondary" onClick={() => setModalClientId('new')}>
              {t('project.newConsultant')}
            </Button>
          </Col>
        </Row>
        <Row>
          <ArrayInput
            config={projectFormConfig}
            model={project}
            onChange={(value: {[key: string]: any}) => setProjectProperties({...project, ...value})}
            tPrefix="project."
          />
        </Row>
      </Form>
      <StickyFooter>
        <BusyButton onClick={() => props.saveProject(project, history)} disabled={isButtonDisabled()} data-tst="save">
          {t('save')}
        </BusyButton>
      </StickyFooter>
    </Container>
  );
};

const mapStateToProps = (state: ConfacState) => {
  const sortConsultantsByCreatedOn = (consultants: ConsultantModel[]): ConsultantModel[] => {
    if (consultants && consultants.length) {
      return consultants.sort(
        (a: ConsultantModel, b: ConsultantModel) => +new Date(a.createdOn as string) - +new Date(b.createdOn as string),
      );
    }
    return [];
  };

  const getLastAddedConsultantById = (consultants: ConsultantModel[]): string => {
    const sortedConsultants = sortConsultantsByCreatedOn(consultants);

    if (sortedConsultants && sortedConsultants.length) {
      return sortedConsultants[sortedConsultants.length - 1]._id as string;
    }
    return '';
  };

  return {
    lastAddedConsultantId: getLastAddedConsultantById(state.consultants),
  };
};

export default connect(mapStateToProps, {saveProject})(EditProject);
