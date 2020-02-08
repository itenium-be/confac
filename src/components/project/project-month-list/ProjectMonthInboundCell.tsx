import React from 'react';
import {useDispatch} from 'react-redux';
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

interface ProjectMonthInboundCellProps {
  projectMonth: FullProjectMonthModel;
}


export const ProjectMonthInboundCell = ({projectMonth}: ProjectMonthInboundCellProps) => {
  const dispatch = useDispatch();

  const defaultInbound = projectMonth.details.inbound || getNewProjectMonthInbound();
  const dispatcher = (val: ProjectMonthInbound) => {
    dispatch(patchProjectsMonth({...projectMonth.details, inbound: val}));
  };
  const [inbound, setInbound, saveInbound] = useDebouncedSave<ProjectMonthInbound>(defaultInbound, dispatcher);


  if (!projectMonth.project.projectMonthConfig.inboundInvoice) {
    return <div />;
  }

  const canEdit = inbound.status !== 'new' ? 'label' : undefined;

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
      <div className="inbound-actions">
        <InboundStatusButtons
          projectMonth={projectMonth}
          onChange={status => saveInbound({...inbound, status})}
        />
      </div>
    </div>
  );
};



type InboundStatusButtonsProps = {
  projectMonth: FullProjectMonthModel;
  onChange: (status: ProjectMonthInboundStatus) => void;
}

type InboundActionsMap = {
  status: ProjectMonthInboundStatus;
  component: React.ReactNode;
}

const InboundStatusButtons = ({projectMonth, onChange}: InboundStatusButtonsProps) => {
  const dispatch = useDispatch();
  const {inbound} = projectMonth.details;

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

  return (
    <div className="inbound-actions">
      {buttons.filter(b => b.status !== inbound.status).map(b => b.component)}
      <UploadFileButton
        onUpload={f => dispatch(projectMonthUpload(f, 'inbound'))}
        icon="fa fa-file-pdf"
        title={t('projectMonth.inboundUpload')}
      />
    </div>
  );
};




type InboundAmountForecastProps = {
  projectMonth: FullProjectMonthModel;
}

const InboundAmountForecast = ({projectMonth}: InboundAmountForecastProps) => {
  const {timesheet} = projectMonth.details;
  if (!timesheet.timesheet || !projectMonth.project.partner) {
    return <div />;
  }

  return (
    <span>
      {moneyFormat(timesheet.timesheet * 1.21 * projectMonth.project.partner.tariff)}
    </span>
  );
};
