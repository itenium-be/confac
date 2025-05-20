import {MinimalInputProps} from '../../controls/form-controls/inputs/BaseInput';
import {ProjectClientModel, ProjectEndCustomerModel} from '../models/IProjectModel';
import {getNewProjectClient} from '../models/getNewProject';
import {ArrayInput} from '../../controls/form-controls/inputs/ArrayInput';
import {FullFormConfig} from '../../../models';
import {getNewInvoiceLine, InvoiceLine} from '../../invoice/models/InvoiceLineModels';
import {DefaultHoursInDay} from '../../client/models/getNewClient';

/** Map Tariff & RateType to the client/partner.defaultInvoiceLines[0].price/type */
const Bridge = ({value = [getNewInvoiceLine()], onChange}: MinimalInputProps<InvoiceLine[]>) => {
  const realOnChange = (firstLine: InvoiceLine) => {
    const newArr = value.filter((v, i) => i !== 0);
    const originalLine = value.find((v, i) => i === 0)!;

    if (firstLine.price && originalLine.type !== firstLine.type) {
      if (firstLine.type === 'daily') {
        firstLine.price *= DefaultHoursInDay;
      } else {
        firstLine.price /= DefaultHoursInDay;
      }
    }

    onChange([firstLine, ...newArr]);
  };

  return (
    <ArrayInput
      config={defaultInvoiceLinesConfig}
      onChange={lines => realOnChange(lines)}
      model={value[0]}
      tPrefix="project.client."
    />
  );
};



const defaultInvoiceLinesConfig: FullFormConfig = [
  {key: 'price', label: 'project.client.tariff', component: 'basic-math', prefix: '€', cols: 2},
  {key: 'type', label: 'project.client.rateType', component: 'ProjectLineTypeSelect', cols: 2},
];



type EditProjectClientProps = MinimalInputProps<ProjectClientModel>;



const partnerConfig: FullFormConfig = [
  {key: 'clientId', component: 'PartnerSelectWithCreateModal', cols: 5},
  {key: 'defaultInvoiceLines', label: '', component: Bridge, cols: false},
  {key: 'ref', component: 'text', cols: 3},
];

export const EditProjectPartner = ({value, onChange}: EditProjectClientProps) => {
  const prjClient: ProjectClientModel = value || getNewProjectClient();
  return <ArrayInput config={partnerConfig} model={prjClient} onChange={onChange} tPrefix="project.partner." />;
};


function getClientConfig(prjClient: ProjectClientModel, asEndCustomer: boolean): FullFormConfig {
  const clientIdComponent = asEndCustomer ? 'EndCustomerSelectWithCreateModal' : 'ClientSelectWithCreateModal';
  const hasCustomInvoicingLines = prjClient.advancedInvoicing || prjClient.defaultInvoiceLines.length > 1;
  if (hasCustomInvoicingLines) {
    return [
      {title: {title: 'client.name', level: 2}},
      {key: 'clientId', component: clientIdComponent, cols: 5},
      {key: 'ref', component: 'text', cols: 3},
      {title: {title: 'config.defaultInvoiceLines', level: 4}},
      {key: 'defaultInvoiceLines', label: '', component: 'EditInvoiceLines', cols: 12},
    ];
  }

  return [
    {key: 'clientId', component: clientIdComponent, cols: 5},
    {key: 'defaultInvoiceLines', label: '', component: Bridge, cols: false},
    {key: 'ref', component: 'text', cols: 3},
  ];
}

export const EditProjectClientAsEndCustomer = ({value, onChange}: EditProjectClientProps) => {
  const prjClient: ProjectClientModel = value || getNewProjectClient();
  const config = getClientConfig(prjClient, true);
  return <ArrayInput config={config} model={prjClient} onChange={onChange} tPrefix="project.client." />;
};

export const EditProjectClient = ({value, onChange}: EditProjectClientProps) => {
  const prjClient: ProjectClientModel = value || getNewProjectClient();
  const config = getClientConfig(prjClient, false);
  return <ArrayInput config={config} model={prjClient} onChange={onChange} tPrefix="project.client." />;
};


type EditProjectEndCustomerProps = MinimalInputProps<ProjectEndCustomerModel>;

const endCustomerConfig: FullFormConfig = [
  {key: 'clientId', component: 'EndCustomerSelectWithCreateModal', cols: 5},
  {key: 'contact', component: 'text', cols: 2, suffix: 'user'},
  {key: 'notes', component: 'text', cols: 5},
];

export const EditProjectEndCustomer = ({value, onChange}: EditProjectEndCustomerProps) => {
  const projectEndCustomer: ProjectEndCustomerModel | undefined | null = value;

  if (!projectEndCustomer) {
    return null;
  }

  return <ArrayInput config={endCustomerConfig} model={projectEndCustomer} onChange={onChange} tPrefix="project.endCustomer." />;
};
