import moment from 'moment';
import {t, moneyFormat} from '../../../../utils';
import {FullProjectMonthModel} from '../../../models/FullProjectMonthModel';
import {FullProjectModel} from '../../../models/FullProjectModel';
import {getProjectForecast} from './getProjectForecast';

type ProjectForecastPartnerFooterProps = {
  models: FullProjectModel[] | FullProjectMonthModel[];
  month?: moment.Moment;
};

export const ProjectForecastPartnerFooter = ({models, month}: ProjectForecastPartnerFooterProps) => {
  if (!models.length) {
    return null;
  }

  // TODO: the last hurdle, caching this will result in
  // sub 100ms render for opening/closing projectMonths
  const result = getProjectForecast(models, 'partner', month);
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
