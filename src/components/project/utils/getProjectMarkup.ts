import {IProjectModel} from '../models/IProjectModel';


/** Calculated: Markup between Client/Partner for ProjectModel */
type ProjectMarkup = {
  totalClient: number,
  amount: number,
  percentage: number,
}


export function getProjectMarkup(project: IProjectModel): ProjectMarkup {
  const totalClient = project.client.defaultInvoiceLines.reduce((prev, cur) => prev + cur.price, 0);

  if (project.partner) {
    const totalPartner = project.partner.defaultInvoiceLines.reduce((prev, cur) => prev + cur.price, 0);
    return {
      totalClient,
      amount: totalClient - totalPartner,
      percentage: ((totalClient / totalPartner) * 100) - 100,
    };
  }

  return {
    totalClient,
    amount: 0,
    percentage: 0,
  };
}
