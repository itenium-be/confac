import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import cn from 'classnames';
import {FullProjectMonthModel, ProjectMonthInbound, ProjectMonthInboundStatus} from '../models/ProjectMonthModel';
import {StringInput} from '../../controls/form-controls/inputs/StringInput';
import {getNewProjectMonthInbound} from '../models/getNewProject';
import {moneyFormat, t} from '../../utils';
import {DatePicker} from '../../controls/form-controls/DatePicker';
import {Button} from '../../controls/form-controls/Button';
import {Icon} from '../../controls/Icon';
import {patchProjectsMonth, projectMonthUpload} from '../../../actions';
import {useDebouncedSave} from '../../hooks/useDebounce';
import {UploadFileButton} from '../../controls/form-controls/button/UploadFileButton';
import {getDownloadUrl} from '../../../actions/utils/download-helpers';
import {AttachmentPreviewButton} from '../controls/AttachmentPreviewButton';
import {ConfacState} from '../../../reducers/app-state';
import {getAmountInDays} from '../../invoice/controls/InvoiceLineTypeSelect';

interface ProjectMonthInboundCellProps {
  projectMonth: FullProjectMonthModel;
}


/** Inbound form cell for the ProjectMonth list */
export const ProjectMonthInboundCell = ({projectMonth}: ProjectMonthInboundCellProps) => {
  const dispatch = useDispatch();

  const defaultValue = projectMonth.details.inbound || getNewProjectMonthInbound();
  const dispatcher = (val: ProjectMonthInbound) => {
    dispatch(patchProjectsMonth({...projectMonth.details, inbound: val}));
  };
  const [inbound, setInbound, saveInbound] = useDebouncedSave<ProjectMonthInbound>(defaultValue, dispatcher);


  if (!projectMonth.project.projectMonthConfig.inboundInvoice) {
    return <div />;
  }

  if (projectMonth.details.verified) {
    return <div />;
  }


  const canEdit = (projectMonth.details.verified || inbound.status !== 'new') ? 'label' : undefined;

  return (
    <div className={cn('inbound-cell')}>
      <StringInput
        value={inbound.nr}
        onChange={nr => setInbound({...inbound, nr})}
        placeholder={t('projectMonth.inboundInvoiceNr')}
        display={canEdit}
      />
      <InboundAmountForecast projectMonth={projectMonth} />
      <DatePicker
        value={inbound.dateReceived}
        onChange={dateReceived => setInbound({...inbound, dateReceived})}
        placeholder={t('projectMonth.inboundDateReceived')}
        display={canEdit}
      />
      <InboundActionButtons
        projectMonth={projectMonth}
        onChange={status => saveInbound({...inbound, status})}
      />
    </div>
  );
};



type InboundActionButtonsProps = {
  projectMonth: FullProjectMonthModel;
  onChange: (status: ProjectMonthInboundStatus) => void;
}

type InboundActionsMap = {
  status: ProjectMonthInboundStatus;
  component: React.ReactNode;
}



/** Switch between statusses and dropzone for uploading the inbound invoice */
const InboundActionButtons = ({projectMonth, onChange}: InboundActionButtonsProps) => {
  const dispatch = useDispatch();
  const {details: {attachments, inbound}, invoice} = projectMonth;

  const buttons: InboundActionsMap[] = [{
    status: 'validated',
    component: (
      <Button key="validated" variant="outline-success" onClick={() => onChange('validated')} size="md">
        <Icon fa="fa fa-check" size={1} title={t('projectMonth.inboundValidated')} />
      </Button>
    ),
  }, {
    status: 'paid',
    component: (
      <Button key="paid" variant="success" onClick={() => onChange('paid')} size="md">
        <Icon fa="fa fa-coins" size={1} title={t('projectMonth.inboundPaid')} />
      </Button>
    ),
  }, {
    status: 'new',
    component: (
      <Button key="new" variant="outline-dark" onClick={() => onChange('new')} size="md">
        <Icon fa="fa fa-inbox" size={1} title={t('projectMonth.inboundNew')} />
      </Button>
    ),
  }];

  const hasInboundInvoiceBeenUploaded = invoice
    ? invoice.attachments.some(a => a.type === 'inbound') : attachments.some(a => a.type === 'inbound');

  const getInboundInvoiceDownloadUrl = () => {
    const projectMonthId = projectMonth._id;
    const inboundInvoiceDetails = invoice
      ? invoice.attachments.find(a => a.type === 'inbound')
      : attachments.find(a => a.type === 'inbound');

    const {fileName} = inboundInvoiceDetails!;

    return getDownloadUrl('project_month', invoice ? invoice._id : projectMonthId, 'inbound', fileName, 'preview');
  };

  return (
    <div className="inbound-actions">
      {buttons.filter(b => b.status !== inbound.status).map(b => b.component)}


      {!invoice && (
        <UploadFileButton
          onUpload={f => dispatch(projectMonthUpload(f, 'inbound', projectMonth._id))}
          icon="fa fa-upload"
          title={t('projectMonth.inboundUpload')}
        />
      )}
      {hasInboundInvoiceBeenUploaded && (
        <AttachmentPreviewButton tooltip="projectMonth.viewInboundInvoice" downloadUrl={getInboundInvoiceDownloadUrl()} />
      )}
    </div>
  );
};




type InboundAmountForecastProps = {
  projectMonth: FullProjectMonthModel;
}

/** Expected inbound total invoice amount */
const InboundAmountForecast = ({projectMonth}: InboundAmountForecastProps) => {
  const tax = useSelector((state: ConfacState) => state.config.defaultTax);
  const {timesheet} = projectMonth.details;
  if (!timesheet.timesheet || !projectMonth.project.partner) {
    return <div />;
  }

  const timesheetConfig = {
    amount: timesheet.timesheet,
    hoursInDay: projectMonth.client.rate.hoursInDay,
  };

  if (projectMonth.project.partner.rateType !== projectMonth.project.client.rateType) {
    switch (projectMonth.project.client.rateType) {
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
      {moneyFormat(timesheetConfig.amount * (1 + tax / 100) * projectMonth.project.partner.tariff)}
    </span>
  );
};
