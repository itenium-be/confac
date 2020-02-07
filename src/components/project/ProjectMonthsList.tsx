import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ConfacState} from '../../reducers/app-state';
import {updateAppFilters, patchProjectsMonth} from '../../actions';
import {ListPage} from '../controls/table/ListPage';
import {projectMonthFeature, ProjectMonthFeatureBuilderConfig} from './models/getProjectMonthFeature';
import {ProjectMonthModel, FullProjectMonthModel} from './models/ProjectMonthModel';
import {ProjectModel} from './models/ProjectModel';
import {ConsultantModel} from '../consultant/models/ConsultantModel';
import {ClientModel} from '../client/models/ClientModels';

import './project-month-list/project-month-list.scss';

function projectMonthResolve(prj: ProjectMonthModel, state: ConfacState): FullProjectMonthModel {
  const project = state.projects.find(p => p._id === prj.projectId) as ProjectModel;
  const consultant = state.consultants.find(c => c._id === project.consultantId) as ConsultantModel;
  const client = project.client && state.clients.find(c => c._id === project.client.clientId) as ClientModel;
  const partner = project.partner && state.clients.find(c => project.partner && c._id === project.partner.clientId);

  return {
    _id: prj._id,
    details: prj,
    project,
    consultant,
    client,
    partner,
  };
}


export const ProjectsMonthsList = () => {
  const dispatch = useDispatch();
  const config: ProjectMonthFeatureBuilderConfig = useSelector((state: ConfacState) => {
    const projects = state.projectsMonth;

    let data: FullProjectMonthModel[] = [];
    if (state.projects.length && state.consultants.length && state.clients.length) {
      data = projects.map(p => projectMonthResolve(p, state));
    }

    return {
      data,
      save: m => dispatch(patchProjectsMonth(m.details)),
      filters: state.app.filters.projects,
      setFilters: f => dispatch(updateAppFilters('projectMonths', f)),
    };
  });



  const feature = projectMonthFeature(config);
  return (
    <ListPage feature={feature} />
  );
};
