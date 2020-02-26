import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container} from 'react-bootstrap';
import {ConfacState} from '../../reducers/app-state';
import {updateAppFilters, patchProjectsMonth, projectsMonthOverviewUpload, deleteProjectsMonthOverview} from '../../actions';
import {ListPageHeader} from '../controls/table/ListPage';
import {projectMonthFeature, ProjectMonthFeatureBuilderConfig} from './models/getProjectMonthFeature';
import {ProjectMonthModel, FullProjectMonthModel, ProjectMonthOverviewModel} from './models/ProjectMonthModel';
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
import {getDownloadUrl} from '../../actions/utils/download-helpers';
import {AdvancedAttachmentDropzone} from '../controls/attachments/AdvancedAttachmentDropzone';

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
  const projectsMonthOverviews = useSelector((state: ConfacState) => state.projectsMonthOverviews);
  const dispatch = useDispatch();

  if (!feature.list.data.length) {
    return null;
  }

  const displayMonthWithYear = () => {
    const {month: date} = feature.list.data[0].details;
    const formattedMonth = date.format('MMMM').charAt(0).toUpperCase() + date.format('MMMM').substring(1);
    return t('projectMonth.listTitle', {month: formattedMonth, year: date.year()});
  };

  const createMonthId = () => {
    const {month: date} = feature.list.data[0].details;
    const monthYearFormat = date.format('MMYYYY');
    return monthYearFormat;
  };

  const getProjectsMonthOverview = () => {
    const monthId = createMonthId();
    return projectsMonthOverviews.find(p => p.monthId === monthId);
  };

  const projectsMonthOverview = getProjectsMonthOverview();

  const createDownloadUrl = (downloadType: 'download' | 'preview') => {
    if (!projectsMonthOverview) return '';
    const {_id, fileDetails} = projectsMonthOverview;
    return getDownloadUrl('project_month_overview', _id, fileDetails.type, fileDetails.fileName, downloadType);
  };

  return (
    <>
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
        <h2 style={{marginRight: '20px', marginBottom: 0}}>{displayMonthWithYear()}</h2>
        <AdvancedAttachmentDropzone
          attachment={projectsMonthOverview && projectsMonthOverview.fileDetails}
          onUpload={(f: File) => dispatch(projectsMonthOverviewUpload(f, createMonthId()))}
          onDelete={() => (projectsMonthOverview ? dispatch(deleteProjectsMonthOverview(projectsMonthOverview._id)) : null)}
          downloadUrl={createDownloadUrl}
          dropzoneText={t('projectMonth.sdWorxTimesheetUpload')}
        />
      </div>
      <List feature={feature} />
    </>
  );
};
