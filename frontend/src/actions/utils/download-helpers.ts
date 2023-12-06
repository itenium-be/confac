import InvoiceModel from '../../components/invoice/models/InvoiceModel';
import { buildUrl } from './buildUrl';
import { invoiceReplacements } from '../../components/invoice/invoice-replacements';
import { FullProjectMonthModel } from '../../components/project/models/FullProjectMonthModel';
import { authService } from '../../components/users/authService';

export type DownloadAttachmentModelTypes = {
  invoice: string;
  quotation: string;
  client: string;
  'project_month_overview': string;
  'project_month': string;
}

/** An interface you say? */
export function getDownloadUrl(
  modelType: keyof DownloadAttachmentModelTypes,
  _id: string,
  attachmentType: string,
  fileName: string, downloadType?: 'preview' | 'download',
): string {

  let query = `?token=${authService.getTokenString()}`;
  query += downloadType === 'download' ? '&download=1' : '';
  return buildUrl(`/attachments/${modelType}/${_id}/${attachmentType}/${encodeURIComponent(fileName)}${query}`);
}


export function downloadAttachment(fileName: string, content: Blob): void {
  const link = document.createElement('a');
  link.download = fileName;
  const blobUrl = URL.createObjectURL(content);
  link.href = blobUrl;
  link.click();
}



export function getInvoiceFileName(fileName: string, invoice: InvoiceModel, extension: string, fullProjectMonth?: FullProjectMonthModel): string {
  return `${invoiceReplacements(fileName, invoice, fullProjectMonth)}.${extension}`;
}



export function previewPdf(fileName: string, content: Blob): void {
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
    console.error('previewPdf', err); // eslint-disable-line
  }
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
