/* eslint-disable react/jsx-one-expression-per-line */
import moment from 'moment';
import {t} from '../../../../utils';
import {ConsultantModel} from '../../../../consultant/models/ConsultantModel';
import { holidaysService } from '../../../../../actions/holidays';


const getConsultantTotals = (consultants: ConsultantModel[]) => {
  const result = {
    consultants: consultants.filter(x => x.type === 'consultant').length,
    externals: consultants.filter(x => x.type === 'externalConsultant' || x.type === 'freelancer').length,
    managers: consultants.filter(x => x.type === 'manager').length,
    total: consultants.length,
  };
  return result;
};



type ConsultantsProps = {
  consultants: ConsultantModel[];
  month?: moment.Moment;
}


export const ConsultantCountFooter = ({consultants, month}: ConsultantsProps) => {
  const result = getConsultantTotals(consultants);
  const totalWorkDays = {
    count: holidaysService.get(month || moment()),
    month: (month || moment()).format('MMMM YYYY')
  };

  const isCurrentMonthForecast = !month;
  return (
    <>
      <span style={{marginRight: 6}}>
        {isCurrentMonthForecast && (`${t('projectMonth.footer.forecast')} `)}
        {t('projectMonth.footer.projecten', {projects: result.total})}
        ,
      </span>
      <small>{t('projectMonth.footer.workDays', totalWorkDays)}</small>
      <br />
      <small>
        {result.consultants ? (
          <span style={{marginRight: 6}}>{result.consultants} {t('consultant.title').toLowerCase()},</span>
        ) : null}
        {result.externals ? (
          <span style={{marginRight: 6}}>{result.externals} {t('consultant.externals').toLowerCase()},</span>
        ) : null}
        {result.managers ? (
          <span>{result.managers} {t('consultant.managers').toLowerCase()}</span>
        ) : null}
      </small>
    </>
  );
};
