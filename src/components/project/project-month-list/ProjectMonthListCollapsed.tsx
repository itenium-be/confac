import React from 'react';
import {Badge as ReactBadge} from 'react-bootstrap';
import {BadgeProps as ReactBadgeProps} from 'react-bootstrap/Badge'
import RcTooltip from 'rc-tooltip';
import {displayMonthWithYear} from '../ProjectMonthsLists';
import {IFeature} from '../../controls/feature/feature-models';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {ProjectMonthListFilters} from '../../controls/table/table-models';
import {Button} from '../../controls/form-controls/Button';
import {t} from '../../utils';
import {Icon} from '../../controls/Icon';


type BadgeProps = Omit<ReactBadgeProps, 'title'> & {
  title?: string | string[];
  children: any;
}

const Badge = ({title, children, ...props}: BadgeProps) => {
  if (!title) {
    return <ReactBadge {...props}>{children}</ReactBadge>;
  }

  let overlay: any;
  if (typeof title === 'string') {
    overlay = title;
  } else {
    overlay = title.map(x => <div key={x}>{x}</div>);
  }

  return (
    <RcTooltip overlay={overlay}>
      <ReactBadge {...props}>{children}</ReactBadge>
    </RcTooltip>
  );
};


type ProjectMonthListCollapsedProps = {
  feature: IFeature<FullProjectMonthModel, ProjectMonthListFilters>;
  onOpen: () => void;
}


type Totals = {
  total: number,
  verified: number,
  unverified: FullProjectMonthModel[],
  timesheetPending: FullProjectMonthModel[],
  timesheetPendingCount: number,
  inboundPending: FullProjectMonthModel[],
  inboundNew: FullProjectMonthModel[],
  inboundValidated: FullProjectMonthModel[],
  inboundPaid: FullProjectMonthModel[],
}



export const ProjectMonthListCollapsed = ({feature, onOpen}: ProjectMonthListCollapsedProps) => {
  if (!feature.list.data.length) {
    return null;
  }

  const data = feature.list.data.filter(x => x.details.verified !== 'forced');
  const withInbound = data.filter(x => x.project.projectMonthConfig.inboundInvoice);

  const totals: Totals = {
    total: data.length,
    verified: data.filter(x => x.details.verified).length,
    unverified: data.filter(x => !x.details.verified),
    timesheetPending: data.filter(x => !x.details.timesheet.validated),
    timesheetPendingCount: data.filter(x => !x.details.timesheet.validated).length,
    inboundPending: withInbound.filter(x => x.details.inbound.status !== 'paid'),
    inboundNew: withInbound.filter(x => x.details.inbound.status === 'new'),
    inboundValidated: withInbound.filter(x => x.details.inbound.status === 'validated'),
    inboundPaid: withInbound.filter(x => x.details.inbound.status === 'paid'),
  };

  const results = {
    verified: totals.verified === totals.total,
    timesheetPending: totals.timesheetPending.length !== 0,
    inboundPending: totals.inboundPending.length !== 0,
  };

  const projectsMonthDetails = feature.list.data[0].details;
  return (
    <>
      <h2 className="list-projectMonths-collapsed">
        <Button onClick={onOpen} icon="fa fa-toggle-off" variant="outline-info">
          {t('projectMonth.list.openList')}
        </Button>
        <span className="month">{displayMonthWithYear(projectsMonthDetails)}</span>
        <span className="separate">
          {results.verified ? (
            <Badge pill bg="success" text="white">
              <Icon fa="fa fa-coins" size={1} />
              {t('projectMonth.list.allVerifiedBadge')}
            </Badge>
          ) : (
            <>
              <TimesheetBadge totals={totals} pending={results.timesheetPending} />
              <InboundBadge totals={totals} pending={results.inboundPending} />
              <OutboundBadge totals={totals} />
            </>
          )}
        </span>
      </h2>
    </>
  );
};





type TimesheetBadgeProps = {
  pending: boolean;
  totals: Totals;
}

const TimesheetBadge = ({pending, totals}: TimesheetBadgeProps) => {
  const title = totals.timesheetPending
    .map(x => `${x.consultant.firstName} ${x.consultant.name}`)
    .filter((val, index, arr) => arr.indexOf(val) === index)
    .join('<br>');

  return (
    <Badge pill bg={pending ? 'warning' : 'success'} text={pending ? undefined : 'white'}>
      <Icon fa="fa fa-clock" size={1} title={`<b>${t('projectMonth.timesheetValidated')}</b><br>` + title} />
      {t(`projectMonth.list.${pending ? 'timesheetPending' : 'timesheetOk'}`, totals)}
    </Badge>
  );
};

const inboundBadgeMap = (models: FullProjectMonthModel[]): string => {
  return models
    .map(x => `${x.consultant.firstName} ${x.consultant.name}`)
    .filter((val, index, arr) => arr.indexOf(val) === index)
    .join('<br>');
}


const InboundBadge = ({pending, totals}: TimesheetBadgeProps) => {
  if (!pending) {
    return (
      <Badge pill bg="success" text="white">
        <Icon fa="fa fa-inbox" size={1} />
        {t('projectMonth.list.inboundAllPaid')}
      </Badge>
    );
  }

  const newTitle = inboundBadgeMap(totals.inboundNew);
  const validatedTitle = inboundBadgeMap(totals.inboundValidated);
  const paidTitle = inboundBadgeMap(totals.inboundPaid);
  return (
    <Badge pill bg="warning">
      <Icon fa="fa fa-inbox" size={1} title={newTitle && `<b>${t('projectMonth.inboundNew')}</b><br>${newTitle}`}>
        {totals.inboundNew.length}
      </Icon>

      <Icon fa="fa fa-check" size={1} title={validatedTitle && `<b>${t('projectMonth.inboundValidated')}</b><br>${validatedTitle}`}>
        {totals.inboundValidated.length}
      </Icon>


      <Icon fa="fa fa-coins" size={1} title={paidTitle && `<b>${t('projectMonth.inboundPaid')}</b><br>${paidTitle}`}>
        {totals.inboundPaid.length}
      </Icon>
    </Badge>
  );
};




const OutboundBadge = ({totals}: {totals: Totals}) => {
  const title = totals.unverified
    .map(x => `${x.consultant.firstName} ${x.consultant.name} (${x.client.name})`)
    .filter((val, index, arr) => arr.indexOf(val) === index)
    .join('<br>');

  return (
    <Badge pill bg="warning">
      <Icon fa="fa fa-coins" size={1} title={`<b>${t('projectMonth.outboundPaid')}</b><br>` + title} />
      {t('projectMonth.list.verifiedBadge', totals)}
    </Badge>
  );
};
