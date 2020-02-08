import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import cn from 'classnames';
import {FullProjectMonthModel, ProjectMonthInbound, ProjectMonthInboundStatus} from '../models/ProjectMonthModel';
import {StringInput} from '../../controls/form-controls/inputs/StringInput';
import {getNewProjectMonthInbound} from '../models/getNewProject';
import {moneyFormat, t} from '../../utils';
import {DatePicker} from '../../controls/form-controls/DatePicker';
import {Button} from '../../controls/form-controls/Button';
import {Icon} from '../../controls/Icon';

interface ProjectMonthInboundCellProps {
  projectMonth: FullProjectMonthModel;
}


export const ProjectMonthInboundCell = ({projectMonth}: ProjectMonthInboundCellProps) => {
  const dispatch = useDispatch();
  // const model = useSelector((state: ConfacState) => state.projects.find(c => c._id === props.match.params.id));
  const [inbound, setInbound] = useState<ProjectMonthInbound>(projectMonth.details.inbound || getNewProjectMonthInbound());

  if (!projectMonth.project.projectMonthConfig.inboundInvoice) {
    return <div />;
  }

  // TODO: Oh my.. add a debounce hook... (duplicated in the other cells?)
  // const realSetTimesheet = (patch: {[key in keyof ProjectMonthInbound]?: any}): ProjectMonthInbound => {
  //   const newTimesheet = {...inbound, ...patch};
  //   setInbound(newTimesheet);
  //   return newTimesheet;
  // };

  // const saveTimesheet = (newTimesheet?: ProjectMonthInbound) => {
  //   dispatch(patchProjectsMonth({...projectMonth.details, timesheet: newTimesheet || inbound}));
  // };


  return (
    <div className={cn('inbound-cell')}>
      <StringInput
        value={inbound.nr}
        onChange={nr => setInbound({...inbound, nr})}
        placeholder={t('projectMonth.inboundInvoiceNr')}
      />
      <InboundAmountForecast projectMonth={projectMonth} />
      <div>
        <DatePicker
          value={inbound.dateReceived}
          onChange={dateReceived => setInbound({...inbound, dateReceived})}
          placeholder={t('projectMonth.inboundDateReceived')}
        />
      </div>
      <div className="inbound-actions">
        <InboundStatusButtons
          projectMonth={projectMonth}
          onChange={status => setInbound({...inbound, status})}
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
  const {inbound} = projectMonth.details;

  const buttons: InboundActionsMap[] = [{
    status: 'validated',
    component: (
      <Button key="validated" variant="outline-success" onClick={() => onChange('validated')} size="md">
        <Icon fa="fa fa-check" size={1} />
      </Button>
    ),
  }, {
    status: 'paid',
    component: (
      <Button key="paid" variant="success" onClick={() => onChange('paid')} size="md">
        <Icon fa="fa fa-coins" size={1} />
      </Button>
    ),
  }, {
    status: 'new',
    component: (
      <Button key="new" variant="outline-secondary" onClick={() => onChange('new')} size="md">
        <Icon fa="fa fa-inbox" size={1} />
      </Button>
    ),
  }];

  return (
    <div className="inbound-actions">
      {buttons.filter(b => b.status !== inbound.status).map(b => b.component)}
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
    <div className="forecast">
      {moneyFormat(timesheet.timesheet * 1.21 * projectMonth.project.partner.tariff)}
    </div>
  );
};
