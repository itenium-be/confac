import {ConsultantModel} from './ConsultantModel';

export const getNewConsultant = (): ConsultantModel => ({
  _id: '',
  name: '',
  firstName: '',
  type: 'consultant',
  email: '',
  telephone: '',
});
