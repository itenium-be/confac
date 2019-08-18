import keyMirror from 'keymirror';

export const ACTION_TYPES = keyMirror({
  INITIAL_LOAD: '',
  APP_BUSYTOGGLE: '',
  APP_INVOICE_FILTERSUPDATED: '',

  CONFIG_FETCHED: '',
  CONFIG_UPDATE: '',

  CLIENTS_FETCHED: '',
  CLIENT_UPDATE: '', // client inserts are also done with update

  INVOICES_FETCHED: '',
  INVOICE_DELETED: '',
  INVOICE_ADDED: '',
  INVOICE_UPDATED: '',
});
