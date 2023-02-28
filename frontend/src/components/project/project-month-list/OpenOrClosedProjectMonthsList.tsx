import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConfacState } from '../../../reducers/app-state';
import { updateAppFilters } from '../../../actions';
import { Features } from '../../controls/feature/feature-models';
import { ProjectMonthListCollapsed } from './closed-list/ProjectMonthListCollapsed';
import { OpenedProjectMonthsList } from "./open-list/OpenedProjectMonthsList";

type OpenOrClosedProjectMonthsListProps = {
  /** Format: YYYY-MM */
  month: string;
  /**
   * Performance optimalization
   * First table displays the search toolbar
   **/
  showToolbar: boolean;
};


export const OpenOrClosedProjectMonthsList = ({ month, showToolbar }: OpenOrClosedProjectMonthsListProps) => {
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
          openMonths: { ...filters.openMonths, [month]: true }
        };
        dispatch(updateAppFilters(Features.projectMonths, newFilter));
      }} />
  );
};
