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

interface ProjectMonthInboundCellProps {
  fullProjectMonth: FullProjectMonthModel;
}


/** Inbound form cell for the ProjectMonth list */
export const ProjectMonthInboundCell = ({fullProjectMonth}: ProjectMonthInboundCellProps) => {
  console.log('TCL: ProjectMonthInboundCell -> fullProjectMonth', fullProjectMonth);
  const dispatch = useDispatch();

  const defaultValue = fullProjectMonth.details.inbound || getNewProjectMonthInbound();
  const dispatcher = (val: ProjectMonthInbound) => {
    dispatch(patchProjectsMonth({...fullProjectMonth.details, inbound: val}));
  };
  const [inbound, setInbound, saveInbound] = useDebouncedSave<ProjectMonthInbound>(defaultValue, dispatcher);
  // console.log('TCL: ProjectMonthInboundCell -> inbound', inbound);


  if (!fullProjectMonth.project.projectMonthConfig.inboundInvoice) {
    return <div />;
  }

  if (fullProjectMonth.details.verified) {
    return <div />;
  }


  const canEdit = (fullProjectMonth.details.verified || inbound.status !== 'new') ? 'label' : undefined;

  return (
    <div className={cn('inbound-cell')}>
      <StringInput
        value={inbound.nr}
        onChange={nr => setInbound({...inbound, nr})}
        placeholder={t('projectMonth.inboundInvoiceNr')}
        display={canEdit}
      />
      <InboundAmountForecast fullProjectMonth={fullProjectMonth} />
      <DatePicker
        value={inbound.dateReceived || fullProjectMonth.details.inbound.dateReceived}
        onChange={dateReceived => setInbound({...inbound, dateReceived})}
        placeholder={t('projectMonth.inboundDateReceived')}
        display={canEdit}
      />
      <InboundActionButtons
        fullProjectMonth={fullProjectMonth}
        onChange={status => saveInbound({...inbound, status})}
      />
    </div>
  );
};



type InboundActionButtonsProps = {
  fullProjectMonth: FullProjectMonthModel;
  onChange: (status: ProjectMonthInboundStatus) => void;
}

type InboundActionsMap = {
  status: ProjectMonthInboundStatus;
  component: React.ReactNode;
}



/** Switch between statusses and dropzone for uploading the inbound invoice */
const InboundActionButtons = ({fullProjectMonth, onChange}: InboundActionButtonsProps) => {
  const dispatch = useDispatch();
  const {details: {attachments, inbound}, invoice} = fullProjectMonth;

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
    const projectMonthId = fullProjectMonth._id;
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
          onUpload={f => dispatch(projectMonthUpload(f, 'inbound', fullProjectMonth._id))}
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
  fullProjectMonth: FullProjectMonthModel;
}

/** Expected inbound total invoice amount */
const InboundAmountForecast = ({fullProjectMonth}: InboundAmountForecastProps) => {
  const tax = useSelector((state: ConfacState) => state.config.defaultTax);
  const {timesheet} = fullProjectMonth.details;
  if (!timesheet.timesheet || !fullProjectMonth.project.partner) {
    return <div />;
  }

  const timesheetConfig = {
    amount: timesheet.timesheet,
    hoursInDay: fullProjectMonth.client.rate.hoursInDay,
  };

  if (fullProjectMonth.project.partner.rateType !== fullProjectMonth.project.client.rateType) {
    switch (fullProjectMonth.project.client.rateType) {
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
      {moneyFormat(timesheetConfig.amount * (1 + tax / 100) * fullProjectMonth.project.partner.tariff)}
    </span>
  );
};
