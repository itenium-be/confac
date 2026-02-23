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
import {ConsultantModel} from '../components/consultant/models/ConsultantModel';
import {AppDispatch} from '../types/redux';


export function getInvoiceDownloadUrl(
  fileNameTemplate: string,
  invoice: InvoiceModel,
  attachment: CoreInvoiceAttachments | Attachment = 'pdf',
  downloadType?: 'preview' | 'download',
): string {
  const fileType = invoice.isQuotation ? 'quotation' : 'invoice';
  const attachmentType = typeof attachment === 'string' ? attachment : attachment.type;
  const filename = typeof attachment === 'string' || attachment.type === 'pdf' ?
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
  return (_dispatch: AppDispatch) => {
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
  return (_dispatch: AppDispatch) => {
    request.post(buildUrl('/invoices/excel'))
      .responseType('blob')
      .set('Authorization', authService.getBearer())
      .send(ids)
      .then(res => {
        console.log('downloaded', res);
        const fileName = `invoices-${moment().format('YYYY-MM-DD')}.csv`;
        downloadAttachment(fileName, res.body);
      });
  };
}

export function downloadProjectsExcel(data: any[][]) {
  return (_dispatch: AppDispatch) => {
    request.post(buildUrl('/projects/excel'))
      .responseType('blob')
      .set('Authorization', authService.getBearer())
      .send(data)
      .then(res => {
        console.log('downloaded', res);
        const fileName = `projects-${moment().format('YYYY-MM-DD')}.xlsx`;
        downloadAttachment(fileName, res.body);
      });
  };
}

export function downloadProjectsMonthsExcel(data: any[][], projectMonth: string) {
  return (_dispatch: AppDispatch) => {
    request.post(buildUrl('/projects/month/excel'))
      .responseType('blob')
      .set('Authorization', authService.getBearer())
      .send(data)
      .then(res => {
        console.log('downloaded', res);
        const fileName = `projects-${projectMonth}-${moment().format('YYYY-MM-DD')}.xlsx`;
        downloadAttachment(fileName, res.body);
      });
  };
}

export function downloadProjectsMonthsFreelancerExcel(data: any[][], freelancer?: ConsultantModel) {
  return (_dispatch: AppDispatch) => {
    request.post(buildUrl('/projects/month/freelancer-excel'))
      .responseType('blob')
      .set('Authorization', authService.getBearer())
      .send(data)
      .then(res => {
        console.log('downloaded', res);
        let fileName: string;
        if (freelancer) {
          fileName = `freelancer-${freelancer.firstName}-${freelancer.name}-${moment().format('YYYY-MM-DD')}.xlsx`;
        } else {
          fileName = `freelancer-all-${moment().format('YYYY-MM-DD')}.xlsx`;
        }
        downloadAttachment(fileName, res.body);
      });
  };
}


export function downloadInvoicesZip(ids: string[]) {
  return (_dispatch: AppDispatch) => {
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
