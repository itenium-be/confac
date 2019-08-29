import request from 'superagent-bluebird-promise';
import {buildUrl, catchHandler} from './fetch';
import EditInvoiceModel from '../components/invoice/models/EditInvoiceModel';
import { Attachment } from '../models';
import { EditClientModel } from '../components/client/models/ClientModels';


export function getInvoiceDownloadUrl(invoice: EditInvoiceModel, attachmentType = 'pdf', downloadType?: 'preview' | 'download'): string {
  const fileType = invoice.isQuotation ? 'quotation' : 'invoice';
  const query = downloadType === 'download' ? '?download=1' : '';
  const fileName = attachmentType === 'pdf' ? getInvoiceFileName(invoice) : '';
  return buildUrl(`/attachments/${fileType}/${invoice._id}/${attachmentType}/${encodeURIComponent(fileName)}${query}`);
}


export function getClientDownloadUrl(client: EditClientModel, attachment: Attachment): string {
  return buildUrl(`/attachments/client/${client._id}/${attachment.type}/${encodeURIComponent(attachment.fileName)}?download=1`);
}



function getInvoiceFileName(data: EditInvoiceModel): string {
  var fileName = data.fileName;

  const nrRegex = /\{nr:(\d+)\}/;
  const nrMatch = fileName.match(nrRegex);
  if (nrMatch) {
    const nrSize = parseInt(nrMatch[1], 10);
    fileName = fileName.replace(nrRegex, ('000000' + data.number).slice(-nrSize));
  }

  const dateRegex = /\{date:([^}]+)\}/;
  const dateMatch = fileName.match(dateRegex);
  if (dateMatch) {
    const dateFormat = dateMatch[1];
    fileName = fileName.replace(dateRegex, data.date.format(dateFormat));
  }

  if (fileName.indexOf('{orderNr}') !== -1) {
    fileName = fileName.replace('{orderNr}', data.orderNr);
  }
  if (fileName.indexOf('{clientName}') !== -1) {
    fileName = fileName.replace('{clientName}', data.client.name);
  }

  // Object.keys(data).forEach(invoiceProp => {
  //   fileName = fileName.replace('{' + invoiceProp + '}', data[invoiceProp]);
  // });

  return fileName + '.pdf';
}


export function previewInvoice(data: EditInvoiceModel) {
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
      previewWindow.document.title = fileName;
      previewWindow.document.write('<title>My PDF File Title</title>');
    }
  } catch (err) {
    console.error('previewPdf', err);
  }
}



// ATTN: This works for downloading something
// function downloadAttachment(fileName: string, content: Blob): void {
//   var link = document.createElement('a');
//   link.download = fileName;
//   const blobUrl = URL.createObjectURL(content);
//   link.href = blobUrl;
//   link.click();
// }



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
