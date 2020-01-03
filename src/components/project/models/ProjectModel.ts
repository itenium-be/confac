export interface ProjectModel {
  _id?: string,
  consultantId: string,
  startDate: string,
  endDate: string,
  partner: string,
  partnerTariff: number,
  client: string,
  clientTariff: number,
}