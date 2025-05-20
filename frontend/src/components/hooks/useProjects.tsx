import {Moment} from 'moment';
import {useSelector} from 'react-redux';
import {ConfacState} from '../../reducers/app-state';
import {ClientModel} from '../client/models/ClientModels';
import {ConsultantModel} from '../consultant/models/ConsultantModel';
import InvoiceModel from '../invoice/models/InvoiceModel';
import {FullProjectModel} from '../project/models/FullProjectModel';
import {FullProjectMonthModel, IFullProjectMonthModel} from '../project/models/FullProjectMonthModel';
import {IProjectModel} from '../project/models/IProjectModel';
import {ProjectMonthModel} from '../project/models/ProjectMonthModel';


export function useProjects(month?: Moment): FullProjectModel[] {
  const projects = useSelector((state: ConfacState) => state.projects);
  const clients = useSelector((state: ConfacState) => state.clients);
  const consultants = useSelector((state: ConfacState) => state.consultants);

  return projects.map(project => {
    const consultant = consultants.find(x => x._id === project.consultantId);
    const client = clients.find(x => x._id === project.client.clientId);
    const partner = project.partner && clients.find(x => project.partner && x._id === project.partner.clientId);
    const endCustomer = !!project.endCustomer?.clientId ? clients.find(x => x._id === project.endCustomer!.clientId) : undefined;
    return new FullProjectModel(project, month, consultant, client, partner, endCustomer);
  });
}





/** Resolve a single ProjectModel _id */
export function useProjectsMonth(projectMonthId?: string): FullProjectMonthModel | undefined {
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
  const fullProjectMonth = useSelector((state: ConfacState) => {
    const invoice = state.invoices.find(x => x._id === invoiceId);
    if (!invoice?.projectMonth?.projectMonthId) {
      return undefined;
    }

    const projectMonth = state.projectsMonth.find(x => x._id === invoice?.projectMonth?.projectMonthId);
    if (!projectMonth) {
      return undefined;
    }

    return mapToProjectMonth(state, projectMonth as ProjectMonthModel, invoice);
  });

  return fullProjectMonth ?? undefined;
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


export function mapToProjectMonth(
  confacState: ProjectMonthResolverState,
  projectMonth: ProjectMonthModel,
  invoice?: InvoiceModel
): null | FullProjectMonthModel {

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
    endCustomer: !!project.endCustomer?.clientId ? confacState.clients.find(c => c._id === project.endCustomer!.clientId) : undefined,
    invoice: invoice || confacState.invoices.find(i => i.projectMonth && i.projectMonth.projectMonthId === projectMonth._id),
  };

  return new FullProjectMonthModel(fullModel);
}
