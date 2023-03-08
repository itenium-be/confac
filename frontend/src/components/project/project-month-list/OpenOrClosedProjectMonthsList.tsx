import React from 'react';
import { useSelector } from 'react-redux';
import { ConfacState } from '../../../reducers/app-state';
import { ProjectMonthListCollapsed } from './closed-list/ProjectMonthListCollapsed';
import { OpenedProjectMonthsList } from './open-list/OpenedProjectMonthsList';

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
  const isOpen = useSelector((state: ConfacState) => state.app.filters.projectMonths.openMonths[month]);
  if (isOpen) {
    return <OpenedProjectMonthsList month={month} showToolbar={showToolbar} />;
  }

  return <ProjectMonthListCollapsed month={month} />;
};
