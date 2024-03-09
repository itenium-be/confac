import { useDispatch, useSelector } from 'react-redux';
import { updateAppFilters, patchProjectsMonth } from '../../../../actions';
import { projectMonthFeature, ProjectMonthFeatureBuilderConfig } from '../../models/getProjectMonthFeature';
import { Features } from '../../../controls/feature/feature-models';
import { OpenedProjectsMonthsListToolbar } from './OpenedProjectsMonthsListToolbar';
import { List } from '../../../controls/table/List';
import { ConfacState } from '../../../../reducers/app-state';
import { useProjectsMonths } from '../../../hooks/useProjects';


type OpenedProjectMonthsListProps = {
  month: string;
};

/** A full open ProjectMonth with header + table */
export const OpenedProjectMonthsList = ({ month }: OpenedProjectMonthsListProps) => {
  const dispatch = useDispatch();
  const filters = useSelector((state: ConfacState) => state.app.filters.projectMonths);
  const allProjectMonths = useProjectsMonths();
  const projectMonths = allProjectMonths.filter(x => x.details.month.format('YYYY-MM') === month)

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
