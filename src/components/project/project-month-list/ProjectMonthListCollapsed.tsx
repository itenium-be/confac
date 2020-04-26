import React from 'react';
import {Badge} from 'react-bootstrap';
import {displayMonthWithYear} from '../ProjectMonthsLists';
import {IFeature} from '../../controls/feature/feature-models';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {ListFilters} from '../../controls/table/table-models';
import {Button} from '../../controls/form-controls/Button';
import {t} from '../../utils';
import {Icon} from '../../controls/Icon';


type ProjectMonthListCollapsedProps = {
  feature: IFeature<FullProjectMonthModel, ListFilters>;
  onOpen: () => void;
}



export const ProjectMonthListCollapsed = ({feature, onOpen}: ProjectMonthListCollapsedProps) => {
  if (!feature.list.data.length) {
    return null;
  }

  const data = feature.list.data;
  const withInbound = data.filter(x => x.project.projectMonthConfig.inboundInvoice);

  const totals = {
    total: data.length,
    verified: data.filter(x => x.details.verified).length,
    timesheetPending: data.filter(x => !x.details.timesheet.validated).length,
    inboundPending: withInbound.filter(x => x.details.inbound.status !== 'paid').length,
    inboundNew: withInbound.filter(x => x.details.inbound.status === 'new').length,
    inboundValidated: withInbound.filter(x => x.details.inbound.status === 'validated').length,
    inboundPaid: withInbound.filter(x => x.details.inbound.status === 'paid').length,
  };

  const results = {
    verified: totals.verified === totals.total,
    timesheetPending: totals.timesheetPending !== 0,
    inboundPending: totals.inboundPending !== 0,
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
            <Badge pill variant="success">
              <Icon fa="fa fa-coins" size={1} />
              {t('projectMonth.list.allVerifiedBadge')}
            </Badge>
          ) : (
            <>
              <Badge pill variant={results.timesheetPending ? 'warning' : 'success'}>
                <Icon fa="fa fa-clock" size={1} style={{marginRight: 8}} />
                {t(`projectMonth.list.${results.timesheetPending ? 'timesheetPending' : 'timesheetOk'}`, totals)}
              </Badge>
              {results.inboundPending ? (
                <Badge pill variant="warning">
                  <Icon fa="fa fa-inbox" size={1} />
                  <span>{totals.inboundNew}</span>

                  <Icon fa="fa fa-check" size={1} />
                  <span>{totals.inboundValidated}</span>

                  <Icon fa="fa fa-coins" size={1} />
                  <span>{totals.inboundPaid}</span>
                </Badge>
              ) : (
                <Badge pill variant="success">
                  <Icon fa="fa fa-inbox" size={1} />
                  {t('projectMonth.list.inboundAllPaid')}
                </Badge>
              )}
              <Badge pill variant="warning">
                <Icon fa="fa fa-coins" size={1} />
                {t('projectMonth.list.verifiedBadge', totals)}
              </Badge>
            </>
          )}
        </span>
      </h2>
    </>
  );
};
