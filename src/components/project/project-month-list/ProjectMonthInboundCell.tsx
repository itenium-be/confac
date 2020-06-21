import React from 'react';
import {ButtonGroup as ReactButtonGroup} from 'react-bootstrap';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import cn from 'classnames';
import {ProjectMonthInbound, ProjectMonthInboundStatus} from '../models/ProjectMonthModel';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {StringInput} from '../../controls/form-controls/inputs/StringInput';
import {getNewProjectMonthInbound} from '../models/getNewProject';
import {moneyFormat, t} from '../../utils';
import {DatePicker} from '../../controls/form-controls/DatePicker';
import {Button} from '../../controls/form-controls/Button';
import {patchProjectsMonth, projectMonthUpload} from '../../../actions';
import {useDebouncedSave} from '../../hooks/useDebounce';
import {getDownloadUrl} from '../../../actions/utils/download-helpers';
import {ConfacState} from '../../../reducers/app-state';
import {AttachmentUploadPreviewButtons} from '../controls/AttachmentUploadPreviewButtons';
import {InboundInvoiceAttachmentType} from '../../../models';
import {getTariffs} from '../models/ProjectModel';
import {ToClipboardLabel} from '../../controls/other/ToClipboardLabel';
import {EnhanceWithClaim} from '../../enhancers/EnhanceWithClaim';
import {Claim} from '../../users/models/UserModel';

interface ProjectMonthInboundCellProps {
  fullProjectMonth: FullProjectMonthModel;
}


/** Inbound form cell for the ProjectMonth list */
export const ProjectMonthInboundCell = ({fullProjectMonth}: ProjectMonthInboundCellProps) => {
  const dispatch = useDispatch();

  const defaultValue = fullProjectMonth.details.inbound || getNewProjectMonthInbound();
  const dispatcher = (val: ProjectMonthInbound) => {
    dispatch(patchProjectsMonth({...fullProjectMonth.details, inbound: val}));
  };
  const [inbound, setInbound, saveInbound] = useDebouncedSave<ProjectMonthInbound>(defaultValue, dispatcher);


  if (!fullProjectMonth.project.projectMonthConfig.inboundInvoice) {
    return <div />;
  }

  if (fullProjectMonth.details.verified === 'forced') {
    return <div />;
  }

  if (inbound.status === 'paid') {
    return <div />;
  }


  const canEdit = (fullProjectMonth.details.verified || inbound.status !== 'new') ? 'label' : undefined;


  const attachments = fullProjectMonth.invoice ? fullProjectMonth.invoice.attachments : fullProjectMonth.details.attachments;
  const inboundInvoiceDetails = attachments.find(a => a.type === InboundInvoiceAttachmentType);

  const getInboundInvoiceDownloadUrl = (): string => {
    if (!inboundInvoiceDetails) {
      return '';
    }

    if (fullProjectMonth.invoice) {
      return getDownloadUrl('invoice', fullProjectMonth.invoice._id,
        InboundInvoiceAttachmentType, inboundInvoiceDetails.fileName, 'preview');
    }

    const projectMonthId = fullProjectMonth._id;
    return getDownloadUrl('project_month', projectMonthId, InboundInvoiceAttachmentType, inboundInvoiceDetails.fileName, 'preview');
  };

  const hasInboundInvoiceBeenUploaded = !!inboundInvoiceDetails;

  return (
    <div className={cn('inbound-cell')}>
      {canEdit === 'label' ? (
        <ToClipboardLabel label={inbound.nr} />
      ) : (
        <StringInput
          value={inbound.nr}
          onChange={nr => setInbound({...inbound, nr})}
          placeholder={t('projectMonth.inboundInvoiceNr')}
        />
      )}
      <InboundAmountForecast fullProjectMonth={fullProjectMonth} />
      <DatePicker
        value={fullProjectMonth.details.inbound.dateReceived || inbound.dateReceived}
        onChange={dateReceived => setInbound({...inbound, dateReceived})}
        placeholder={t('projectMonth.inboundDateReceived')}
        display={canEdit}
      />
      <div className="inbound-actions">
        <InboundActionButtons
          fullProjectMonth={fullProjectMonth}
          onChange={status => saveInbound({...inbound, status})}
        />
        <div className="inbound-attachment-actions">
          <AttachmentUploadPreviewButtons
            isUploadDisabled={fullProjectMonth.details.inbound.status !== 'new'}
            isPreviewDisabled={!hasInboundInvoiceBeenUploaded}
            uploadTooltip={t('projectMonth.inboundUpload')}
            previewTooltip={t('projectMonth.viewInboundInvoice', {fileName: inboundInvoiceDetails ? inboundInvoiceDetails.fileName : ''})}
            onUpload={f => {
              if (!inbound.dateReceived) {
                setInbound({...inbound, dateReceived: moment()});
              }
              return dispatch(projectMonthUpload(f, InboundInvoiceAttachmentType, fullProjectMonth._id));
            }}
            downloadUrl={getInboundInvoiceDownloadUrl()}
          />
        </div>
      </div>
    </div>
  );
};



type InboundActionButtonsProps = {
  fullProjectMonth: FullProjectMonthModel;
  onChange: (status: ProjectMonthInboundStatus) => void;
}



const ButtonGroup = EnhanceWithClaim(ReactButtonGroup);


/** Switch between statusses for the inbound invoice */
const InboundActionButtons = ({fullProjectMonth, onChange}: InboundActionButtonsProps) => {
  const currentStatus = fullProjectMonth.details.inbound.status;
  return (
    <ButtonGroup claim={Claim.ValidateProjectMonth}>
      <Button
        key="validated"
        variant={currentStatus === 'validated' ? 'success' : 'outline-dark'}
        onClick={() => onChange('validated')}
        title={t('projectMonth.inboundValidated')}
        icon="fa fa-check"
      />
      <Button
        key="paid"
        variant={currentStatus === 'paid' ? 'success' : 'outline-dark'}
        onClick={() => onChange('paid')}
        title={t('projectMonth.inboundPaid')}
        icon="fa fa-coins"
      />
      <Button
        key="new"
        variant={currentStatus === 'new' ? 'success' : 'outline-dark'}
        onClick={() => onChange('new')}
        title={t('projectMonth.inboundNew')}
        icon="fa fa-inbox"
      />
    </ButtonGroup>
  );
};




type InboundAmountForecastProps = {
  fullProjectMonth: FullProjectMonthModel;
}

/** Expected inbound total invoice amount */
const InboundAmountForecast = ({fullProjectMonth}: InboundAmountForecastProps) => {
  const tax = useSelector((state: ConfacState) => state.config.defaultInvoiceLines[0].tax);
  const {timesheet} = fullProjectMonth.details;
  if (!timesheet.timesheet || !fullProjectMonth.project.partner) {
    return <div />;
  }

  const timesheetConfig = {
    amount: timesheet.timesheet,
    hoursInDay: fullProjectMonth.client.hoursInDay,
  };

  const clientTariffs = getTariffs(fullProjectMonth.project.client);
  const partnerTariffs = getTariffs(fullProjectMonth.project.partner);
  if (clientTariffs.rateType !== partnerTariffs.rateType) {
    switch (clientTariffs.rateType) {
      case 'hourly':
        timesheetConfig.amount /= timesheetConfig.hoursInDay;
        break;

      case 'daily':
      default:
        timesheetConfig.amount *= timesheetConfig.hoursInDay;
    }
  }

  return (
    <span>
      {moneyFormat(timesheetConfig.amount * (1 + tax / 100) * partnerTariffs.tariff)}
    </span>
  );
};
