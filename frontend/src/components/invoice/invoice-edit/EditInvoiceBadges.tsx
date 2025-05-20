/* eslint-disable react/jsx-one-expression-per-line */
import {Badge} from 'react-bootstrap';
import InvoiceModel from '../models/InvoiceModel';
import { displayMonthWithYear } from '../../project/project-month-list/project-month-utils';
import {tariffFormat, t} from '../../utils';
import {getProjectMarkup} from '../../project/utils/getProjectMarkup';
import {useProjectsMonth} from '../../hooks/useProjects';


type InvoiceProps = {
  invoice: InvoiceModel;
};

const defaultBadgeStyle = {marginLeft: 10, fontSize: '100%', fontWeight: 300};


export const EditInvoiceBadges = ({invoice}: InvoiceProps) => {
  const projectMonthId = invoice.projectMonth && invoice.projectMonth.projectMonthId;
  const projectMonth = useProjectsMonth(projectMonthId || '');

  // TODO: model vs form instances:
  // The invoice passed right now is the form instance
  // So for a new invoice, the _id is never set because it is not part of the form
  if (!invoice._id || !invoice.projectMonth) {
    return null;
  }

  if (!projectMonth) {
    return null;
  }

  const markup = getProjectMarkup(projectMonth.project);
  const consultant = `${projectMonth.consultant.firstName} ${projectMonth.consultant.name}`;
  return (
    <>
      <Badge style={defaultBadgeStyle} bg="primary" text="white">
        {displayMonthWithYear(projectMonth.details.month)}
      </Badge>
      <Badge style={defaultBadgeStyle} bg="success" text="white">
        {projectMonth.client.name}
        <small style={{paddingLeft: 10}}>{tariffFormat(markup.totalClient)}</small>
      </Badge>
      {!!markup.amount && (
        <Badge style={defaultBadgeStyle} bg="danger" text="white">
          {t('projectMonth.markup')}
          <small style={{paddingLeft: 10}}>
            {tariffFormat(markup.amount)}
            &nbsp;
            ({markup.percentage.toFixed(0)}%)
          </small>
        </Badge>
      )}

      <br />

      <Badge style={{...defaultBadgeStyle, marginTop: 8}} bg="info" text="white">
        {consultant}
        {projectMonth.partner && <small style={{paddingLeft: 8}}>({projectMonth.partner.name})</small>}
      </Badge>
    </>
  );
};
