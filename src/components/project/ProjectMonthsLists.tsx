import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container} from 'react-bootstrap';
import {ConfacState} from '../../reducers/app-state';
import {updateAppFilters, patchProjectsMonth} from '../../actions';
import {ListPageHeader} from '../controls/table/ListPage';
import {projectMonthFeature, ProjectMonthFeatureBuilderConfig} from './models/getProjectMonthFeature';
import {FullProjectMonthModel} from './models/FullProjectMonthModel';
import {ProjectMonthModel} from './models/ProjectMonthModel';
import {ProjectModel} from './models/ProjectModel';
import {ConsultantModel} from '../consultant/models/ConsultantModel';
import {ClientModel} from '../client/models/ClientModels';
import {LinkToButton} from '../controls/form-controls/button/LinkToButton';
import {CreateProjectsMonthModalButton} from './controls/CreateProjectsMonthModal';
import {IFeature} from '../controls/feature/feature-models';
import {ListFilters} from '../controls/table/table-models';
import {t} from '../utils';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {CollapsibleProjectMonthsList} from './project-month-list/ProjectMonthsList';


import './project-month-list/project-month-list.scss';


/** Resolve ProjectModel _ids to their corresponding models */
export function projectMonthResolve(projectMonth: ProjectMonthModel, state: ConfacState): FullProjectMonthModel {
  const project = state.projects.find(p => p._id === projectMonth.projectId) as ProjectModel;
  const consultant = state.consultants.find(c => c._id === project.consultantId) as ConsultantModel;
  const client = project.client && state.clients.find(c => c._id === project.client.clientId) as ClientModel;
  const partner = project.partner && state.clients.find(c => project.partner && c._id === project.partner.clientId);
  const invoice = state.invoices.find(i => i.projectMonthId === projectMonth._id);

  return {
    _id: projectMonth._id,
    details: projectMonth,
    project,
    consultant,
    client,
    partner,
    invoice,
  };
}

export const displayMonthWithYear = (projectsMonthDetails: ProjectMonthModel) => {
  const {month: date} = projectsMonthDetails;
  const formattedMonth = date.format('MMMM').charAt(0).toUpperCase() + date.format('MMMM').substring(1);
  return t('projectMonth.listTitle', {month: formattedMonth, year: date.year()});
};



/** The Monthly Invoicing Table */
export const ProjectMonthsLists = () => {
  useDocumentTitle('projectMonthsList');

  const dispatch = useDispatch();
  const config: ProjectMonthFeatureBuilderConfig = useSelector((state: ConfacState) => {
    const projects = state.projectsMonth;

    let data: FullProjectMonthModel[] = [];
    if (state.projects.length && state.consultants.length && state.clients.length) {
      data = projects.map(pm => projectMonthResolve(pm, state));
    }

    return {
      data,
      save: m => dispatch(patchProjectsMonth(m.details)),
      filters: state.app.filters.projectMonths,
      setFilters: f => dispatch(updateAppFilters('projectMonths', f)),
    };
  });


  const topToolbar = (
    <>
      <CreateProjectsMonthModalButton />
      <LinkToButton to="/invoices" label="title" size="lg" variant="primary" />
    </>
  );



  const feature = projectMonthFeature(config);


  const getKey = (x: FullProjectMonthModel): string => x.details.month.format('YYYY-MM');
  const uniqueMonths = feature.list.data
    .map(getKey)
    .filter((month, index, arr) => arr.indexOf(month) === index)
    .sort((a, b) => b.localeCompare(a));


  const features = uniqueMonths.map((month, index) => {
    const f: IFeature<FullProjectMonthModel, ListFilters> = {
      ...feature,
      list: {
        ...feature.list,
        data: feature.list.data.filter(x => getKey(x) === month),
      },
    };

    return (
      <div key={month}>
        <CollapsibleProjectMonthsList feature={f} defaultOpen={index === 0} />
      </div>
    );
  });


  return (
    <Container className={`list list-${feature.key}`}>
      <ListPageHeader feature={feature} topToolbar={topToolbar} />
      {features}
    </Container>
  );
};
