import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Row, Form, Col} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';
import {t} from '../utils';
import {ArrayInput} from '../controls/form-controls/inputs/ArrayInput';
import {saveProject} from '../../actions';
import {StickyFooter} from '../controls/skeleton/StickyFooter';
import {BusyButton} from '../controls/form-controls/BusyButton';
import {ProjectModel} from './models/ProjectModel';
import {projectFormConfig} from './models/ProjectFormConfig';
import {getNewProject} from './models/getNewProject';
import {ConsultantSelectWithCreateModal} from '../consultant/controls/ConsultantSelectWithCreateModal';
import {ConfacState} from '../../reducers/app-state';

interface EditProjectProps {
  match: {
    params: {id: string};
  };
}


export const EditProject = (props: EditProjectProps) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const model = useSelector((state: ConfacState) => state.projects.find(c => c._id === props.match.params.id));
  const [project, setProject] = useState<ProjectModel>(model || getNewProject());

  const isButtonDisabled = (): boolean => {
    const {consultantId} = project;
    return !consultantId;
  };

  return (
    <Container className="edit-container">
      <Row className="page-title-container">
        <h1>{project._id ? t('project.project') : t('project.createNew')}</h1>
      </Row>
      <Form>
        <Row>
          <Col sm={6}>
            <ConsultantSelectWithCreateModal
              consultantId={project.consultantId}
              onChange={consultant => setProject({...project, consultantId: consultant && consultant._id})}
            />
          </Col>
          <ArrayInput
            config={projectFormConfig}
            model={project}
            onChange={(value: {[key: string]: any}) => setProject({...project, ...value})}
            tPrefix="project."
          />
        </Row>
      </Form>
      <StickyFooter>
        <BusyButton onClick={() => dispatch(saveProject(project, history))} disabled={isButtonDisabled()}>
          {t('save')}
        </BusyButton>
      </StickyFooter>
    </Container>
  );
};
