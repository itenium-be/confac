import moment from 'moment';
import {IProject} from '../../models/projects';
import {IConsultant} from '../../models/consultants';
import {IClient} from '../../models/clients';
import {IUser} from '../../models/user';
import {ContractStatus} from '../../models/contracts';

/** How long a finished project stays in the export */
const KEEP_ENDED_PROJECTS_FOR_MONTHS = 3;

type JourneyPerson = {
  id: string;
  name: string;
  email: string;
};

type JourneyClient = {
  id: string;
  name: string;
};

type JourneyProject = {
  id: string;
  startDate: string;
  endDate: string | null;
  consultant: JourneyPerson;
  accountManager: JourneyPerson | null;
  client: JourneyClient | null;
  endCustomer: JourneyClient | null;
  contract: {
    frameworkAgreement: ContractStatus;
    project: ContractStatus;
  };
};

const toPerson = (person: IConsultant | IUser): JourneyPerson => ({
  id: person._id.toString(),
  name: `${person.firstName} ${person.name}`,
  email: person.email,
});

const toClient = (client?: IClient): JourneyClient | null => (
  client ? {id: client._id.toString(), name: client.name} : null
);

const isRunning = (project: IProject, today: moment.Moment): boolean => {
  if (!project.endDate) {
    return true;
  }
  return moment(project.endDate).isSameOrAfter(today.clone().subtract(KEEP_ENDED_PROJECTS_FOR_MONTHS, 'months'));
};

export function getJourneyProjects(
  projects: IProject[],
  consultants: IConsultant[],
  users: IUser[],
  clients: IClient[],
  today: moment.Moment = moment(),
): JourneyProject[] {
  const consultantsById = new Map(consultants.map(c => [c._id.toString(), c]));
  const usersById = new Map(users.map(u => [u._id.toString(), u]));
  const clientsById = new Map(clients.map(c => [c._id.toString(), c]));

  return projects.flatMap(project => {
    const consultant = consultantsById.get(project.consultantId);
    if (consultant?.type !== 'consultant' || !isRunning(project, today)) {
      return [];
    }

    const accountManager = project.accountManager ? usersById.get(project.accountManager) : undefined;
    const endCustomerId = project.forEndCustomer ? project.endCustomer?.clientId : undefined;
    const client = clientsById.get(project.client.clientId);

    return [{
      id: project._id.toString(),
      startDate: moment(project.startDate).format('YYYY-MM-DD'),
      endDate: project.endDate ? moment(project.endDate).format('YYYY-MM-DD') : null,
      consultant: toPerson(consultant),
      accountManager: accountManager ? toPerson(accountManager) : null,
      client: toClient(client),
      endCustomer: toClient(endCustomerId ? clientsById.get(endCustomerId) : undefined),
      contract: {
        frameworkAgreement: client?.frameworkAgreement?.status || 'NoContract',
        project: project.contract?.status || 'NoContract',
      },
    }];
  });
}
