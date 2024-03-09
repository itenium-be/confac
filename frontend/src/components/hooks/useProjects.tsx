import {Moment} from 'moment';
import {useSelector} from 'react-redux';
import {ConfacState} from '../../reducers/app-state';
import { ClientModel } from '../client/models/ClientModels';
import { ConsultantModel } from '../consultant/models/ConsultantModel';
import InvoiceModel from '../invoice/models/InvoiceModel';
import {FullProjectModel} from '../project/models/FullProjectModel';
import {FullProjectMonthModel, IFullProjectMonthModel} from '../project/models/FullProjectMonthModel';
import { IProjectModel } from '../project/models/IProjectModel';
import {ProjectMonthModel} from '../project/models/ProjectMonthModel';


export function useProjects(month?: Moment): FullProjectModel[] {
  const {projects, clients, consultants} = useSelector((state: ConfacState) => ({
    projects: state.projects,
    clients: state.clients,
    consultants: state.consultants
  }));

  return projects.map(project => {
    const consultant = consultants.find(x => x._id === project.consultantId);
    const client = clients.find(x => x._id === project.client.clientId);
    const partner = project.partner && clients.find(x => project.partner && x._id === project.partner.clientId);
    return new FullProjectModel(project, month, consultant, client, partner);
  });
}





/** Resolve a single ProjectModel _id */
export function useProjectsMonth(projectMonthId?: string): FullProjectMonthModel | undefined {
  // TODO: here also:
  const confacState = useSelector((state: ConfacState) => state);
  if (!projectMonthId) {
    return undefined;
  }

  const projectMonth = confacState.projectsMonth.find(x => x._id === projectMonthId);
  if (!projectMonth) {
    return undefined;
  }

  const result = mapToProjectMonth(confacState, projectMonth);
  return result || undefined;
}



type ProjectMonthResolverState = {
  projectsMonth: ProjectMonthModel[];
  invoices: InvoiceModel[];
  projects: IProjectModel[];
  clients: ClientModel[];
  consultants: ConsultantModel[];
}


/** Resolve ProjectModel _ids to their corresponding models */
export function useProjectsMonths(): FullProjectMonthModel[] {
  const confacState: ProjectMonthResolverState = useSelector((state: ConfacState) => ({
    projectsMonth: state.projectsMonth,
    invoices: state.invoices,
    projects: state.projects,
    clients: state.clients,
    consultants: state.consultants,
  }));
  const result = confacState.projectsMonth.map(projectMonth => mapToProjectMonth(confacState, projectMonth));
  return result.filter(x => x !== null) as FullProjectMonthModel[];
}


export function useProjectMonthFromInvoice(invoiceId: string): FullProjectMonthModel | undefined {
  const fullProjectMonth = useSelector((state: ConfacState) => projectMonthResolve(state)
    .find(x => x.invoice && x.invoice._id === invoiceId));

  return fullProjectMonth;
}

/** Can be used to do the resolving in legacy Component classes */
export function singleProjectMonthResolve(state: ProjectMonthResolverState, projectMonthToSelect: ProjectMonthModel): FullProjectMonthModel | null {
  return mapToProjectMonth(state, projectMonthToSelect);
}

/** Can be used to do the resolving in legacy Component classes */
export function projectMonthResolve(confacState: ProjectMonthResolverState): FullProjectMonthModel[] {
  return confacState.projectsMonth
    .map(pm => mapToProjectMonth(confacState, pm))
    .filter(pm => !!pm) as FullProjectMonthModel[];
}


export function mapToProjectMonth(confacState: ProjectMonthResolverState, projectMonth: ProjectMonthModel, invoice?: InvoiceModel): null | FullProjectMonthModel {
  const project = confacState.projects.find(p => p._id === projectMonth.projectId);
  if (!project) {
    return null;
  }

  const consultant = confacState.consultants.find(c => c._id === project.consultantId);
  if (!consultant) {
    return null;
  }

  const client = project.client && confacState.clients.find(c => c._id === project.client.clientId);
  if (!client) {
    return null;
  }

  const fullModel: IFullProjectMonthModel = {
    _id: projectMonth._id,
    details: projectMonth,
    project,
    consultant,
    client,
    partner: project.partner && confacState.clients.find(c => project.partner && c._id === project.partner.clientId),
    invoice: invoice || confacState.invoices.find(i => i.projectMonth && i.projectMonth.projectMonthId === projectMonth._id),
  };

  return new FullProjectMonthModel(fullModel);
}
