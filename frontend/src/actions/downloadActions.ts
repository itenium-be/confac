import moment from 'moment';
import {api} from './utils/api-client';
import {catchHandler} from './utils/fetch';
import InvoiceModel from '../components/invoice/models/InvoiceModel';
import {Attachment, CoreInvoiceAttachments} from '../models';
import {ClientModel} from '../components/client/models/ClientModels';
import {getInvoiceFileName, getDownloadUrl, previewPdf, downloadAttachment} from './utils/download-helpers';
import {ProjectMonthOverviewModel} from '../components/project/models/ProjectMonthModel';
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
  return async (_dispatch: AppDispatch) => {
    try {
      const res = await api.post<Blob>('/invoices/preview', data, {responseType: 'blob'});
      previewPdf(getInvoiceFileName(fileName, data, 'pdf'), res.body);
    } catch (err) {
      catchHandler(err);
    }
  };
}




export function downloadInvoicesExcel(ids: string[]) {
  return async (_dispatch: AppDispatch) => {
    const res = await api.post<Blob>('/invoices/excel', ids, {responseType: 'blob'});
    console.log('downloaded', res);
    const fileName = `invoices-${moment().format('YYYY-MM-DD')}.csv`;
    downloadAttachment(fileName, res.body);
  };
}

export type ExcelCellValue = string | number | boolean | null | undefined;
export type ExcelRowData = ExcelCellValue[];
export type ExcelSheetData = ExcelRowData[];

export function downloadProjectsExcel(data: ExcelSheetData) {
  return async (_dispatch: AppDispatch) => {
    const res = await api.post<Blob>('/projects/excel', data, {responseType: 'blob'});
    console.log('downloaded', res);
    const fileName = `projects-${moment().format('YYYY-MM-DD')}.xlsx`;
    downloadAttachment(fileName, res.body);
  };
}

export function downloadProjectsMonthsExcel(data: ExcelSheetData, projectMonth: string) {
  return async (_dispatch: AppDispatch) => {
    const res = await api.post<Blob>('/projects/month/excel', data, {responseType: 'blob'});
    console.log('downloaded', res);
    const fileName = `projects-${projectMonth}-${moment().format('YYYY-MM-DD')}.xlsx`;
    downloadAttachment(fileName, res.body);
  };
}

export function downloadProjectsMonthsFreelancerExcel(data: ExcelSheetData, freelancer?: ConsultantModel) {
  return async (_dispatch: AppDispatch) => {
    const res = await api.post<Blob>('/projects/month/freelancer-excel', data, {responseType: 'blob'});
    console.log('downloaded', res);
    let fileName: string;
    if (freelancer) {
      fileName = `freelancer-${freelancer.firstName}-${freelancer.name}-${moment().format('YYYY-MM-DD')}.xlsx`;
    } else {
      fileName = `freelancer-all-${moment().format('YYYY-MM-DD')}.xlsx`;
    }
    downloadAttachment(fileName, res.body);
  };
}


export function downloadInvoicesZip(ids: string[]) {
  return async (_dispatch: AppDispatch) => {
    const res = await api.post<Blob>('/attachments', ids, {responseType: 'blob'});
    const fileName = `invoices-${moment().format('YYYY-MM-DD')}.zip`;
    downloadAttachment(fileName, res.body);
  };
}
