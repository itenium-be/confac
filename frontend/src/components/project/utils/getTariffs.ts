import {EditProjectRateType} from '../../../models';
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

export const compareTariffs = (t1: ProjectClientTariff, t2: ProjectClientTariff): number => {
  const t1Tariff = t1.tariff * (t1.rateType === 'hourly' ? DefaultHoursInDay : 1);
  const t2Tariff = t2.tariff * (t2.rateType === 'hourly' ? DefaultHoursInDay : 1);
  return t1Tariff - t2Tariff;
}
