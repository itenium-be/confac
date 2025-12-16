import {useDispatch, useSelector} from 'react-redux';
import {updateAppFilters, patchProjectsMonth} from '../../../actions';
import {ListPageHeader} from '../../controls/table/ListPage';
import {projectMonthFeature, ProjectMonthFeatureBuilderConfig} from '../models/getProjectMonthFeature';
import {LinkToButton} from '../../controls/form-controls/button/LinkToButton';
import {CreateProjectsMonthModalButton} from '../controls/CreateProjectsMonthModal';
import {Features} from '../../controls/feature/feature-models';
import {Claim} from '../../users/models/UserModel';
import {ConfacState} from '../../../reducers/app-state';
import {FreelancerOverviewDownloadButton} from '../FreelancerOverview/FreelancerOverviewDownloadButton';


/** The top ProjectMonth page toolbar */
export const ProjectMonthsListToolbar = () => {
  const dispatch = useDispatch();
  const projectMonths = [];

  const filters = useSelector((state: ConfacState) => state.app.filters.projectMonths);
  const config: ProjectMonthFeatureBuilderConfig = {
    data: projectMonths,
    save: m => dispatch(patchProjectsMonth(m.details) as any),
    filters: filters,
    setFilters: f => dispatch(updateAppFilters(Features.projectMonths, f)),
  };

  const feature = projectMonthFeature(config);
  if (!feature.list.filter) {
    return null;
  }

  const topToolbar = (
    <>
      <FreelancerOverviewDownloadButton />
      <CreateProjectsMonthModalButton />
      <LinkToButton claim={Claim.ViewProjectMonth} to="/inbound-invoices" label="inboundInvoices.title" size="lg" variant="light" />
      <LinkToButton claim={Claim.ViewInvoices} to="/invoices" label="title" size="lg" variant="light" />
    </>
  );

  return <ListPageHeader feature={feature} topToolbar={topToolbar} />;
};
