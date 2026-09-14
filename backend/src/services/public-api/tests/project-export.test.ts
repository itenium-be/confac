import moment from 'moment';
import {ObjectID} from 'mongodb';
import {getJourneyProjects} from '../project-export';
import {IProject} from '../../../models/projects';
import {IConsultant} from '../../../models/consultants';
import {IClient} from '../../../models/clients';
import {IUser} from '../../../models/user';

const today = moment('2026-09-14');

type ProjectOptions = {
  consultantId?: string;
  accountManager?: string;
  startDate?: string;
  endDate?: string;
  clientId?: string;
  endCustomerId?: string;
  forEndCustomer?: boolean;
  contractStatus?: string;
};

const buildProject = (options: ProjectOptions = {}) => ({
  _id: new ObjectID('000000000000000000000001'),
  consultantId: options.consultantId || 'c1',
  accountManager: options.accountManager,
  startDate: options.startDate || '2026-01-01',
  endDate: options.endDate,
  client: {clientId: options.clientId || 'kl1'},
  forEndCustomer: options.forEndCustomer ?? !!options.endCustomerId,
  endCustomer: options.endCustomerId ? {clientId: options.endCustomerId, contact: 'Jos', notes: ''} : null,
  contract: options.contractStatus ? {status: options.contractStatus, notes: ''} : undefined,
} as unknown as IProject);

const buildConsultant = (id = 'c1', type = 'consultant') => ({
  _id: id,
  firstName: 'Jos',
  name: 'Vermeulen',
  email: 'jos@itenium.be',
  type,
} as unknown as IConsultant);

const buildUser = (id = 'u1') => ({
  _id: id,
  firstName: 'Wouter',
  name: 'Vanschandevijl',
  email: 'wouter@itenium.be',
} as unknown as IUser);

const buildClient = (id = 'kl1', name = 'KBC', frameworkStatus?: string) => ({
  _id: id,
  name,
  frameworkAgreement: frameworkStatus ? {status: frameworkStatus, notes: ''} : undefined,
} as unknown as IClient);

const run = (projects: IProject[], consultants = [buildConsultant()], users = [buildUser()], clients = [buildClient()]) => (
  getJourneyProjects(projects, consultants, users, clients, today)
);


describe('getJourneyProjects :: which projects', () => {
  it('includes a project without an end date', () => {
    expect(run([buildProject()])).toHaveLength(1);
  });

  it('includes a project that ended two months ago', () => {
    expect(run([buildProject({endDate: '2026-07-20'})])).toHaveLength(1);
  });

  it('excludes a project that ended four months ago', () => {
    expect(run([buildProject({endDate: '2026-05-20'})])).toHaveLength(0);
  });

  it('includes a project that has not started yet', () => {
    expect(run([buildProject({startDate: '2026-12-01'})])).toHaveLength(1);
  });

  it('excludes a freelancer', () => {
    expect(run([buildProject()], [buildConsultant('c1', 'freelancer')])).toHaveLength(0);
  });

  it('excludes a manager and an externalConsultant', () => {
    const projects = [buildProject({consultantId: 'c1'}), buildProject({consultantId: 'c2'})];
    const consultants = [buildConsultant('c1', 'manager'), buildConsultant('c2', 'externalConsultant')];
    expect(run(projects, consultants)).toHaveLength(0);
  });

  it('excludes a project of an unknown consultant', () => {
    expect(run([buildProject({consultantId: 'nope'})])).toHaveLength(0);
  });
});


describe('getJourneyProjects :: mapping', () => {
  it('maps the project itself', () => {
    const [project] = run([buildProject({startDate: '2026-01-01', endDate: '2026-09-30'})]);
    expect(project.id).toBe('000000000000000000000001');
    expect(project.startDate).toBe('2026-01-01');
    expect(project.endDate).toBe('2026-09-30');
  });

  it('has a null endDate when the project has no end date', () => {
    expect(run([buildProject()])[0].endDate).toBeNull();
  });

  it('maps the consultant', () => {
    expect(run([buildProject()])[0].consultant).toEqual({
      id: 'c1',
      name: 'Jos Vermeulen',
      email: 'jos@itenium.be',
    });
  });

  it('maps the account manager', () => {
    expect(run([buildProject({accountManager: 'u1'})])[0].accountManager).toEqual({
      id: 'u1',
      name: 'Wouter Vanschandevijl',
      email: 'wouter@itenium.be',
    });
  });

  it('has no account manager when the project has none', () => {
    expect(run([buildProject()])[0].accountManager).toBeNull();
  });

  it('has no account manager when the user no longer exists', () => {
    expect(run([buildProject({accountManager: 'gone'})])[0].accountManager).toBeNull();
  });

  it('maps the client', () => {
    expect(run([buildProject()])[0].client).toEqual({id: 'kl1', name: 'KBC'});
  });

  it('maps the end customer', () => {
    const clients = [buildClient(), buildClient('kl2', 'Ergo')];
    const [project] = run([buildProject({endCustomerId: 'kl2'})], undefined, undefined, clients);
    expect(project.endCustomer).toEqual({id: 'kl2', name: 'Ergo'});
  });

  it('has no end customer when the project is not for one', () => {
    expect(run([buildProject()])[0].endCustomer).toBeNull();
  });

  it('has no end customer when forEndCustomer is off', () => {
    const clients = [buildClient(), buildClient('kl2', 'Ergo')];
    const projects = [buildProject({endCustomerId: 'kl2', forEndCustomer: false})];
    expect(run(projects, undefined, undefined, clients)[0].endCustomer).toBeNull();
  });

  it('maps both contract statuses', () => {
    const clients = [buildClient('kl1', 'KBC', 'BothSigned')];
    const [project] = run([buildProject({contractStatus: 'Sent'})], undefined, undefined, clients);
    expect(project.contract).toEqual({frameworkAgreement: 'BothSigned', project: 'Sent'});
  });

  it('falls back to NoContract for both statuses', () => {
    expect(run([buildProject()])[0].contract).toEqual({
      frameworkAgreement: 'NoContract',
      project: 'NoContract',
    });
  });
});
