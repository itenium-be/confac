import React from 'react';
import {IFeature} from '../../controls/feature/feature-models';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {ProjectMonthListFilters} from '../../controls/table/table-models';
import {List} from '../../controls/table/List';
import {ProjectMonthListCollapsed} from './toolbar/ProjectMonthListCollapsed';
import { OpenedProjectsMonthsListToolbar } from './toolbar/OpenedProjectsMonthsListToolbar';


type OpenedProjectMonthsListProps = {
  feature: IFeature<FullProjectMonthModel, ProjectMonthListFilters>;
  month: string;
}

// PERF: File 3: Unlike you'd expect, the OpenedProjectMonthsList can be Opened OR Closed 😃
export const OpenedProjectMonthsList = ({feature, month}: OpenedProjectMonthsListProps) => {
  // --> The first commit is reworking the way the openMonths work: Array-->Object
  if (!feature.list.data.length || !feature.list.filter) {
    return null;
  }

  const filter = feature.list.filter;
  // PERF: The openMonths (string[]) filter is used here and the data is in the `feature` variable
  // PERF: We are rerendering everything whenever the filters change
  if (filter.state.openMonths.includes(month.toString())) {
    const onClose = () => filter.updateFilter({...filter.state, openMonths: filter.state.openMonths.filter(open => open !== month)});
    return (
      <>
        <OpenedProjectsMonthsListToolbar feature={feature} onClose={onClose} />
        {/* // PERF: Rendering the list with the feature */}
        <List feature={feature} />
        <hr className="list-separator" />
      </>
    );
  }

  return <ProjectMonthListCollapsed feature={feature} onOpen={() => filter.updateFilter({...filter.state, openMonths: filter.state.openMonths.concat([month])})} />;
};
