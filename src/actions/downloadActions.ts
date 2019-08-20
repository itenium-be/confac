import {buildUrl} from './fetch';
import EditInvoiceModel from '../components/invoice/EditInvoiceModel';
import { Attachment } from '../models';
import { EditClientModel } from '../components/client/ClientModels';


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





// function downloadBase64File(fileName: string, content: string): void {
//   var link = document.createElement('a');
//   link.download = fileName;
//   link.target = '_blank';
//   link.href = 'data:application/octet-stream;base64,' + content;
//   link.click();
// }


// function downloadFile(attachment: Attachment, content: string): void {
//   var link = document.createElement('a');
//   link.download = attachment.fileName;
//   const blob = b64ToBlob(content, attachment.fileType);
//   const blobUrl = URL.createObjectURL(blob);
//   link.href = blobUrl;
//   link.click();
// }


// function b64ToBlob(b64Data: string, contentType = '', sliceSize = 512): Blob {
//   const byteCharacters = atob(b64Data);
//   const byteArrays = [];

//   for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//     const slice = byteCharacters.slice(offset, offset + sliceSize);
//     const byteNumbers = new Array(slice.length);
//     for (let i = 0; i < slice.length; i++) {
//       byteNumbers[i] = slice.charCodeAt(i);
//     }

//     const byteArray = new Uint8Array(byteNumbers);
//     byteArrays.push(byteArray);
//   }

//   const blob = new Blob(byteArrays, { type: contentType });
//   return blob;
// }




// BUG: this solution doesn't work on Internet Exploder
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
