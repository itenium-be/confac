import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container} from 'react-bootstrap';
import {ConfacState, ProjectMonthsListFilterOpenMonthsFormat} from '../../reducers/app-state';
import {updateAppFilters, patchProjectsMonth} from '../../actions';
import {ListPageHeader} from '../controls/table/ListPage';
import {projectMonthFeature, ProjectMonthFeatureBuilderConfig} from './models/getProjectMonthFeature';
import {FullProjectMonthModel} from './models/FullProjectMonthModel';
import {ProjectMonthModel} from './models/ProjectMonthModel';
import {LinkToButton} from '../controls/form-controls/button/LinkToButton';
import {CreateProjectsMonthModalButton} from './controls/CreateProjectsMonthModal';
import {Features, IFeature} from '../controls/feature/feature-models';
import {ProjectMonthListFilters} from '../controls/table/table-models';
import {t} from '../utils';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {OpenedProjectMonthsList} from './project-month-list/OpenedProjectMonthsList';
import {Claim} from '../users/models/UserModel';
import {useProjectsMonths} from '../hooks/useProjects';


import './project-month-list/project-month-list.scss';


export const displayMonthWithYear = (projectsMonthDetails: ProjectMonthModel) => {
  const {month: date} = projectsMonthDetails;
  const formattedMonth = date.format('MMMM').charAt(0).toUpperCase() + date.format('MMMM').substring(1);
  return t('projectMonth.listTitle', {month: formattedMonth, year: date.year()});
};



/** The Monthly Invoicing Table */
export const ProjectMonthsLists = () => {
  useDocumentTitle('projectMonthsList');

  const dispatch = useDispatch();
  const configData = useProjectsMonths();
  const filters = useSelector((state: ConfacState) => state.app.filters.projectMonths);

  const config: ProjectMonthFeatureBuilderConfig = {
    data: configData,
    save: m => dispatch(patchProjectsMonth(m.details) as any),
    filters,
    setFilters: f => dispatch(updateAppFilters(Features.projectMonths, f)),
  };

  const topToolbar = (
    <>
      <CreateProjectsMonthModalButton />
      <LinkToButton claim={Claim.ViewInvoices} to="/invoices" label="title" size="lg" variant="light" />
    </>
  );



  const feature = projectMonthFeature(config);


  const getKey = (x: FullProjectMonthModel): string => x.details.month.format(ProjectMonthsListFilterOpenMonthsFormat);
  const uniqueMonths = feature.list.data
    .map(getKey)
    .filter((month, index, arr) => arr.indexOf(month) === index)
    .sort((a, b) => b.localeCompare(a));


  const features = uniqueMonths.map((month, index) => {
    const f: IFeature<FullProjectMonthModel, ProjectMonthListFilters> = {
      ...feature,
      list: {
        ...feature.list,
        data: feature.list.data.filter(x => getKey(x) === month),
      },
    };

    return (
      <div key={month}>
        <OpenedProjectMonthsList feature={f} month={month} />
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
