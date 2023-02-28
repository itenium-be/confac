import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container} from 'react-bootstrap';
import {ConfacState, ProjectMonthsListFilterOpenMonthsFormat} from '../../reducers/app-state';
import {updateAppFilters, patchProjectsMonth} from '../../actions';
import {ListPageHeader} from '../controls/table/ListPage';
import {projectMonthFeature, ProjectMonthFeatureBuilderConfig} from './models/getProjectMonthFeature';
import {FullProjectMonthModel} from './models/FullProjectMonthModel';
import {LinkToButton} from '../controls/form-controls/button/LinkToButton';
import {CreateProjectsMonthModalButton} from './controls/CreateProjectsMonthModal';
import {Features} from '../controls/feature/feature-models';
import {t} from '../utils';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {Claim} from '../users/models/UserModel';
import {mapToProjectMonth} from '../hooks/useProjects';


import './project-month-list/project-month-list.scss';
import { ProjectMonthListCollapsed } from './project-month-list/toolbar/ProjectMonthListCollapsed';
import { OpenedProjectsMonthsListToolbar } from './project-month-list/toolbar/OpenedProjectsMonthsListToolbar';
import { List } from '../controls/table/List';
import moment from 'moment';


export const displayMonthWithYear = (month: moment.Moment) => {
  const formattedMonth = month.format('MMMM').charAt(0).toUpperCase() + month.format('MMMM').substring(1);
  return t('projectMonth.listTitle', {month: formattedMonth, year: month.year()});
};



/** The monthly invoicing tables including the top searchbar */
export const ProjectMonthsLists = () => {
  useDocumentTitle('projectMonthsList');

  const projectMonths = useSelector((state: ConfacState) => state.projectsMonth);
  const uniqueMonths = projectMonths
    .map(projectMonth => projectMonth.month.format(ProjectMonthsListFilterOpenMonthsFormat))
    .filter((month, index, arr) => arr.indexOf(month) === index)
    .sort((a, b) => b.localeCompare(a));

  return (
    <Container className={`list list-${Features.projectMonths}`}>
      {uniqueMonths.map((month, index) => <OpenOrClosedProjectMonthsList key={month} month={month} showToolbar={index === 0} />)}
    </Container>
  );
};


type OpenOrClosedProjectMonthsListProps = {
  /** Format: YYYY-MM */
  month: string;
  /**
   * Performance optimalization
   * First table displays the search toolbar
   **/
  showToolbar: boolean;
}


export const OpenOrClosedProjectMonthsList = ({month, showToolbar}: OpenOrClosedProjectMonthsListProps) => {
  const dispatch = useDispatch();
  const filters = useSelector((state: ConfacState) => state.app.filters.projectMonths);
  const isOpen = filters.openMonths[month];

  if (isOpen) {
    return <OpenedProjectMonthsList month={month} showToolbar={showToolbar} />;
  }

  return (
    <ProjectMonthListCollapsed
      month={month}
      onOpen={() => {
        const newFilter = {
          ...filters,
          openMonths: {...filters.openMonths, [month]: true}
        };
        dispatch(updateAppFilters(Features.projectMonths, newFilter));
      }}
    />
  );
};


type OpenedProjectMonthsListProps = {
  month: string;
  showToolbar: boolean;
}

/** A full open ProjectMonth with toolbar + table */
export const OpenedProjectMonthsList = ({month, showToolbar}: OpenedProjectMonthsListProps) => {
  const dispatch = useDispatch();
  const projectMonths = useSelector((state: ConfacState) => state.projectsMonth
    .filter(x => x.month.isSame(moment(month), 'month'))
    .map(x => mapToProjectMonth(state, x))
    .filter(x => x !== null)
  ) as FullProjectMonthModel[];


  const filters = useSelector((state: ConfacState) => state.app.filters.projectMonths);
  const config: ProjectMonthFeatureBuilderConfig = {
    data: projectMonths,
    save: m => dispatch(patchProjectsMonth(m.details) as any),
    filters,
    setFilters: f => dispatch(updateAppFilters(Features.projectMonths, f)),
  };

  const feature = projectMonthFeature(config);
  if (!feature.list.data.length || !feature.list.filter) {
    return null;
  }

  const topToolbar = showToolbar && (
    <>
      <CreateProjectsMonthModalButton />
      <LinkToButton claim={Claim.ViewInvoices} to="/invoices" label="title" size="lg" variant="light" />
    </>
  );


  const filter = feature.list.filter;
  const onClose = () => filter.updateFilter({
    ...filter.state,
    openMonths: {...filter.state.openMonths, [month]: false},
  });

  // TODO: bug: ListPageHeader now only displays when the first month is open
  return (
    <>
      {showToolbar && <ListPageHeader feature={feature} topToolbar={topToolbar} />}
      <OpenedProjectsMonthsListToolbar feature={feature} onClose={onClose} />
      <List feature={feature} />
      <hr className="list-separator" />
    </>
  );
};
