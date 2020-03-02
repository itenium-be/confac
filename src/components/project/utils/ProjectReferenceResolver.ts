// eslint-disable-next-line max-classes-per-file
import moment from 'moment';
import {ProjectModel, FullProjectModel, ProjectClientModel} from '../models/ProjectModel';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
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
    return this.consultants.find(consultant => consultant._id === consultantId) as ConsultantModel;
  }

  getClient(client: ProjectClientModel | undefined): ClientModel | undefined {
    if (!client) {
      return undefined;
    }
    return this.clients.find(c => c._id === client.clientId) || undefined;
  }

  getProjects(): FullProjectModel[] {
    if (!this.clients.length || !this.consultants.length) {
      return [];
    }

    return this.projects.map(project => ({
      _id: project._id,
      details: project,
      consultant: this.getConsultant(project.consultantId),
      client: this.getClient(project.client) as ClientModel,
      partner: this.getClient(project.partner),
    }));
  }
}

export class ProjectDetailsFilters {
  private projectDetails: ProjectModel

  constructor(projectDetails: ProjectModel) {
    this.projectDetails = projectDetails;
  }

  get active(): boolean {
    const {startDate, endDate} = this.projectDetails;
    const today = new Date();

    if (endDate) {
      const isStartDateInSameMonthOrBefore = moment(startDate).isSameOrBefore(today, 'months');
      const isEndDateInSameMonthOrAfter = moment(endDate).isSameOrAfter(today, 'months');
      return isStartDateInSameMonthOrBefore && isEndDateInSameMonthOrAfter;
    }

    return moment(startDate).isSameOrBefore(today, 'months');
  }
}
