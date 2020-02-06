export type ConsultantType = 'manager' | 'consultant' | 'freelancer' | 'externalConsultant';

export const ConsultantTypes: ConsultantType[] = ['manager', 'consultant', 'freelancer', 'externalConsultant'];

export interface ConsultantModel {
  _id: string,
  name: string,
  firstName: string,
  /** TODO: this needs to be set on the backend */
  slug: string,
  type: ConsultantType,
  email: string,
  telephone: string,
  createdOn?: string,
  active: boolean;
}
