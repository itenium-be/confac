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

/** A full open ProjectMonth with toolbar + table */
export const OpenedProjectMonthsList = ({feature, month}: OpenedProjectMonthsListProps) => {
  if (!feature.list.data.length || !feature.list.filter) {
    return null;
  }

  const filter = feature.list.filter;
  if (filter.state.openMonths.includes(month.toString())) {
    const onClose = () => filter.updateFilter({...filter.state, openMonths: filter.state.openMonths.filter(open => open !== month)});
    return (
      <>
        <OpenedProjectsMonthsListToolbar feature={feature} onClose={onClose} />
        <List feature={feature} />
        <hr className="list-separator" />
      </>
    );
  }

  return <ProjectMonthListCollapsed feature={feature} onOpen={() => filter.updateFilter({...filter.state, openMonths: filter.state.openMonths.concat([month])})} />;
};
