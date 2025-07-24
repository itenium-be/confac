import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router';
import {ConfacState} from '../../reducers/app-state';
import {downloadProjectsExcel, saveProject, updateAppFilters} from '../../actions';
import {ListPage} from '../controls/table/ListPage';
import {projectFeature, ProjectFeatureBuilderConfig} from './models/getProjectFeature';
import {LinkToButton} from '../controls/form-controls/button/LinkToButton';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {Claim} from '../users/models/UserModel';
import {useProjects} from '../hooks/useProjects';
import {Features} from '../controls/feature/feature-models';
import {t} from '../utils';
import {Button} from '../controls/form-controls/Button';
import {getFullTariffs, getProjectMarkup} from './utils/getTariffs';


import './ProjectsList.scss';


export const ProjectsList = () => {
  useDocumentTitle('projectList');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useProjects();
  const projectFilters = useSelector((state: ConfacState) => state.app.filters.projects);

  const config: ProjectFeatureBuilderConfig = {
    data: projects,
    save: m => dispatch(saveProject(m.details, navigate) as any),
    filters: projectFilters,
    setFilters: f => dispatch(updateAppFilters(Features.projects, f)),
  };

  const downloadExcel = () => {
    const projectDetails = projects.filter(proj => proj.active).map(proj => {
      const markup = getProjectMarkup({project: proj.details, client: proj.client});
      const partnerTariff = getFullTariffs(proj, 'partner');
      const clientTariff = getFullTariffs(proj, 'client');
      return {
        consultant: proj.consultantName,
        consultantType: proj.consultant.type,
        startDate: proj.details.startDate.format('YYYY-MM-DD'),
        endDate: proj.details.endDate && proj.details.endDate.format('YYYY-MM-DD'),
        partner: proj.partner?.name,
        partnerHourly: partnerTariff?.hourlyRate,
        partnerDaily: partnerTariff?.dailyRate,
        client: proj.client.name,
        clientHourly: clientTariff?.hourlyRate,
        clientDaily: clientTariff?.dailyRate,
        margin: markup.amount,
        marginPercentage: markup.percentage.toFixed(0) + '%',
        endCustomer: proj.endCustomer?.name,
        accountManager: proj.accountManager ? `${proj.accountManager.firstName} ${proj.accountManager.name}` : undefined,
        contractFramework: proj.client.frameworkAgreement?.status,
        contractProject: proj.details.contract?.status,
      };
    });
    const mappedData = projectDetails.map(Object.values);
    dispatch(downloadProjectsExcel(mappedData) as any);
  };

  const TopToolbar = (
    <>
      <Button
        variant="light"
        onClick={downloadExcel}
        title={t('project.listDownloadExcel')}
        icon="fa fa-file-excel"
        className="tst-download-excel"
      />
      <LinkToButton claim={Claim.ViewConsultants} to="/consultants/projects" label="project.contractCheck" />
      <LinkToButton claim={Claim.ViewConsultants} to="/consultants" label="consultant.title" data-testid="consultants" />
    </>
  );

  const feature = projectFeature(config);
  return <ListPage feature={feature} topToolbar={TopToolbar} />;
};
