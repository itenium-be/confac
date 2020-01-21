import {ConsultantModel} from '../models/ConsultantModel';

export const initNewConsultant = (): ConsultantModel => ({
  _id: '',
  name: '',
  firstName: '',
  type: 'consultant',
  email: '',
  telephone: '',
});
