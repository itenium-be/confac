import {Request, Response} from 'express';
import {ObjectID} from 'mongodb';
import moment from 'moment';
import {IProjectMonth, IProjectMonthOverview, TimesheetCheckAttachmentType} from '../models/projectsMonth';
import {CollectionNames, createAudit, SocketEventTypes, updateAudit} from '../models/common';
import {ConfacRequest} from '../models/technical';
import {saveAudit} from './utils/audit-logs';
import {emitEntityEvent} from './utils/entity-events';


export const getProjectsPerMonthController = async (req: Request, res: Response) => {
  const query = req.query as any;
  const getFrom = moment()
    .subtract(query.months, 'months')
    .startOf('month')
    .format('YYYY-MM-DD');
  const projectsPerMonth = await req.db.collection(CollectionNames.PROJECTS_MONTH)
    .find({month: {$gte: getFrom}})
    .toArray();
  return res.send(projectsPerMonth);
};

/** Returns only file details of a projects month attachment overview (all timesheets combined in one file) */
export const getProjectsPerMonthOverviewController = async (req: Request, res: Response) => {
  const query = req.query as any;
  const getFrom = moment()
    .subtract(query.months, 'months')
    .startOf('month')
    .format('YYYY-MM-DD');
  const projectsPerMonthOverview = await req.db.collection<IProjectMonthOverview>(CollectionNames.ATTACHMENTS_PROJECT_MONTH_OVERVIEW)
    .find({month: {$gte: getFrom}}, {projection: {[TimesheetCheckAttachmentType]: false}})
    .toArray();
  return res.send(projectsPerMonthOverview);
};


const ProjectProformaOptions = ['no', 'inboundWithTax', 'inboundWithoutTax', 'outboundWithTax', 'outboundWithoutTax'] as const;
type ProjectProforma = typeof ProjectProformaOptions[number];

type SourceProjectData = {
  projectId: string;
  proforma: ProjectProforma;
}


/** Create all projectMonths for the specified month */
export const createProjectsMonthController = async (req: ConfacRequest, res: Response) => {
  const {projectData, month}: {projectData: SourceProjectData[]; month: string} = req.body;

  // const projects = await req.db.collection<IProject>(CollectionNames.PROJECTS).find().toArray();
  // const activeProjects = findActiveProjectsForSelectedMonth(month, projects);

  const createdProjectsMonth = await Promise.all(projectData.map(async projectMonthSource => {
    const projectMonth: IProjectMonth = {
      _id: new ObjectID(),
      month,
      projectId: new ObjectID(projectMonthSource.projectId),
      audit: createAudit(req.user),
      verified: false,
      inbound: {
        nr: '',
        status: 'new',
        proforma: !projectMonthSource.proforma || projectMonthSource.proforma === 'no' ? undefined : {status: 'new'},
      },
      timesheet: {validated: false},
      attachments: [],
    };

    const inserted = await req.db.collection<IProjectMonth>(CollectionNames.PROJECTS_MONTH).insertOne(projectMonth);
    const [createdProjectMonth] = inserted.ops;
    return createdProjectMonth;
  }));

  emitEntityEvent(req, SocketEventTypes.EntityCreated, CollectionNames.PROJECTS_MONTH, null, createdProjectsMonth);

  return res.send(createdProjectsMonth);
};



export const patchProjectsMonthController = async (req: ConfacRequest, res: Response) => {
  const {_id, ...projectMonth}: IProjectMonth = req.body;

  if (_id) {
    projectMonth.audit = updateAudit(projectMonth.audit, req.user);
    const projMonthCollection = req.db.collection<IProjectMonth>(CollectionNames.PROJECTS_MONTH);
    const {value: originalProjectMonth} = await projMonthCollection.findOneAndUpdate(
      {_id: new ObjectID(_id)},
      {$set: projectMonth},
      {returnOriginal: true},
    );
    await saveAudit(req, 'projectMonth', originalProjectMonth, projectMonth);
    const projectMonthResponse = {_id, ...projectMonth};
    emitEntityEvent(req, SocketEventTypes.EntityUpdated, CollectionNames.PROJECTS_MONTH, projectMonthResponse._id, projectMonthResponse);
    return res.send(projectMonthResponse);
  }

  const inserted = await req.db.collection<IProjectMonth>(CollectionNames.PROJECTS_MONTH).insertOne({
    ...projectMonth,
    audit: createAudit(req.user),
  });
  const [createdProjectMonth] = inserted.ops;
  emitEntityEvent(req, SocketEventTypes.EntityCreated, CollectionNames.PROJECTS_MONTH, createdProjectMonth._id, createdProjectMonth);
  return res.send(createdProjectMonth);
};



export const deleteProjectsMonthController = async (req: ConfacRequest, res: Response) => {
  const id = req.body.id;
  await req.db.collection(CollectionNames.PROJECTS_MONTH).findOneAndDelete({_id: new ObjectID(id)});
  await req.db.collection(CollectionNames.ATTACHMENTS_PROJECT_MONTH).findOneAndDelete({_id: new ObjectID(id)});
  emitEntityEvent(req, SocketEventTypes.EntityDeleted, CollectionNames.PROJECTS_MONTH, id, null);
  return res.send(id);
};



const PROJECTS_EXCEL_HEADERS = [
  'Consultant', 'Consultant Type', 'Start datum', 'Eind datum', 'Onderaannemer',
  'Uurtarief', 'Dagtarief', 'Klant', 'Klant uurtarief', 'Klant dagtarief',
  'Margin', 'Margin %', 'Eindklant', 'Account manager', 'Raamcontract', 'Contract werkopdracht',
  'EC Dagkost', 'Maand', 'Dagen onder contract', 'Dagen timesheet', 'Fictieve marge/dag',
];

/** Create simple CSV output of the data[][] passed in the body */
export const generateExcelForProjectsMonthController = async (req: Request, res: Response) => {
  const separator = ';';
  const excelHeader = `${PROJECTS_EXCEL_HEADERS.join(separator)}\r\n`;
  const excelBody = req.body.map((record: any[]) => record.join(separator)).join('\r\n');
  const excel = `${excelHeader}${excelBody}`;
  return res.send(excel);
};
