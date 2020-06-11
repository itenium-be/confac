import moment from 'moment';
import {ProjectModel, FullProjectModel, ProjectClientModel,
  ProjectStatus, ProjectStatusDaysPassedForRecentlyInactive} from '../models/ProjectModel';
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

  getStatusProject(startDate: moment.Moment, endDate?: moment.Moment): ProjectStatus {
    if (endDate) {
      if (moment(startDate).isAfter(moment())) {
        return ProjectStatus.NotYetActive;
      }

      if (moment().isBetween(startDate, endDate)) {
        return ProjectStatus.Active;
      }

      const daysEndedAgo = moment().diff(endDate, 'days');
      if (daysEndedAgo < ProjectStatusDaysPassedForRecentlyInactive) {
        return ProjectStatus.RecentlyInactive;
      }

      return ProjectStatus.NotActiveAnymore;
    }

    return ProjectStatus.Active;
  }

  getProjects(): FullProjectModel[] {
    if (!this.clients.length || !this.consultants.length) {
      return [];
    }

    // TODO: projectModel.active is set here ~> This new property will be sent to the backend
    // where it will be stored in the db and eventually become incorrect
    // --> Turn into a class with a "get active(): boolean { return this.getIsProjectActive(); }"
    return this.projects.map(project => ({
      _id: project._id,
      details: {...project, status: this.getStatusProject(project.startDate, project.endDate)},
      consultant: this.getConsultant(project.consultantId),
      client: this.getClient(project.client) as ClientModel,
      partner: this.getClient(project.partner),
    }));
  }
}
