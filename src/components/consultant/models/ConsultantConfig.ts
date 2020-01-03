import { FullFormConfig } from "../../../models";

export const defaultConsultantProperties: FullFormConfig = [
  { key: 'name' },
  { key: 'firstName' },
  { key: 'type', component: 'ConsultantTypeSelect' },
  { key: 'email', component: 'email' },
  { key: 'telephone', component: 'phone' },
]