/* eslint-disable react/jsx-one-expression-per-line */
import React, { useMemo } from 'react';
import moment from 'moment';
import {t} from '../../../../utils';
import {ConsultantModel} from '../../../../consultant/models/ConsultantModel';
import {getWorkDaysInMonth} from '../../../../invoice/models/InvoiceModel';


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


type WorkDaysMonth = {
  count: number;
  month: string;
}


const workDaysCache: {[key: string]: WorkDaysMonth} = {};


export const ConsultantCountFooter = ({consultants, month}: ConsultantsProps) => {
  const result = getConsultantTotals(consultants);
  const totalWorkDays = useMemo(
    () => {
      const cacheMonth = (month || moment()).format('MMMM YYYY');
      if (workDaysCache[cacheMonth]) {
        console.log(`CACHED getWorkDaysInMonth ${cacheMonth}`);
        return workDaysCache[cacheMonth];
      }

      console.log(`CALC getWorkDaysInMonth ${cacheMonth}`);
      const calced: WorkDaysMonth = {
        count: getWorkDaysInMonth(month || moment()),
        month: cacheMonth,
      };
      workDaysCache[cacheMonth] = calced;
      return calced;
    },
    [month]
  );

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
