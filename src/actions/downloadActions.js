import request from 'superagent-bluebird-promise';

import {failure, busyToggle} from './appActions.js';
import {buildUrl, catchHandler} from './fetch.js';
import t from '../trans.js';
import {buildAttachmentUrl} from './attachmentActions.js';


export function previewInvoice(data) {
  return dispatch => {
    dispatch(busyToggle());
    request.post(buildUrl('/invoices/preview'))
      .set('Content-Type', 'application/json')
      .send(data)
      .then(function(res) {
        const pdfAsDataUri = 'data:application/pdf;base64,' + res.text;
        openWindow(pdfAsDataUri, getInvoiceFileName(data));
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}


export function downloadInvoice(invoice, attachment) {
  // ATTN: Non-dispatchable
  // We're not storing entire files in the state!
  // + Would break the AttachmentDownloadIcon
  return request.get(buildAttachmentUrl(invoice, attachment.type))
    .set('Content-Type', 'application/json')
    .then(function(res) {
      var fileName;
      if (attachment.type === 'pdf') {
        fileName = getInvoiceFileName(invoice);
        downloadBase64File(fileName, res.body);
      } else {
        //console.log('grr', attachment, res.body);
        downloadFile(attachment, res.body);
      }

      return true;
    })
    .catch(catchHandler);
}


export function downloadClientAttachment(client, attachment) {
  // ATTN: Non-dispatchable
  // We're not storing entire files in the state!
  // + Would break the AttachmentDownloadIcon
  return request.get(buildAttachmentUrl(client, attachment.type))
    .set('Content-Type', 'application/json')
    .then(function(res) {
      //console.log('grr', attachment, res.body);
      downloadFile(attachment, res.body);
      return true;
    })
    .catch(catchHandler);
}


export function getInvoiceFileName(data) {
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


export function openWindow(pdf, fileName) {
  // TODO: this solution doesn't work on Internet Exploder
  // GET request /attachment that just returns the bytestream
  // and then here:
  //window.open('data:application/pdf,' + escape(pdf));
  // (that could work right?)

  // Does work on Chrome, Firefox and Chrome
  var win = window.open('', '', '');
  if (win && win.document) {
    const html = `
      <html>
        <head>
          <title>${fileName}</title>
          <style>
            * { margin:0; padding:0 }
            body { margin:0; padding:0; text-align:center }
            #hold_my_iframe { padding:0px; margin:0 auto; width:100%; height:100% }
          </style>
        </head>
        <body>
          <table border=0 cellspacing=0 cellpadding=0 id="hold_my_iframe">
            <iframe src="${pdf}" width=100% height=100% marginwidth=0 marginheight=0 frameborder=0></iframe>
          </table>
        </body>
      </html>`;

    win.document.write(html);
    win.document.title = fileName;

  } else {
    failure(t('controls.popupBlockerTitle'), t('controls.popupBlocker'), 8000);
  }
}


function downloadBase64File(fileName, content) {
  var link = document.createElement('a');
  link.download = fileName;
  link.target = '_blank';
  link.href = 'data:application/octet-stream;base64,' + content;
  link.click();
}


function downloadFile(attachment, content) {
  var link = document.createElement('a');
  link.download = attachment.fileName;
  const blob = b64ToBlob(content, attachment.fileType);
  const blobUrl = URL.createObjectURL(blob);
  link.href = blobUrl;
  link.click();
}


function b64ToBlob(b64Data, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}
