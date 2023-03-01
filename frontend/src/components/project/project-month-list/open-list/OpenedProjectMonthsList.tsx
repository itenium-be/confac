import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAppFilters, patchProjectsMonth } from '../../../../actions';
import { ListPageHeader } from '../../../controls/table/ListPage';
import { projectMonthFeature, ProjectMonthFeatureBuilderConfig } from '../../models/getProjectMonthFeature';
import { LinkToButton } from '../../../controls/form-controls/button/LinkToButton';
import { CreateProjectsMonthModalButton } from '../../controls/CreateProjectsMonthModal';
import { Features } from '../../../controls/feature/feature-models';
import { Claim } from '../../../users/models/UserModel';
import { OpenedProjectsMonthsListToolbar } from './OpenedProjectsMonthsListToolbar';
import { List } from '../../../controls/table/List';
import { createFullProjectMonthsSelector } from '../createFullProjectMonthsSelector';


type OpenedProjectMonthsListProps = {
  month: string;
  showToolbar: boolean;
};

const dumyFilters = {
  freeText: '',
  showInactive: false,
  openMonths: {},
  unverifiedOnly: false,
}


/** A full open ProjectMonth with header + table */
export const OpenedProjectMonthsList = ({ month, showToolbar }: OpenedProjectMonthsListProps) => {
  const dispatch = useDispatch();
  const selectProjectMonths = useMemo(createFullProjectMonthsSelector, []);
  const projectMonths = useSelector((state) => selectProjectMonths(state, month));

  // const filters = useSelector((state: ConfacState) => state.app.filters.projectMonths.openMonths[month]);
  const config: ProjectMonthFeatureBuilderConfig = {
    data: projectMonths,
    save: m => dispatch(patchProjectsMonth(m.details) as any),
    filters: dumyFilters, // TODO: do need the non-openMonths filters here!
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

  // TODO: bug: ListPageHeader now only displays when the first month is open
  return (
    <>
      {showToolbar && <ListPageHeader feature={feature} topToolbar={topToolbar} />}
      <OpenedProjectsMonthsListToolbar feature={feature} />
      <List feature={feature} />
      <hr className="list-separator" />
    </>
  );
};
