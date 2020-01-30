import React from 'react';
import {BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';
import {ProjectClientModel} from '../models/ProjectModel';
import {getNewProjectClient} from '../models/getNewProject';
import {ArrayInput} from '../../controls/form-controls/inputs/ArrayInput';
import {FullFormConfig} from '../../../models';


const config: FullFormConfig = [
  {key: 'clientId', component: 'ClientSelect', cols: 5},
  {key: 'tariff', component: 'money', prefix: '€', cols: 2},
  {key: 'rateType', component: 'InvoiceLineTypeSelect', cols: 2},
  {key: 'ref', component: 'text', cols: 3},
];


type EditProjectClientProps = BaseInputProps<ProjectClientModel>;

export const EditProjectClient = ({value, onChange}: EditProjectClientProps) => {
  const prjClient: ProjectClientModel = value || getNewProjectClient();
  return <ArrayInput config={config} model={prjClient} onChange={onChange} tPrefix="project.client." />;
};


export const EditProjectPartner = ({value, onChange}: EditProjectClientProps) => {
  const prjClient: ProjectClientModel = value || getNewProjectClient();
  return <ArrayInput config={config} model={prjClient} onChange={onChange} tPrefix="project.partner." />;
};
