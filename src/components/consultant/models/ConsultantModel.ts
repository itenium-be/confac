export interface ConsultantModel {
  /**
    For now we can only create a consultant 
    and not edit an existing one that's why we make the '_id' property optional.
  */
  _id?: string,
  name: string,
  firstName: string,
  type: string,
  email: string,
  telephone: string,
  createdOn?: string,
}