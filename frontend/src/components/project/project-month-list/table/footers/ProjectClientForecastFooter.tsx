import moment from 'moment';
import { Badge } from 'react-bootstrap';
import { t, moneyFormat } from '../../../../utils';
import { FullProjectMonthModel } from '../../../models/FullProjectMonthModel';
import { FullProjectModel } from '../../../models/FullProjectModel';
import { getProjectForecast } from './getProjectForecast';

type ProjectClientForecastFooterProps = {
  models: FullProjectModel[] | FullProjectMonthModel[];
  month?: moment.Moment;
};


export const ProjectClientForecastFooter = ({ models, month }: ProjectClientForecastFooterProps) => {
  if (!models.length) {
    return null;
  }

  const clients = getProjectForecast(models, 'client', month);
  const partners = getProjectForecast(models, 'partner', month);

  return (
    <div className="client-markup">
      <div className="label">{t('consultant.title')}</div>
      <div className="total">{moneyFormat(clients.consultants)}</div>
      <div className="markup">&nbsp;</div>

      <div className="label">{t('consultant.externals')}</div>
      <div className="total">{moneyFormat(clients.externals)}</div>
      <div className="markup">
        <Badge pill bg="success" text="white" style={{fontSize: 18}}>
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
