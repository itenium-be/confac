import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import {IFeature} from '../../../controls/feature/feature-models';
import {FullProjectMonthModel} from '../../models/FullProjectMonthModel';
import {ProjectMonthListFilters} from '../../../controls/table/table-models';
import {ConfacState} from '../../../../reducers/app-state';
import {getDownloadUrl} from '../../../../actions/utils/download-helpers';
import {displayMonthWithYear} from '../project-month-utils';
import {AdvancedAttachmentDropzone} from '../../../controls/attachments/AdvancedAttachmentDropzone';
import {projectsMonthOverviewUpload, deleteProjectsMonthOverview} from '../../../../actions';
import {t} from '../../../utils';
import {Claim} from '../../../users/models/UserModel';
import {ToggleProjectMonthButton} from '../ToggleProjectMonthButton';

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
    </div>
  );
};
