import { useSelector } from 'react-redux';
import { ConfacState } from '../../../reducers/app-state';
import { ProjectMonthListCollapsed } from './closed-list/ProjectMonthListCollapsed';
import { OpenedProjectMonthsList } from './open-list/OpenedProjectMonthsList';

type OpenOrClosedProjectMonthsListProps = {
  /** Format: YYYY-MM */
  month: string;
};


export const OpenOrClosedProjectMonthsList = ({ month }: OpenOrClosedProjectMonthsListProps) => {
  const isOpen = useSelector((state: ConfacState) => state.app.filters.projectMonths.openMonths[month]);
  if (isOpen) {
    return <OpenedProjectMonthsList month={month} />;
  }

  return <ProjectMonthListCollapsed month={month} />
};
