import moment from 'moment';
import { FullProjectMonthModel } from '../../../models/FullProjectMonthModel';
import { FullProjectModel } from '../../../models/FullProjectModel';
import { getTariffs } from '../../../utils/getTariffs';
import { holidaysService } from '../../../../../actions/holidays';


export function getProjectForecast(models: Array<FullProjectModel | FullProjectMonthModel>, getFor: 'client' | 'partner', month?: moment.Moment) {
  // eslint-disable-next-line no-param-reassign
  month = month || moment();

  const result = {
    consultants: models.filter(x => x.consultant.type === 'consultant'),
    externals: models.filter(x => x.consultant.type === 'externalConsultant' || x.consultant.type === 'freelancer'),
    managers: models.filter(x => x.consultant.type === 'manager'),
  };

  const getTotalsProjectModel = (projectMonths: FullProjectMonthModel[]) => {
    if (getFor === 'partner') {
      return projectMonths
        .map(pm => {
          if (!pm.project.partner || !pm.details.timesheet.timesheet) {
            return 0;
          }

          const { tariff } = getTariffs(pm.project.partner);
          return tariff * pm.details.timesheet.timesheet;
        })
        .reduce((acc, cur) => acc + cur, 0);
    }
    return projectMonths
      .map(pm => {
        if (!pm.details.timesheet.timesheet) {
          return 0;
        }

        const { tariff } = getTariffs(pm.project.client);
        return tariff * pm.details.timesheet.timesheet;
      })
      .reduce((acc, cur) => acc + cur, 0);
  };

  // TODO: Should take begin/end date into account to give more precise forecast
  // TODO: Also doesn't take hourly/daily rates into account
  const workDaysInMonth = holidaysService.get(month);
  const getTotalsProject = (projects: FullProjectModel[]) => {
    if (getFor === 'partner') {
      return projects
        .map(p => (p.details.partner ? getTariffs(p.details.partner).tariff * workDaysInMonth : 0))
        .reduce((acc, cur) => acc + cur, 0);
    }
    return projects
      .map(p => getTariffs(p.details.client).tariff * workDaysInMonth)
      .reduce((acc, cur) => acc + cur, 0);
  };

  const isProjectModel = !((models[0] as FullProjectMonthModel).project);
  const totalGetter: Function = isProjectModel ? getTotalsProject : getTotalsProjectModel;

  return {
    consultants: totalGetter(result.consultants),
    externals: totalGetter(result.externals),
    managers: totalGetter(result.managers),
  };
}
