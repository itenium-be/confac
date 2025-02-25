import {EditProjectRateType, EditProjectRateTypeSortOrder} from '../../../models';
import { DefaultHoursInDay } from '../../client/models/getNewClient';
import {ProjectClientModel} from '../models/IProjectModel';


/** Calculated: Tariff info for a ProjectClientModel */
export type ProjectClientTariff = {
  tariff: number;
  rateType: EditProjectRateType;
}


export function getTariffs(projectClient: ProjectClientModel): ProjectClientTariff {
  return {
    tariff: projectClient.defaultInvoiceLines.reduce((prev, cur) => prev + cur.price, 0),
    rateType: projectClient.defaultInvoiceLines[0].type,
  };
}

export const compareTariffs = (t1: ProjectClientTariff, t2: ProjectClientTariff, seperateHourlyDaily: boolean = true): number => {
  if(!seperateHourlyDaily)
    return (t2.rateType === 'hourly' ? t2.tariff * DefaultHoursInDay : t2.tariff) -
      (t1.rateType === 'hourly' ? t1.tariff * DefaultHoursInDay : t1.tariff)

  if(t1.rateType !== t2.rateType)
    return EditProjectRateTypeSortOrder.indexOf(t1.rateType) - EditProjectRateTypeSortOrder.indexOf(t2.rateType)

  return t1.tariff - t2.tariff
}
