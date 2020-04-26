import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import {IFeature} from '../../controls/feature/feature-models';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {ListFilters} from '../../controls/table/table-models';
import {ConfacState} from '../../../reducers/app-state';
import {getDownloadUrl} from '../../../actions/utils/download-helpers';
import {displayMonthWithYear} from '../ProjectMonthsLists';
import {AdvancedAttachmentDropzone} from '../../controls/attachments/AdvancedAttachmentDropzone';
import {projectsMonthOverviewUpload, deleteProjectsMonthOverview} from '../../../actions';
import {t} from '../../utils';
import {List} from '../../controls/table/List';
import {ProjectMonthListCollapsed} from './ProjectMonthListCollapsed';
import {Button} from '../../controls/form-controls/Button';


type CollapsibleProjectMonthsListProps = {
  feature: IFeature<FullProjectMonthModel, ListFilters>;
  /** Should the List be open by default */
  defaultOpen: boolean;
}


export const CollapsibleProjectMonthsList = ({feature, defaultOpen}: CollapsibleProjectMonthsListProps) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  if (!feature.list.data.length) {
    return null;
  }

  if (open) {
    return (
      <div>
        <ProjectMonthsListToolbar feature={feature} onClose={() => setOpen(false)} />
        <List feature={feature} />
        <hr className="list-separator" />
      </div>
    );
  }

  return <ProjectMonthListCollapsed feature={feature} onOpen={() => setOpen(true)} />;
};




type ProjectMonthsListToolbarProps = {
  feature: IFeature<FullProjectMonthModel, ListFilters>;
  onClose: () => void;
}


/** Display a Toolbar and ProjectMonth list */
export const ProjectMonthsListToolbar = ({feature, onClose}: ProjectMonthsListToolbarProps) => {
  const projectsMonthOverviews = useSelector((state: ConfacState) => state.projectsMonthOverviews);
  const dispatch = useDispatch();

  if (!feature.list.data.length) {
    return null;
  }

  const projectsMonthDetails = feature.list.data[0].details;
  const projectsMonthOverview = projectsMonthOverviews
    .find(pmo => moment(pmo.month).valueOf() === projectsMonthDetails.month.valueOf());

  const createDownloadUrl = (downloadType: 'download' | 'preview') => {
    if (!projectsMonthOverview) return '';
    const {_id, fileDetails} = projectsMonthOverview;
    return getDownloadUrl('project_month_overview', _id, fileDetails.type, fileDetails.fileName, downloadType);
  };

  const allTimesheetsValidated = feature.list.data.every(x => x.details.timesheet.validated);
  return (
    <>
      <div className="projectMonths-toolbar">
        <Button onClick={onClose} icon="fa fa-toggle-on" variant="outline-info">
          {t('projectMonth.list.closeList')}
        </Button>
        <h2>{displayMonthWithYear(projectsMonthDetails)}</h2>
        {!allTimesheetsValidated && (
          <AdvancedAttachmentDropzone
            attachment={projectsMonthOverview && projectsMonthOverview.fileDetails}
            onUpload={(f: File) => dispatch(projectsMonthOverviewUpload(f, projectsMonthDetails.month))}
            onDelete={() => (projectsMonthOverview ? dispatch(deleteProjectsMonthOverview(projectsMonthOverview._id)) : null)}
            downloadUrl={createDownloadUrl}
            dropzonePlaceholderText={t('projectMonth.sdWorxTimesheetUpload')}
            viewFileTooltip={t('projectMonth.timesheetCheckDownloadTooltip')}
          />
        )}
      </div>
    </>
  );
};
