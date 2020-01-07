import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";
import { t, searchinize, formatDate } from '../utils';
import { Button, Switch } from '../controls';
import { Container, Table, Row, Col } from 'react-bootstrap';
import { ConfacState } from '../../reducers/app-state';
import { FullProjectModel } from './models';
import ProjectsListRow, { ProjectsListHeader } from './ProjectsListRow';
import { ConsultantModel } from '../consultant/models';
import { ClientModel } from '../client/models/ClientModels';
import { SearchStringInput } from '../controls/form-controls/inputs/SearchStringInput';
import { ProjectFilters } from '../../models';
import { updateProjectFilters } from '../../actions';
import { ProjectReferenceResolver } from './utils/ProjectReferenceResolver';


type ProjectsListProps = {
  projects: FullProjectModel[],
  consultants: ConsultantModel[],
  clients: ClientModel[],
  updateProjectFilters: (filters: ProjectFilters) => void,
  filters: ProjectFilters,
}

const ProjectsList = (props: ProjectsListProps) => {
  const history = useHistory()

  const { searchFilterText, isShowingInActiveProjects } = props.filters

  // ? Search filter
  let filteredProjects = searchFilterText ? props.projects.filter(project => {
    const { consultant, partner, client, details } = project
    const startDate = formatDate(details.startDate)
    const endDate = formatDate(details.endDate)

    return searchinize(`${consultant.name} ${consultant.type} ${startDate} ${endDate} ${partner && partner.name} ${client.name}`)
      .includes(searchFilterText.toLowerCase())
  })
    : props.projects

  // ? Filter projects by active status
  filteredProjects = isShowingInActiveProjects ? filteredProjects.filter(project => !project.details.isActive) : filteredProjects.filter(project => project.details.isActive)

  return (
    <Container className="client-list">
      <Row className="page-title-container" >
        <h1>{t('nav.projects')}</h1>
      </Row>
      <Row style={{ marginBottom: '20px' }}>
        <Col lg={3} md={12}>
          <SearchStringInput
            value={searchFilterText}
            onChange={searchFilterText => props.updateProjectFilters({ ...props.filters, searchFilterText })}
          />
        </Col>
        <Col lg={3} md={6}>
          <Switch
            value={isShowingInActiveProjects}
            onChange={(isChecked) => props.updateProjectFilters({ ...props.filters, isShowingInActiveProjects: isChecked })}
            label={t('project.showInactiveProjects')}
            onColor="#F2DEDE"
          />
        </Col>
        <Col lg={6} md={12} style={{ textAlign: 'right' }}>
          <Button style={{ marginRight: '10px' }} onClick={() => history.push('/projects/create')} size="sm" variant="outline-primary" data-tst="new-project" icon="fa fa-plus">
            {t('project.createNew')}
          </Button>

          <Button onClick={() => window.alert('Not implemented')} size="sm" variant="primary" data-tst="new-project" icon="fa fa-plus">
            {t('project.newMonth')}
          </Button>
        </Col>
      </Row>


      <Table size="sm" style={{ marginTop: 10 }}>
        <ProjectsListHeader />
        <tbody>
          {filteredProjects.length > 0 && filteredProjects.map(project => (
            <ProjectsListRow project={project} key={project.details._id} />
          ))}
        </tbody>
      </Table>
    </Container >
  );
}

export default connect((state: ConfacState) => {
  const projects = new ProjectReferenceResolver(state.projects, state.consultants, state.clients).getProjects()

  return {
    projects,
    consultants: state.consultants,
    clients: state.clients,
    filters: state.app.projectFilters
  }
}, { updateProjectFilters })(ProjectsList);
