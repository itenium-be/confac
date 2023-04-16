import {IProjectModel} from '../models/IProjectModel';


/** Calculated: Margin between Client/Partner for ProjectModel */
type ProjectMarkup = {
  totalClient: number,
  amount: number,
  /** Currently the calculation for "margin" is used */
  percentage: number,
}


export function getProjectMarkup(project: IProjectModel): ProjectMarkup {
  const totalClient = project.client.defaultInvoiceLines.reduce((prev, cur) => prev + cur.price, 0);

  if (project.partner?.clientId) {
    const totalPartner = project.partner.defaultInvoiceLines.reduce((prev, cur) => prev + cur.price, 0);
    const margin = totalClient - totalPartner;
    return {
      totalClient,
      amount: margin,
      // Calculation "margin"
      percentage: totalClient !== 0 ? (margin / totalClient) * 100 : 0,
      // Calculation "markup"
      // percentage: (totalClient / totalPartner) * 100 - 100
    };
  }

  return {
    totalClient,
    amount: 0,
    percentage: 0,
  };
}
