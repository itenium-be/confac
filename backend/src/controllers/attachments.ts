import {Request, Response} from 'express';
import JSZip from 'jszip';
import moment from 'moment';
import {ObjectID} from 'mongodb';
import {IAttachmentCollection, IAttachmentModelConfig, attachmentModelsConfig, IAttachments} from '../models/attachments';
import {CollectionNames, SocketEventTypes} from '../models/common';
import {IInvoice} from '../models/invoices';
import {IProjectMonthOverview, TimesheetCheckAttachmentType} from '../models/projectsMonth';
import {emitEntityEvent} from './utils/entity-events';
import {ConfacRequest} from '../models/technical';


const saveAttachment = async (req: Request, attachmentModelConfig: IAttachmentModelConfig, file: Express.Multer.File) => {
  const {id, type} = req.params;
  const {standardCollectionName, attachmentCollectionName} = attachmentModelConfig;

  const data = await req.db.collection<IAttachments>(standardCollectionName).findOne({_id: new ObjectID(id)});
  const {_id, attachments = []} = data!;
  const updatedAttachments = attachments.filter(a => a.type !== type);
  updatedAttachments.push({
    type,
    fileName: file.fieldname || file.originalname,
    originalFileName: file.originalname,
    fileType: file.mimetype,
    lastModifiedDate: new Date().toISOString(),
  });

  const inserted = await req.db.collection(standardCollectionName)
    .findOneAndUpdate({_id: new ObjectID(_id)}, {$set: {attachments: updatedAttachments}}, {returnOriginal: false});

  const result = inserted.value;
  if (result) {
    emitEntityEvent(
      req as unknown as ConfacRequest,
      SocketEventTypes.EntityUpdated,
      standardCollectionName,
      result._id,
      result,
    );
  }

  await req.db.collection(attachmentCollectionName)
    .findOneAndUpdate({_id: new ObjectID(_id)}, {$set: {[type]: file.buffer}}, {upsert: true});

  return result;
};




export const saveAttachmentController = async (req: Request, res: Response) => {
  const {model, id, type} = req.params;
  const [file] = req.files as Express.Multer.File[];

  const attachmentModelConfig: IAttachmentModelConfig | undefined = attachmentModelsConfig.find(m => m.name === model);

  if (!attachmentModelConfig) {
    return res.status(501).send('Model not supported');
  }

  if (attachmentModelConfig.standardCollectionName === CollectionNames.ATTACHMENTS_PROJECT_MONTH_OVERVIEW) {
    const month = id;
    const projectMonthOverviewCollection = req.db.collection<IProjectMonthOverview>(CollectionNames.ATTACHMENTS_PROJECT_MONTH_OVERVIEW);
    const inserted = await projectMonthOverviewCollection.findOneAndUpdate({month}, {
      $set: {
        [type]: file.buffer,
        fileDetails: {
          type,
          fileName: file.fieldname || file.originalname,
          originalFileName: file.originalname,
          fileType: file.mimetype,
          lastModifiedDate: new Date().toISOString(),
        },
        month,
      },
    }, {
      projection: {[TimesheetCheckAttachmentType]: false},
      upsert: true,
      returnOriginal: false,
    });

    const updatedProjectsMonthOverview = inserted.value;
    // ATTN: This change is not emitted with socket.io (it doesn't exist as an entity)
    //       Which is "ok" because we're not using this functionality anyway?
    return res.send(updatedProjectsMonthOverview);
  }

  const result = await saveAttachment(req, attachmentModelConfig, file);

  return res.send(result);
};







const deleteAttachment = async (id: string, type: string, req: Request, attachmentModelConfig: IAttachmentModelConfig) => {
  const {standardCollectionName, attachmentCollectionName} = attachmentModelConfig;

  const data = await req.db.collection<IAttachments>(standardCollectionName).findOne({_id: new ObjectID(id)});
  const {_id, attachments} = data!;

  const updatedAttachments = attachments.filter(attachment => attachment.type !== type);
  const inserted = await req.db.collection(standardCollectionName).findOneAndUpdate(
    {_id},
    {$set: {attachments: updatedAttachments}},
    {returnOriginal: false},
  );

  const result = inserted.value;
  if (result) {
    emitEntityEvent(
      req as unknown as ConfacRequest,
      SocketEventTypes.EntityUpdated,
      standardCollectionName,
      result._id,
      result,
    );
  }

  await req.db.collection(attachmentCollectionName).findOneAndUpdate({_id}, {$set: {[type]: undefined}});

  return result;
};



