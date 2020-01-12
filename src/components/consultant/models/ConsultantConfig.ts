import { FullFormConfig } from "../../../models";

export const defaultConsultantProperties: FullFormConfig = [
  { key: 'firstName' },
  { key: 'name' },
  { key: 'type', component: 'ConsultantTypeSelect' },
  { key: 'email', component: 'email' },
  { key: 'telephone', component: 'phone' },
]
