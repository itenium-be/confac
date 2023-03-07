import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { ConfacState } from '../../../../reducers/app-state';
import { updateAppFilters, patchProjectsMonth } from '../../../../actions';
import { ListPageHeader } from '../../../controls/table/ListPage';
import { projectMonthFeature, ProjectMonthFeatureBuilderConfig } from '../../models/getProjectMonthFeature';
import { FullProjectMonthModel } from '../../models/FullProjectMonthModel';
import { LinkToButton } from '../../../controls/form-controls/button/LinkToButton';
import { CreateProjectsMonthModalButton } from '../../controls/CreateProjectsMonthModal';
import { Features } from '../../../controls/feature/feature-models';
import { Claim } from '../../../users/models/UserModel';
import { mapToProjectMonth } from '../../../hooks/useProjects';
import { OpenedProjectsMonthsListToolbar } from './OpenedProjectsMonthsListToolbar';
import { List } from '../../../controls/table/List';

type OpenedProjectMonthsListProps = {
  month: string;
  showToolbar: boolean;
};


/** A full open ProjectMonth with toolbar + table */
export const OpenedProjectMonthsList = ({ month, showToolbar }: OpenedProjectMonthsListProps) => {
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
    openMonths: { ...filter.state.openMonths, [month]: false },
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
