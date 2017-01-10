import keyMirror from 'keymirror';

export const ACTION_TYPES = keyMirror({
  CONFIG_FETCHED: '',
  CLIENTS_FETCHED: '',
  INVOICES_FETCHED: '',
  CONFIG_UPDATE_NEXTINVOICE_NUMBER: '',
});
