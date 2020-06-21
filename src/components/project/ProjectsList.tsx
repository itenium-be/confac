import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {ConfacState} from '../../reducers/app-state';
import {saveProject, updateAppFilters} from '../../actions';
import {ProjectReferenceResolver} from './utils/ProjectReferenceResolver';
import {ListPage} from '../controls/table/ListPage';
import {projectFeature, ProjectFeatureBuilderConfig} from './models/getProjectFeature';
import {LinkToButton} from '../controls/form-controls/button/LinkToButton';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {Claim} from '../users/models/UserModel';


import './ProjectsList.scss';


export const ProjectsList = () => {
  useDocumentTitle('projectList');

  const history = useHistory();
  const dispatch = useDispatch();
  const config: ProjectFeatureBuilderConfig = useSelector((state: ConfacState) => {
    const projects = new ProjectReferenceResolver(state.projects, state.consultants, state.clients).getProjects();

    return {
      data: projects,
      save: m => dispatch(saveProject(m.details, history)),
      filters: state.app.filters.projects,
      setFilters: f => dispatch(updateAppFilters('projects', f)),
    };
  });

  const TopToolbar = (
    <LinkToButton claim={Claim.ViewConsultants} to="/consultants" label="consultant.title" />
  );


  const feature = projectFeature(config);
  return <ListPage feature={feature} topToolbar={TopToolbar} />;
};
