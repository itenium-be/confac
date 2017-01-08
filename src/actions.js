import keyMirror from 'keymirror';
import request from 'superagent';

const urlPrefix = 'http://localhost:3001/api'; // TODO: put this in some environment config

export const ACTION_TYPES = keyMirror({
  CONFIG_FETCHED: '',
  CLIENTS_FETCHED: '',
});

const httpGet = url => fetch('http://localhost:3001/api' + url).then(res => res.json());
// const httpGet = url => {
//   console.log('httpGet', url);
//   return request.get(urlPrefix + url)
//   .set('Accept', 'application/json')
//   .end(function(err, res) {
//     console.log('wuuk', url, res);
//     return JSON.parse(res.body);
//   });
// }

// const httpPost = (url, body) => request.post(urlPrefix + url)
//   .set('Content-Type', 'application/json')
//   .send(body)
//   .end(function(err, res) {
//     console.log('posted return', res);
//     return res.body;
//   });



function fetchClients() {
  return dispatch => {
    return httpGet('/clients')
      .then(data => {
        dispatch({
          type: ACTION_TYPES.CLIENTS_FETCHED,
          clients: data
        });
      });
  };
}

function fetchConfig() {
  return dispatch => {
    return httpGet('/config')
      .then(data => {
        dispatch({
          type: ACTION_TYPES.CONFIG_FETCHED,
          config: data
        });
      });
  };
}

export function initialLoad() {
  return dispatch => {
    dispatch(fetchClients());
    dispatch(fetchConfig());
  };
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

export function createInvoice(data) {
  return () => {
    request.post(urlPrefix + '/invoices/create')
      .set('Content-Type', 'application/json')
      .send(data)
      .end(function(err, res) {
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
    request.post(urlPrefix + '/invoices/preview')
      .set('Content-Type', 'application/json')
      .send(data)
      .end(function(err, res) {

        const pdfAsDataUri = 'data:application/pdf;base64,' + res.text;
        openWindow(pdfAsDataUri, getInvoiceFileName(data));
      });
  };
}
