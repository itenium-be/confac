import request from 'superagent';
import { ACTION_TYPES } from './ActionTypes.js';
import { buildUrl } from './fetch.js';

function getInvoiceFileName(data) {
  var fileName = data.client.invoiceFileName;

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

  return fileName + '.pdf';
}

function updateNextInvoiceNumber() {
  return {type: ACTION_TYPES.CONFIG_UPDATE_NEXTINVOICE_NUMBER};
}

export function createInvoice(data) {
  return dispatch => {
    request.post(buildUrl('/invoices/create'))
      .set('Content-Type', 'application/json')
      .send(data)
      .end(function(err, res) {
        dispatch(updateNextInvoiceNumber());

        var link = document.createElement('a');
        link.download = getInvoiceFileName(data);
        link.target = '_blank';
        link.href = 'data:application/octet-stream;base64,' + res.text;
        link.click();
      });
  };
}


function openWindow(pdf, fileName) {
  var win = window.open('', '', '');
  if (win.document) {
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
  }
}

export function previewInvoice(data) {
  return () => {
    request.post(buildUrl('/invoices/preview'))
      .set('Content-Type', 'application/json')
      .send(data)
      .end(function(err, res) {

        const pdfAsDataUri = 'data:application/pdf;base64,' + res.text;
        openWindow(pdfAsDataUri, getInvoiceFileName(data));
      });
  };
}
