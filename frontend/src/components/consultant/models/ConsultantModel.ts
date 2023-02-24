import {IAudit} from '../../../models';

export type ConsultantType = 'manager' | 'consultant' | 'freelancer' | 'externalConsultant';

export const ConsultantTypes: ConsultantType[] = ['manager', 'consultant', 'freelancer', 'externalConsultant'];

export interface ConsultantModel {
  _id: string,
  name: string,
  firstName: string,
  slug: string,
  type: ConsultantType,
  email: string,
  telephone: string,
  audit: IAudit;
  active: boolean;
}
