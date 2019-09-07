import request from 'superagent-bluebird-promise';
import {buildUrl, catchHandler} from './utils/fetch';
import InvoiceModel from '../components/invoice/models/InvoiceModel';
import { Attachment } from '../models';
import { ClientModel } from '../components/client/models/ClientModels';
import moment from 'moment';


export function getInvoiceDownloadUrl(invoice: InvoiceModel, attachment: 'pdf' | Attachment = 'pdf', downloadType?: 'preview' | 'download'): string {
  const fileType = invoice.isQuotation ? 'quotation' : 'invoice';
  const query = downloadType === 'download' ? '?download=1' : '';
  const fileName = attachment === 'pdf' ? getInvoiceFileName(invoice) : attachment.fileName;
  const attachmentType = attachment === 'pdf' ? 'pdf' : attachment.type;
  return buildUrl(`/attachments/${fileType}/${invoice._id}/${attachmentType}/${encodeURIComponent(fileName)}${query}`);
}


export function getClientDownloadUrl(client: ClientModel, attachment: Attachment): string {
  return buildUrl(`/attachments/client/${client._id}/${attachment.type}/${encodeURIComponent(attachment.fileName)}?download=1`);
}

export function invoiceReplacements(input: string, invoice: InvoiceModel): string {
  let str = input;

  const nrRegex = /\{nr:(\d+)\}/;
  const nrMatch = str.match(nrRegex);
  if (nrMatch) {
    const nrSize = Math.max(parseInt(nrMatch[1], 10), invoice.number.toString().length);
    str = str.replace(nrRegex, ('000000' + invoice.number).slice(-nrSize));
  }

  str = str.replace(/\{nr\}/g, invoice.number.toString());

  const dateRegex = /\{date:([^}]+)\}/;
  const dateMatch = str.match(dateRegex);
  if (dateMatch && invoice.date) {
    const dateFormat = dateMatch[1];
    str = str.replace(dateRegex, invoice.date.format(dateFormat));
  }

  if (str.indexOf('{orderNr}') !== -1) {
    str = str.replace('{orderNr}', invoice.orderNr);
  }

  if (str.indexOf('{clientName}') !== -1) {
    str = str.replace('{clientName}', invoice.client.name);
  }

  // Object.keys(data).forEach(invoiceProp => {
  //   str = str.replace('{' + invoiceProp + '}', data[invoiceProp]);
  // });

  return str;
}


function getInvoiceFileName(invoice: InvoiceModel): string {
  var fileName = invoice.fileName;
  return invoiceReplacements(fileName, invoice) + '.pdf';
}


export function previewInvoice(data: InvoiceModel) {
  return dispatch => {
    request.post(buildUrl('/invoices/preview'))
      .responseType('blob')
      .send(data)
      .then(function(res) {
        // console.log('previewInvoice response', res.body);
        previewPdf(getInvoiceFileName(data), res.body);
        return res.text;
      })
      .catch(catchHandler);
  };
}



function previewPdf(fileName: string, content: Blob): void {
  try {
    const blobUrl = URL.createObjectURL(content);
    const previewWindow = window.open(blobUrl);
    if (previewWindow) {
      // These didn't work for setting the document.title
      // setTimeout(() => previewWindow.document.title = fileName, 3000);
      // previewWindow.document.write('<title>My PDF File Title</title>');

      // This would work for setting a document title but need to do some additional styling
      // previewWindow.document.write(`
      //   <html><head><title>Your Report Title</title></head><body height="100%" width="100%">
      //     <iframe src="' + blobUrl + '" height="100%" width="100%"></iframe>
      //   </body></html>`);
    }
  } catch (err) {
    console.error('previewPdf', err);
  }
}


export function downloadInvoicesExcel(ids: string[]) {
  return dispatch => {
    request.post(buildUrl('/invoices/excel'))
      .responseType('blob')
      .send(ids)
      .then(res => {
        console.log('downloaded', res);
        const fileName = `invoices-${moment().format('YYYY-MM-DD')}.csv`;
        downloadAttachment(fileName, res.body);
      });
  }
}


export function downloadInvoicesZip(ids: string[]) {
  return dispatch => {
    request.post(buildUrl('/attachments'))
      .responseType('blob')
      .send(ids)
      .then(res => {
        // console.log('downloaded', res);
        const fileName = `invoices-${moment().format('YYYY-MM-DD')}.zip`;
        downloadAttachment(fileName, res.body);
      });
  }
}




function downloadAttachment(fileName: string, content: Blob): void {
  var link = document.createElement('a');
  link.download = fileName;
  const blobUrl = URL.createObjectURL(content);
  link.href = blobUrl;
  link.click();
}



// ATTN: This doesn't really work once deployed
// function downloadBase64File(fileName: string, content: string): void {
//   var link = document.createElement('a');
//   link.download = fileName;
//   link.target = '_blank';
//   link.href = 'data:application/octet-stream;base64,' + content;
//   link.click();
// }



// ATTN: this solution doesn't work on Internet Exploder
// function openWindow(pdf: string, fileName: string): void {
//   // GET request /attachment that just returns the bytestream
//   // and then here:
//   //window.open('data:application/pdf,' + escape(pdf));
//   // (that could work right?)

//   // Does work on Chrome, Firefox and Chrome
//   var win = window.open('', '', '');
//   if (win && win.document) {
//     const html = `
//       <html>
//         <head>
//           <title>${fileName}</title>
//           <style>
//             * { margin:0; padding:0 }
//             body { margin:0; padding:0; text-align:center }
//             #hold_my_iframe { padding:0px; margin:0 auto; width:100%; height:100% }
//           </style>
//         </head>
//         <body>
//           <table border=0 cellspacing=0 cellpadding=0 id="hold_my_iframe">
//             <iframe src="${pdf}" width=100% height=100% marginwidth=0 marginheight=0 frameborder=0></iframe>
//           </table>
//         </body>
//       </html>`;

//     win.document.write(html);
//     win.document.title = fileName;

//   } else {
//     failure(t('controls.popupBlocker'), t('controls.popupBlockerTitle'), 8000);
//   }
// }
