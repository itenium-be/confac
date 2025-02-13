import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAppFilters, patchProjectsMonth } from '../../../../actions';
import { projectMonthFeature, ProjectMonthFeatureBuilderConfig } from '../../models/getProjectMonthFeature';
import { Features } from '../../../controls/feature/feature-models';
import { OpenedProjectsMonthsListToolbar } from './OpenedProjectsMonthsListToolbar';
import { List } from '../../../controls/table/List';
import { createFullProjectMonthsSelector } from '../createFullProjectMonthsSelector';
import { ConfacState } from '../../../../reducers/app-state';
import { createSelector } from 'reselect';
import { ProjectMonthListFilters } from '../../../controls/table/table-models';


type OpenedProjectMonthsListProps = {
  month: string;
};

const selectProjectMonthsFilters = (state: ConfacState) => state.app.filters.projectMonths;


type FiltersModel = Omit<ProjectMonthListFilters, 'projectMonths'>;


const createFiltersSelector = () => createSelector(
  selectProjectMonthsFilters,
  (filters) => {
    const safeFilters: FiltersModel = {
      ...filters,
    }
    return safeFilters;
  }, {
    // New in 4.1: Pass options through to the built-in `defaultMemoize` function
    memoizeOptions: {
      // TODO: need to update for new filters here! use deep-equal instead.
      // --> or better, the feature has the filter method there!
      equalityCheck: (a: FiltersModel, b: FiltersModel) => a.freeText === b.freeText && a.unverifiedOnly === b.unverifiedOnly &&
        a.sort?.columnName === b.sort?.columnName && a.sort?.direction === b.sort?.direction,
      // maxSize: 10,
      // resultEqualityCheck: shallowEqual
    }
  }
);



/** A full open ProjectMonth with header + table */
export const OpenedProjectMonthsList = ({ month }: OpenedProjectMonthsListProps) => {
  const dispatch = useDispatch();
  const selectProjectMonths = useMemo(createFullProjectMonthsSelector, []);
  const projectMonths = useSelector((state) => selectProjectMonths(state, month));
  const selectFilters = useMemo(createFiltersSelector, []);
  const filters = useSelector((state: ConfacState) => selectFilters(state));

  const config: ProjectMonthFeatureBuilderConfig = {
    data: projectMonths,
    save: m => dispatch(patchProjectsMonth(m.details) as any),
    filters: filters,
    setFilters: f => dispatch(updateAppFilters(Features.projectMonths, f)),
  };

  const feature = projectMonthFeature(config);
  if (!feature.list.data.length || !feature.list.filter) {
    return null;
  }

  return (
    <>
      <OpenedProjectsMonthsListToolbar feature={feature} />
      <List feature={feature} />
      <hr className="list-separator" />
    </>
  );
};
