/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import {useSelector} from 'react-redux';
import {Badge} from 'react-bootstrap';
import InvoiceModel from '../models/InvoiceModel';
import {ConfacState} from '../../../reducers/app-state';
import {projectMonthResolve, displayMonthWithYear} from '../../project/ProjectMonthsLists';
import {tariffFormat, t} from '../../utils';
import {getProjectMarkup} from '../../project/utils/getProjectMarkup';


type InvoiceProps = {
  invoice: InvoiceModel;
};

const defaultBadgeStyle = {marginLeft: 10, fontSize: '100%', fontWeight: 300};


export const EditInvoiceBadges = ({invoice}: InvoiceProps) => {
  const projectMonths = useSelector((state: ConfacState) => state.projectsMonth.map(pm => projectMonthResolve(pm, state)));

  if (!invoice._id || !invoice.projectMonth) {
    return null;
  }

  const projectMonth = projectMonths.find(c => c._id === (invoice.projectMonth && invoice.projectMonth.projectMonthId));
  if (!projectMonth) {
    return null;
  }

  const markup = getProjectMarkup(projectMonth.project);
  const consultant = `${projectMonth.consultant.firstName} ${projectMonth.consultant.name}`;
  return (
    <>
      <Badge style={defaultBadgeStyle} variant="primary">
        {displayMonthWithYear(projectMonth.details)}
      </Badge>
      <Badge style={defaultBadgeStyle} variant="success">
        {projectMonth.client.name}
        <small style={{paddingLeft: 10}}>{tariffFormat(markup.totalClient)}</small>
      </Badge>
      {!!markup.amount && (
        <Badge style={defaultBadgeStyle} variant="danger">
          {t('projectMonth.markup')}
          <small style={{paddingLeft: 10}}>
            {tariffFormat(markup.amount)}
            &nbsp;
            ({markup.percentage.toFixed(0)}%)
          </small>
        </Badge>
      )}

      <br />

      <Badge style={{...defaultBadgeStyle, marginTop: 8}} variant="info">
        {consultant}
        {projectMonth.partner && <small style={{paddingLeft: 8}}>({projectMonth.partner.name})</small>}
      </Badge>
    </>
  );
};
