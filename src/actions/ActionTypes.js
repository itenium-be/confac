import keyMirror from 'keymirror';

export const ACTION_TYPES = keyMirror({
  CONFIG_FETCHED: '',
  CONFIG_UPDATE_NEXTINVOICE_NUMBER: '',

  CLIENTS_FETCHED: '',

  INVOICES_FETCHED: '',
  INVOICE_DELETED: '',
});
