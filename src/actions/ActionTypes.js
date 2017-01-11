import keyMirror from 'keymirror';

export const ACTION_TYPES = keyMirror({
  INITIAL_LOAD: '',
  APP_BUSYTOGGLE: '',

  CONFIG_FETCHED: '',
  CONFIG_UPDATE_NEXTINVOICE_NUMBER: '',

  CLIENTS_FETCHED: '',

  INVOICES_FETCHED: '',
  INVOICE_DELETED: '',
  INVOICE_ADDED: '',
  INVOICE_UPDATED: '',
});
