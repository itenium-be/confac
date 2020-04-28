/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import moment from 'moment';
import {Badge} from 'react-bootstrap';
import {t, moneyFormat} from '../../utils';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {FullProjectModel} from '../models/ProjectModel';
import {WorkedDays} from '../../invoice/invoice-list/InvoiceWorkedDays';
import {getWorkDaysInMonth} from '../../invoice/models/InvoiceModel';


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
    count: getWorkDaysInMonth(month || moment()).length,
    month: (month || moment()).format('MMMM YYYY'),
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



function getProjectForecast(models: FullProjectModel[], getFor: 'client' | 'partner') {
  const result = {
    consultants: models.filter(x => x.consultant.type === 'consultant'),
    externals: models.filter(x => x.consultant.type === 'externalConsultant' || x.consultant.type === 'freelancer'),
    managers: models.filter(x => x.consultant.type === 'manager'),
  };

  const workDaysInMonth = getWorkDaysInMonth(moment()).length;
  const getTotal = (projects: FullProjectModel[]) => {
    if (getFor === 'partner') {
      return projects
        .map(x => (x.details.partner ? x.details.partner.tariff * workDaysInMonth : 0))
        .reduce((acc, cur) => acc + cur, 0);
    }
    return projects
      .map(x => x.details.client.tariff * workDaysInMonth)
      .reduce((acc, cur) => acc + cur, 0);
  };

  return {
    consultants: getTotal(result.consultants),
    externals: getTotal(result.externals),
    managers: getTotal(result.managers),
  };
}




type FullProjectMonthsProps = {
  models: FullProjectModel[];
}

export const ProjectForecastPartnerFooter = ({models}: FullProjectMonthsProps) => {
  if (!models.length) {
    return null;
  }

  const result = getProjectForecast(models, 'partner');
  return (
    <dl className="dl-box">
      <dt>{t('consultant.title')}</dt>
      <dd>&nbsp;</dd>
      <dt>{t('consultant.externals')}</dt>
      <dd>{moneyFormat(result.externals)}</dd>
      <dt>{t('consultant.managers')}</dt>
      <dd>{moneyFormat(result.managers)}</dd>
    </dl>
  );
};





type ProjectMarkupFooterProps = {
  models: FullProjectModel[];
}

export const ProjectClientForecastFooter = ({models}: ProjectMarkupFooterProps) => {
  if (!models.length) {
    return null;
  }

  const clients = getProjectForecast(models, 'client');
  const partners = getProjectForecast(models, 'partner');

  return (
    <div className="client-markup">
      <div className="label">{t('consultant.title')}</div>
      <div className="total">{moneyFormat(clients.consultants)}</div>
      <div className="markup">&nbsp;</div>

      <div className="label">{t('consultant.externals')}</div>
      <div className="total">{moneyFormat(clients.externals)}</div>
      <div className="markup">
        <Badge pill variant="success" style={{fontSize: 18}}>
          {moneyFormat(clients.externals - partners.externals)}
        </Badge>
      </div>

      <div className="label">{t('consultant.managers')}</div>
      <div className="total">{moneyFormat(clients.managers)}</div>
      <div className="markup">
        {moneyFormat(clients.managers - partners.managers)}
      </div>
    </div>
  );
};
