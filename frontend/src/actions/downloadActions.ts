import request from 'superagent-bluebird-promise';
import moment from 'moment';
import {catchHandler} from './utils/fetch';
import {buildUrl} from './utils/buildUrl';
import InvoiceModel from '../components/invoice/models/InvoiceModel';
import {Attachment, CoreInvoiceAttachments} from '../models';
import {ClientModel} from '../components/client/models/ClientModels';
import {getInvoiceFileName, getDownloadUrl, previewPdf, downloadAttachment} from './utils/download-helpers';
import {ProjectMonthOverviewModel} from '../components/project/models/ProjectMonthModel';
import {authService} from '../components/users/authService';


export function getInvoiceDownloadUrl(
  fileNameTemplate: string,
  invoice: InvoiceModel,
  attachment: CoreInvoiceAttachments | Attachment = 'pdf',
  downloadType?: 'preview' | 'download',
): string {
  const fileType = invoice.isQuotation ? 'quotation' : 'invoice';
  const attachmentType = typeof attachment === 'string' ? attachment : attachment.type;
  const filename = typeof attachment === 'string' || attachment.type === 'pdf' || attachment.type === 'xml' ?
    getInvoiceFileName(fileNameTemplate, invoice, attachmentType) : attachment.fileName;

  return getDownloadUrl(fileType, invoice._id, attachmentType, filename, downloadType);
}


export function getClientDownloadUrl(
  client: ClientModel,
  attachment: Attachment,
  downloadType: 'preview' | 'download' = 'download',
): string {
  return getDownloadUrl('client', client._id, attachment.type, attachment.fileName, downloadType);
}

export function getProjectMonthOverviewDownloadUrl(
  projectMonthOverview: ProjectMonthOverviewModel,
  attachment: Attachment,
  downloadType: 'preview' | 'download' = 'download',
): string {
  return getDownloadUrl('project_month_overview', projectMonthOverview._id, attachment.type, attachment.fileName, downloadType);
}




export function previewInvoice(fileName: string, data: InvoiceModel) {
  return dispatch => {
    request.post(buildUrl('/invoices/preview'))
      .set('Authorization', authService.getBearer())
      .responseType('blob')
      .send(data)
      .then(res => {
        previewPdf(getInvoiceFileName(fileName, data, 'pdf'), res.body);
        return res.text;
      })
      .catch(catchHandler);
  };
}






export function downloadInvoicesExcel(ids: string[]) {
  return dispatch => {
    request.post(buildUrl('/invoices/excel'))
      .responseType('blob')
      .set('Authorization', authService.getBearer())
      .send(ids)
      .then(res => {
        console.log('downloaded', res); // eslint-disable-line
        const fileName = `invoices-${moment().format('YYYY-MM-DD')}.csv`;
        downloadAttachment(fileName, res.body);
      });
  };
}


export function downloadInvoicesZip(ids: string[]) {
  return dispatch => {
    request.post(buildUrl('/attachments'))
      .responseType('blob')
      .set('Authorization', authService.getBearer())
      .send(ids)
      .then(res => {
        // console.log('downloaded', res);
        const fileName = `invoices-${moment().format('YYYY-MM-DD')}.zip`;
        downloadAttachment(fileName, res.body);
      });
  };
}
