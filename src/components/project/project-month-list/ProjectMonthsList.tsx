import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import {IFeature} from '../../controls/feature/feature-models';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {ProjectMonthListFilters} from '../../controls/table/table-models';
import {ConfacState} from '../../../reducers/app-state';
import {getDownloadUrl} from '../../../actions/utils/download-helpers';
import {displayMonthWithYear} from '../ProjectMonthsLists';
import {AdvancedAttachmentDropzone} from '../../controls/attachments/AdvancedAttachmentDropzone';
import {projectsMonthOverviewUpload, deleteProjectsMonthOverview} from '../../../actions';
import {t} from '../../utils';
import {List} from '../../controls/table/List';
import {ProjectMonthListCollapsed} from './ProjectMonthListCollapsed';
import {Button} from '../../controls/form-controls/Button';
import {Claim} from '../../users/models/UserModel';


type CollapsibleProjectMonthsListProps = {
  feature: IFeature<FullProjectMonthModel, ProjectMonthListFilters>;
  month: string;
}


export const CollapsibleProjectMonthsList = ({feature, month}: CollapsibleProjectMonthsListProps) => {
  if (!feature.list.data.length || !feature.list.filter) {
    return null;
  }

  const filter = feature.list.filter;
  if (filter.state.openMonths.includes(month.toString())) {
    const onClose = () => filter.updateFilter({...filter.state, openMonths: filter.state.openMonths.filter(open => open !== month)});
    return (
      <div>
        <ProjectMonthsListToolbar feature={feature} onClose={onClose} />
        <List feature={feature} />
        <hr className="list-separator" />
      </div>
    );
  }

  return <ProjectMonthListCollapsed feature={feature} onOpen={() => filter.updateFilter({...filter.state, openMonths: filter.state.openMonths.concat([month])})} />;
};




type ProjectMonthsListToolbarProps = {
  feature: IFeature<FullProjectMonthModel, ProjectMonthListFilters>;
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
            claim={Claim.EditProjectMonth}
          />
        )}
      </div>
    </>
  );
};
