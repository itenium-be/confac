import {EditProjectRateType} from '../../../models';
import {DefaultHoursInDay} from '../../client/models/getNewClient';
import {FullProjectModel} from '../models/FullProjectModel';
import {ProjectClientModel} from '../models/IProjectModel';


/** Calculated: Tariff info for a ProjectClientModel */
export type ProjectClientTariff = {
  tariff: number;
  rateType: EditProjectRateType;
}

export function getFullTariffs(project: FullProjectModel, type: 'client' | 'partner') {
  const projectClient = type === 'client' ? project.details.client : project.details.partner;
  if (!projectClient?.clientId) {
    return undefined;
  }

  const client = type === 'client' ? project.client : project.partner!;
  let hoursInDay = client.hoursInDay;
  if (type === 'client' && project.details.client.hoursInDay) {
    hoursInDay = project.details.client.hoursInDay;
  }
  const tariff = getTariffs(projectClient);
  if (tariff.rateType === 'daily') {
    return {
      dailyRate: tariff.tariff,
      hourlyRate: tariff.tariff / hoursInDay,
    };
  }
  return {
    dailyRate: tariff.tariff * hoursInDay,
    hourlyRate: tariff.tariff,
  };
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
};
