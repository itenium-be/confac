import React, {useState} from 'react';
import {connect} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
import {t, searchinize, formatDate} from '../utils';
import {ConfacState} from '../../reducers/app-state';
import {ClientModel} from '../client/models/ClientModels';
import {SearchStringInput} from '../controls/form-controls/inputs/SearchStringInput';
import {ProjectFilters} from '../../models';
import {updateProjectFilters} from '../../actions';
import {ProjectReferenceResolver} from './utils/ProjectReferenceResolver';
import {ProjectMonthModal} from './controls/ProjectMonthModal';
import {ConsultantModel} from '../consultant/models/ConsultantModel';
import {Switch} from '../controls/form-controls/Switch';
import {Button} from '../controls/form-controls/Button';
import {FullProjectModel} from './models/ProjectModel';
import {ListPage} from '../controls/table/ListPage';
import {projectFeature} from './models/getProjectFeature';

type ProjectsListProps = {
  projects: FullProjectModel[];
  consultants: ConsultantModel[];
  clients: ClientModel[];
  updateProjectFilters: (filters: ProjectFilters) => void;
  filters: ProjectFilters;
};

const ProjectsList = (props: ProjectsListProps) => {
  const history = useHistory();
  const [modalProjectMonthId, setModalProjectMonthId] = useState<string | undefined>(undefined);

  const {searchFilterText, isShowingInActiveProjects} = props.filters;

  const filteredProjects = props.projects.filter(project => {
    const {consultant, partner, client, details} = project;

    if (!isShowingInActiveProjects && !details.isActive) return false;

    if (!searchFilterText) return true;

    const startDate = formatDate(details.startDate);
    const endDate = formatDate(details.endDate);

    return searchinize(
      `${consultant.name} ${consultant.type} ${startDate} ${endDate} ${partner && partner.name} ${client.name}`,
    ).includes(searchFilterText.toLowerCase());
  });

  const feature = projectFeature({
    // projects: filteredProjects,
    projects: props.projects,
  });

  return (
    <Container className="client-list">
      <Row style={{marginBottom: '20px'}}>
        <Col lg={3} md={12}>
          <SearchStringInput
            value={searchFilterText}
            onChange={value => props.updateProjectFilters({...props.filters, searchFilterText: value})}
          />
        </Col>
        <Col lg={3} md={6}>
          <Switch
            value={isShowingInActiveProjects}
            onChange={isChecked => props.updateProjectFilters({...props.filters, isShowingInActiveProjects: isChecked})}
            label={t('project.showInactiveProjects')}
            onColor="#F2DEDE"
          />
        </Col>
        <Col lg={6} md={12} style={{textAlign: 'right'}}>
          {modalProjectMonthId && (
            <ProjectMonthModal show={!!modalProjectMonthId} onClose={() => setModalProjectMonthId(undefined)} />
          )}
          <Button
            style={{marginRight: '10px'}}
            onClick={() => setModalProjectMonthId('new_project_month')}
            size="sm"
            variant="primary"
            data-tst="new-project"
            icon="fa fa-plus"
          >
            {t('project.newMonth')}
          </Button>
          <Button
            onClick={() => history.push('/consultants')}
            size="sm"
            variant="primary"
          >
            {t('consultant.title')}
          </Button>
        </Col>
      </Row>

      <ListPage feature={feature} />
    </Container>
  );
};



export default connect(
  (state: ConfacState) => {
    const projects = new ProjectReferenceResolver(state.projects, state.consultants, state.clients).getProjects();

    return {
      projects,
      consultants: state.consultants,
      clients: state.clients,
      filters: state.app.projectFilters,
    };
  },
  {updateProjectFilters},
)(ProjectsList);
