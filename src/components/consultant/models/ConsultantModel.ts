export interface ConsultantModel {
  _id: string,
  name: string,
  firstName: string,
  /** TODO: this needs to be set on the backend */
  slug: string,
  type: string,
  email: string,
  telephone: string,
  createdOn?: string,
  active: boolean;
}
