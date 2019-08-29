import { ClientModel } from './ClientModels';
import { getNumeric } from '../../util';
export function searchClientFor(client: ClientModel, input: string): boolean {
  const text = input.toLowerCase().trim();
  if ((`${client.name} ${client.address} ${client.city}`).toLowerCase().includes(text)) {
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
