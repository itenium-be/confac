import {ClientModel, InvoiceClientModel} from './ClientModels';
import {getNumeric, searchinize} from '../../utils';
import {ClientListFilters} from '../../controls/table/table-models';

export const searchClientFor = (model: InvoiceClientModel, input: string): boolean => {
  if (!input) {
    return true;
  }

  const text = searchinize(input);
  if (searchinize(`${model.name} ${model.address} ${model.postalCode} ${model.city}`).includes(text)) {
    return true;
  }

  const numericText = getNumeric(text);
  if (numericText) {
    const numericBtw = getNumeric(model.btw);
    const numericTelephone = getNumeric(model.telephone);
    if (numericText === numericBtw || numericText === numericTelephone) {
      return true;
    }
  }

  return false;
};

export const searchClientForList = (filters: ClientListFilters, model: ClientModel): boolean => {
  if (!filters.showInactive && !model.active) {
    return false;
  }

  return searchClientFor(model, filters.freeText || '');
};
