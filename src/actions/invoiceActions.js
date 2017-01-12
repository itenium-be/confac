import request from 'superagent-bluebird-promise';
import { browserHistory } from 'react-router';

import { ACTION_TYPES } from './ActionTypes.js';
import { success, busyToggle } from './appActions.js';
import { buildUrl, catchHandler } from './fetch.js';
import t from '../trans.js';

function updateNextInvoiceNumber() {
  return {type: ACTION_TYPES.CONFIG_UPDATE_NEXTINVOICE_NUMBER};
}

export function createInvoice(data) {
  return dispatch => {
    dispatch(busyToggle());
    request.post(buildUrl('/invoices'))
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(data)
      .then(function(res) {
        dispatch(updateNextInvoiceNumber());
        dispatch({
          type: ACTION_TYPES.INVOICE_ADDED,
          invoice: res.body
        });

        dispatch(success(t('invoice.createConfirm')));
        //browserHistory.push('/invoice/' + res.body._id);
        browserHistory.push('/');
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle()));
  };
}

export function updateInvoice(data, successMsg) {
  return dispatch => {
    dispatch(busyToggle());
    request.put(buildUrl('/invoices'))
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(data)
      .then(function(res) {
        dispatch({
          type: ACTION_TYPES.INVOICE_UPDATED,
          invoice: data
        });

        dispatch(success(successMsg || t('toastrConfirm')));
        browserHistory.push('/');
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle()));
  };
}

export function deleteInvoice(invoice) {
  return dispatch => {
    dispatch(busyToggle());
    request.delete(buildUrl('/invoices'))
      .set('Content-Type', 'application/json')
      .send({id: invoice._id})
      .then(function(res) {
        console.log('invoice deleted', invoice); // eslint-disable-line
        dispatch({
          type: ACTION_TYPES.INVOICE_DELETED,
          id: invoice._id
        });
        dispatch(success(t('invoice.deleteConfirm')));
        return true;
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle())); // TODO: popup buttons also busybutton
  };
}

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
      .then(() => dispatch(busyToggle()));
  };
}

function downloadFile(fileName, base64) {
  var link = document.createElement('a');
  link.download = fileName;
  link.target = '_blank';
  link.href = 'data:application/octet-stream;base64,' + base64;
  link.click();
}

export function downloadInvoice(invoice, type) {
  // ATTN: Non-dispatchable
  // We're not storing entire files in the state!
  // + Would break the AttachmentDownloadIcon
  return request.get(buildUrl(`/attachments/${invoice._id}/${type}`))
    .set('Content-Type', 'application/json')
    .then(function(res) {
      downloadFile(getInvoiceFileName(invoice), res.body);
      return true;
    })
    .catch(catchHandler);
}

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
