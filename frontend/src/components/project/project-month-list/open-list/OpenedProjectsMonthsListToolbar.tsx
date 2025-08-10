import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import {isHoliday} from '@itenium/date-holidays-be';
import {IFeature} from '../../../controls/feature/feature-models';
import {FullProjectMonthModel} from '../../models/FullProjectMonthModel';
import {ProjectMonthListFilters} from '../../../controls/table/table-models';
import {ConfacState} from '../../../../reducers/app-state';
import {getDownloadUrl} from '../../../../actions/utils/download-helpers';
import {displayMonthWithYear} from '../project-month-utils';
import {AdvancedAttachmentDropzone} from '../../../controls/attachments/AdvancedAttachmentDropzone';
import {projectsMonthOverviewUpload, deleteProjectsMonthOverview, downloadProjectsMonthsExcel} from '../../../../actions';
import {t} from '../../../utils';
import {Claim} from '../../../users/models/UserModel';
import {ToggleProjectMonthButton} from '../ToggleProjectMonthButton';
import {Button} from '../../../controls/form-controls/Button';
import {useProjects} from '../../../hooks/useProjects';
import {getFullTariffs, getProjectMarkup} from '../../utils/getTariffs';
import {IProjectModel} from '../../models/IProjectModel';

type OpenedProjectsMonthsListToolbarProps = {
  feature: IFeature<FullProjectMonthModel, ProjectMonthListFilters>;
};


/**
 * Display the toolbar when a ProjectMonth is open:
 * - Button to close it
 * - Timesheet check dropzone
 **/
export const OpenedProjectsMonthsListToolbar = ({feature}: OpenedProjectsMonthsListToolbarProps) => {
  const projectsMonthOverviews = useSelector((state: ConfacState) => state.projectsMonthOverviews);
  const dispatch = useDispatch();
  const projects = useProjects();

  if (!feature.list.data.length) {
    return null;
  }

  const projectsMonthDetails = feature.list.data[0].details;
  const projectsMonthOverview = projectsMonthOverviews
    .find(pmo => moment(pmo.month).valueOf() === projectsMonthDetails.month.valueOf());

  const createDownloadUrl = (downloadType: 'download' | 'preview') => {
    if (!projectsMonthOverview)
      return '';

    const {_id, fileDetails} = projectsMonthOverview;
    return getDownloadUrl('project_month_overview', _id, fileDetails.type, fileDetails.fileName, downloadType);
  };

  const downloadExcel = () => {
    const projectDetails = projects.filter(proj => proj.active).sort((a, b) => a.consultantName.localeCompare(b.consultantName)).map(proj => {
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
        ecCost: proj.details.ecCost,
        month: projectsMonthDetails.month.format('MMMM YYYY'),
        daysInContract: daysUnderContractInMonth(projectsMonthDetails.month, proj.details),
        fictiveMarginDay: (clientTariff?.dailyRate ?? 0) - (proj.details.ecCost ?? 0),
      };
    });
    const mappedData = projectDetails.map(Object.values);
    dispatch(downloadProjectsMonthsExcel(mappedData, projectsMonthDetails.month.format('YYYY-MM')) as any);
  };

  const allTimesheetsValidated = feature.list.data.every(x => x.details.timesheet.validated);
  return (
    <div className="projectMonths-toolbar">
      <ToggleProjectMonthButton month={projectsMonthDetails.month.format('YYYY-MM')} toggleOpen={false} />
      <h2>{displayMonthWithYear(projectsMonthDetails.month)}</h2>
      {!allTimesheetsValidated && (
        <AdvancedAttachmentDropzone
          attachment={projectsMonthOverview && projectsMonthOverview.fileDetails}
          onUpload={(f: File) => dispatch(projectsMonthOverviewUpload(f, projectsMonthDetails.month) as any)}
          onDelete={() => (projectsMonthOverview ? dispatch(deleteProjectsMonthOverview(projectsMonthOverview._id) as any) : null)}
          downloadUrl={createDownloadUrl}
          dropzonePlaceholderText={t('projectMonth.sdWorxTimesheetUpload')}
          viewFileTooltip={t('projectMonth.timesheetCheckDownloadTooltip')}
          claim={Claim.EditProjectMonth}
        />
      )}
      <Button
        variant="light"
        onClick={downloadExcel}
        title={t('projectMonth.listDownloadExcel')}
        icon="fa fa-file-excel"
        className="tst-download-excel"
      />
    </div>
  );
};


function daysUnderContractInMonth(month: moment.Moment, details: IProjectModel): number {
  const monthStart = moment(month).startOf('month');
  const monthEnd = moment(monthStart).endOf('month');

  const effectiveStart = moment.max(details.startDate, monthStart);
  const effectiveEnd = details.endDate ? moment.min(details.endDate, monthEnd) : monthEnd;


  if (effectiveStart.isAfter(effectiveEnd)) {
    return 0;
  }

  const result: Date[] = [];
  const date = new Date(effectiveStart.year(), effectiveStart.month(), effectiveStart.date());
  const endDate = effectiveEnd.toDate();

  while (date <= endDate) {
    // date.getDay = index of ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    if (date.getDay() !== 0 && date.getDay() !== 6 && !isHoliday(date)) {
      result.push(new Date(date));
    }
    date.setDate(date.getDate() + 1);
  }

  return result.length;
}
