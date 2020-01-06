import { ClientModel } from './ClientModels';
import { getNumeric, searchinize } from '../../utils';

export function searchClientFor(client: ClientModel, input: string): boolean {
  const text = searchinize(input);
  if (searchinize(`${client.name} ${client.address} ${client.city}`).includes(text)) {
    return true;
  }
  const numericText = getNumeric(text);
  if (numericText) {
    const numericBtw = getNumeric(client.btw);
    const numericTelephone = getNumeric(client.telephone);
    if (numericText === numericBtw || numericText === numericTelephone) {
      return true;
    }
  }
  return false;
}
