import React, {useState} from 'react';
import cn from 'classnames';
import {FullProjectMonthModel, ProjectMonthInbound} from '../models/ProjectMonthModel';
import {StringInput} from '../../controls/form-controls/inputs/StringInput';
import {getNewProjectMonthInbound} from '../models/getNewProject';
import {moneyFormat, t} from '../../utils';
import {DatePicker} from '../../controls/form-controls/DatePicker';

interface ProjectMonthInboundCellProps {
  projectMonth: FullProjectMonthModel;
}


export const ProjectMonthInboundCell = ({projectMonth}: ProjectMonthInboundCellProps) => {
  // const dispatch = useDispatch();
  // const model = useSelector((state: ConfacState) => state.projects.find(c => c._id === props.match.params.id));
  const [inbound, setInbound] = useState<ProjectMonthInbound>(projectMonth.details.inbound || getNewProjectMonthInbound());

  if (!projectMonth.project.projectMonthConfig.inboundInvoice) {
    return (
      <div className="validated">&nbsp;</div>
    );
  }


  return (
    <div className={cn('inbound-cell', false && 'validated')}>
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
        BTNZ
      </div>
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
