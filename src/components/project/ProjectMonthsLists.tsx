import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container} from 'react-bootstrap';
import {ConfacState} from '../../reducers/app-state';
import {updateAppFilters, patchProjectsMonth} from '../../actions';
import {ListPageHeader} from '../controls/table/ListPage';
import {projectMonthFeature, ProjectMonthFeatureBuilderConfig} from './models/getProjectMonthFeature';
import {ProjectMonthModel, FullProjectMonthModel} from './models/ProjectMonthModel';
import {ProjectModel} from './models/ProjectModel';
import {ConsultantModel} from '../consultant/models/ConsultantModel';
import {ClientModel} from '../client/models/ClientModels';
import {List} from '../controls/table/List';
import {LinkToButton} from '../controls/form-controls/button/LinkToButton';
import {CreateProjectsMonthModalButton} from './controls/CreateProjectsMonthModal';
import {IFeature} from '../controls/feature/feature-models';
import {ListFilters} from '../controls/table/table-models';
import {t} from '../utils';
import {useDocumentTitle} from '../hooks/useDocumentTitle';


import './project-month-list/project-month-list.scss';

/** Resolve ProjectModel _ids to their corresponding models */
function projectMonthResolve(prj: ProjectMonthModel, state: ConfacState): FullProjectMonthModel {
  const project = state.projects.find(p => p._id === prj.projectId) as ProjectModel;
  const consultant = state.consultants.find(c => c._id === project.consultantId) as ConsultantModel;
  const client = project.client && state.clients.find(c => c._id === project.client.clientId) as ClientModel;
  const partner = project.partner && state.clients.find(c => project.partner && c._id === project.partner.clientId);
  const invoice = state.invoices.find(i => i.projectId === prj._id);

  return {
    _id: prj._id,
    details: prj,
    project,
    consultant,
    client,
    partner,
    invoice,
  };
}



/** The Monthly Invoicing Table */
export const ProjectMonthsLists = () => {
  useDocumentTitle('projectMonthsList');

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
        <ProjectMonthsList feature={f} />
        {uniqueMonths.length - 1 !== index && <hr className="list-separator" />}
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




type ProjectMonthsListProps = {
  feature: IFeature<FullProjectMonthModel, ListFilters>;
}


/** Display a title and a ProjectMonth list */
const ProjectMonthsList = ({feature}: ProjectMonthsListProps) => {
  if (!feature.list.data.length) {
    return null;
  }

  const model = feature.list.data[0];
  let month = model.details.month.format('MMMM');
  month = month.charAt(0).toUpperCase() + month.slice(1);
  month = t('projectMonth.listTitle', {month, year: model.details.month.year()});

  return (
    <>
      <h2>{month}</h2>
      <List feature={feature} />
    </>
  );
};
