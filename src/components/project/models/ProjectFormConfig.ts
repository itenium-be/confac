import { FullFormConfig } from "../../../models";

export const projectFormConfig: FullFormConfig = [
  { key: 'startDate', component: 'date', cols: { md: 5 } },
  { key: 'endDate', component: 'date', cols: { md: 5 } },
  { key: 'partner', component: 'ClientSelect', cols: { md: 5 } },
  { key: 'partnerTariff', component: 'money', prefix: '€', cols: { md: 5 } },
  { key: 'client', component: 'ClientSelect', cols: { md: 5 } },
  { key: 'clientTariff', component: 'money', prefix: '€', cols: { md: 5 } },
]