export const deleteAttachmentController = async (req: Request, res: Response) => {
  const {id, model, type} = req.params;

  const attachmentModelConfig: IAttachmentModelConfig | undefined = attachmentModelsConfig.find(m => m.name === model);

  if (!attachmentModelConfig) {
    return res.status(501).send('Model not supported');
  }

  if (type === 'pdf' && model === 'invoice') {
    return res.status(500).send('The invoice itself cannot be deleted.');
  }

  if (attachmentModelConfig.standardCollectionName === CollectionNames.ATTACHMENTS_PROJECT_MONTH_OVERVIEW) {
    const {attachmentCollectionName} = attachmentModelConfig;
    await req.db.collection(attachmentCollectionName).findOneAndDelete({_id: new ObjectID(id)});
    return res.send(id);
  }

  const result = await deleteAttachment(id, type, req, attachmentModelConfig);

  return res.send(result);
};







export const getAttachmentController = async (req: Request, res: Response) => {
  const {id, model, type, fileName} = req.params;
  const attachmentModelConfig: IAttachmentModelConfig | undefined = attachmentModelsConfig.find(m => m.name === model);

  if (!attachmentModelConfig) {
    return res.status(501).send('Model type not supported');
  }

  const attachment = await req.db
    .collection(attachmentModelConfig.attachmentCollectionName)
    .findOne({_id: new ObjectID(id)});

  if (!attachment || !attachment[type]) {
    return res.status(500).send('Could not get the requested file.');
  }

  const attachmentBuffer: Buffer = attachment[type].buffer;

  let responseType: string = '';
  if (!req.query.download) {
    const ext = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();

    const determineResponseType = (): string => {
      if (type === 'pdf' || ext === 'pdf') {
        return 'application/pdf';
      } if (['png', 'bmp', 'jpg', 'gif'].includes(ext)) {
        return `image/${ext}`;
      } if (['html', 'htm'].includes(ext)) {
        return 'text/html';
      } if (['ppt'].includes(ext)) {
        return 'application/vnd.ms-powerpoint';
      } if (['pptx'].includes(ext)) {
        return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      } if (['txt'].includes(ext)) {
        return 'text/plain';
      } if (['xls'].includes(ext)) {
        return 'application/vnd.ms-excel';
      } if (['xlsx', 'xlsm'].includes(ext)) {
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      } if (['csv'].includes(ext)) {
        return 'text/csv';
      } if (['doc'].includes(ext)) {
        return 'application/msword';
      } if (['docx'].includes(ext)) {
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } if (['odp'].includes(ext)) {
        return 'application/vnd.oasis.opendocument.presentation';
      } if (['ods'].includes(ext)) {
        return 'application/vnd.oasis.opendocument.spreadsheet';
      } if (['odt'].includes(ext)) {
        return 'application/vnd.oasis.opendocument.text';
      }
      return '';
    };

    responseType = determineResponseType();
  }

  // Download the file
  if (!fileName) {
    req.logger.info(`Downloading a file without knowing the filename for ${JSON.stringify(req.params)}`);
  }

  return res
    .type(responseType)
    .set('Content-Disposition', `inline;filename=${encodeURIComponent(fileName)}`)
    .send(attachmentBuffer);
};







export const createZipWithInvoicesController = async (req: Request, res: Response) => {
  const invoiceIds: ObjectID[] = req.body.map((invoiceId: string) => new ObjectID(invoiceId));

  const attachments: IAttachmentCollection[] = await req.db.collection(CollectionNames.ATTACHMENTS).find({_id: {$in: invoiceIds}})
    .toArray();

  const invoices: IInvoice[] = await req.db.collection(CollectionNames.INVOICES).find({_id: {$in: invoiceIds}})
    .toArray();

  const zip = new JSZip();

  attachments.forEach(attachment => {
    const invoice = invoices.find(i => i._id.toString() === attachment._id.toString());
    const fileName = invoice && `${moment(invoice.date).format('YYYY-MM-DD')} - ${invoice.number} - ${invoice.client.name}.pdf`;
    zip.file(fileName || `${attachment._id}.pdf`, attachment.pdf.buffer);
  });

  const zipWithInvoices = await zip.generateAsync({type: 'nodebuffer'});

  res.send(zipWithInvoices);
};
