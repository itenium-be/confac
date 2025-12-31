import {IClient} from '../../../models/clients';

/**
 * Extracts and formats VAT number from a client
 * Removes spaces and dots from the VAT number
 * @param client The client to extract the VAT number from
 * @returns A formatted VAT number string without spaces or dots, or undefined if VAT is pending
 */
export function fromClient(client: IClient): string | undefined {
  if (client.btw.toLowerCase() === 'btw in aanvraag') {
    return undefined;
  }

  return client.btw
    .replace(/\s/g, '') // Strip spaces
    .replace(/\./g, ''); // Strip dots
}
