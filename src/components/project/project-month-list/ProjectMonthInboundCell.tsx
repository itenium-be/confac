import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import cn from 'classnames';
import {ProjectMonthInbound, ProjectMonthInboundStatus} from '../models/ProjectMonthModel';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {StringInput} from '../../controls/form-controls/inputs/StringInput';
import {getNewProjectMonthInbound} from '../models/getNewProject';
import {moneyFormat, t} from '../../utils';
import {DatePicker} from '../../controls/form-controls/DatePicker';
import {Button} from '../../controls/form-controls/Button';
import {Icon} from '../../controls/Icon';
import {patchProjectsMonth, projectMonthUpload} from '../../../actions';
import {useDebouncedSave} from '../../hooks/useDebounce';
import {getDownloadUrl} from '../../../actions/utils/download-helpers';
import {ConfacState} from '../../../reducers/app-state';
import {AttachmentUploadPreviewButtons} from '../controls/AttachmentUploadPreviewButtons';
import moment from 'moment';

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

  if (fullProjectMonth.details.verified) {
    return <div />;
  }


  const canEdit = (fullProjectMonth.details.verified || inbound.status !== 'new') ? 'label' : undefined;


  const inboundInvoiceDetails = fullProjectMonth.invoice
    ? fullProjectMonth.invoice.attachments.find(a => a.type === 'inbound') : fullProjectMonth.details.attachments.find(a => a.type === 'inbound');

  const getInboundInvoiceDownloadUrl = (): string => {
    if (!inboundInvoiceDetails) {
      return '';
    }

    if (fullProjectMonth.invoice) {
      return getDownloadUrl('invoice', fullProjectMonth.invoice._id, 'inbound', inboundInvoiceDetails.fileName, 'preview');
    }

    const projectMonthId = fullProjectMonth._id;
    return getDownloadUrl('project_month', projectMonthId, 'inbound', inboundInvoiceDetails.fileName, 'preview');
  };

  const hasInboundInvoiceBeenUploaded = !!inboundInvoiceDetails;

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
            isUploadDisabled={!!fullProjectMonth.invoice}
            isPreviewDisabled={!hasInboundInvoiceBeenUploaded}
            uploadTooltip={t('projectMonth.inboundUpload')}
            previewTooltip={t('projectMonth.viewInboundInvoice', {fileName: inboundInvoiceDetails ? inboundInvoiceDetails.fileName : ''})}
            onUpload={f => {
              if (!inbound.dateReceived) {
                setInbound({...inbound, dateReceived: moment()});
              }
              return dispatch(projectMonthUpload(f, 'inbound', fullProjectMonth._id));
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

type InboundActionsMap = {
  status: ProjectMonthInboundStatus;
  component: React.ReactNode;
}



/** Switch between statusses for the inbound invoice */
const InboundActionButtons = ({fullProjectMonth, onChange}: InboundActionButtonsProps) => {
  const buttons: InboundActionsMap[] = [{
    status: 'validated',
    component: (
      <Button key="validated" variant="outline-success" onClick={() => onChange('validated')} size="md" title={t('projectMonth.inboundValidated')}>
        <Icon fa="fa fa-check" size={1} />
      </Button>
    ),
  }, {
    status: 'paid',
    component: (
      <Button key="paid" variant="success" onClick={() => onChange('paid')} size="md" title={t('projectMonth.inboundPaid')}>
        <Icon fa="fa fa-coins" size={1} />
      </Button>
    ),
  }, {
    status: 'new',
    component: (
      <Button key="new" variant="outline-dark" onClick={() => onChange('new')} size="md" title={t('projectMonth.inboundNew')}>
        <Icon fa="fa fa-inbox" size={1} />
      </Button>
    ),
  }];

  return (
    <>
      {buttons.filter(b => b.status !== fullProjectMonth.details.inbound.status).map(b => b.component)}
    </>
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
