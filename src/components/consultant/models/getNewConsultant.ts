import {ConsultantModel} from './ConsultantModel';

export const getNewConsultant = (): ConsultantModel => ({
  _id: '',
  name: '',
  firstName: '',
  slug: '',
  type: 'consultant',
  email: '',
  telephone: '',
});
