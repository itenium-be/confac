import moment from 'moment';
import {ProjectModel, FullProjectModel} from '../models';
import {ConsultantModel} from '../../consultant/models';
import {ClientModel} from '../../client/models/ClientModels';

export class ProjectReferenceResolver {
  private projects: ProjectModel[]

  private consultants: ConsultantModel[]

  private clients: ClientModel[]

  constructor(projects: ProjectModel[], consultants: ConsultantModel[], clients: ClientModel[]) {
    this.projects = projects;
    this.consultants = consultants;
    this.clients = clients;
  }

  getConsultant(consultantId: string): ConsultantModel {
    return this.consultants.find((consultant) => consultant._id === consultantId) as ConsultantModel;
  }

  getClient(clientId: string): ClientModel {
    return this.clients.find((client) => client._id === clientId) as ClientModel;
  }

  getIsProjectActive(startDate: string, endDate: string): boolean {
    // ? An end date is not always provided
    if (startDate && endDate) {
      return moment().isBetween(startDate, endDate);
    }

    return moment().isAfter(startDate);
  }

  getProjects(): FullProjectModel[] {
    return this.projects.map((project) => ({
      details: {...project, isActive: this.getIsProjectActive(project.startDate, project.endDate)},
      consultant: this.getConsultant(project.consultantId),
      client: this.getClient(project.client),
      partner: this.getClient(project.partner),
    }));
  }
}
