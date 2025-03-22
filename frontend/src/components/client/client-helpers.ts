import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ClientModel, ClientType } from './models/ClientModels';
import { t } from '../utils';
import { BtwResponse, formatBtw} from '../controls/form-controls/inputs/BtwInput';
import { getNewClient } from './models/getNewClient';
import { ConfacState } from '../../reducers/app-state';
import { ConfigModel } from '../config/models/ConfigModel';
import { countries } from '../controls/other/CountrySelect';
import { InvoiceLine } from '../invoice/models/InvoiceLineModels';


/** Returns a ClientModel with the data from the BTW lookup */
export function btwResponseToModel(config: ConfigModel, btw: BtwResponse | null, clientTypes?: ClientType[]): ClientModel {
  if (!btw)
    return getNewClient(config);

  return {
    ...getNewClient(config),
    name: btw.name,
    types: clientTypes ?? ['client', 'endCustomer'],
    btw: formatBtw(`${btw.countryCode}${btw.vatNumber}`),
    address: `${btw.address.street} ${btw.address.number}`,
    postalCode: btw.address.zip_code,
    city: btw.address.city,
    country: countries.find(c => c.label === btw.address.country)?.value || '',
  };
}


export const useClientAlreadyExists = (client: ClientModel | null) => {
  const clientWithSameKbo = useSelector((state: ConfacState) => state.clients
    .filter(x => x.btw === client?.btw)
    .find(x => x._id !== client?._id));

  const clientAlreadyExists = !!clientWithSameKbo && client?.btw && client.btw !== t('taxRequest');
  return clientAlreadyExists;
}



function getNewClientState(client: ClientModel | undefined): ClientModel | null {
  if (client) {
    return JSON.parse(JSON.stringify(client));
  }
  return null;
}


const checkIfCanSaveClient = (client: ClientModel | null): boolean => {
  if (!client)
    return false;

  if (client.name.length === 0) {
    return false;
  }
  if (client.slug && client.slug.length === 0) {
    // slug can only be filled in for an existing invoice
    // (it's set on the backend create)
    return false;
  }
  if (!client.btw)
    return false;

  return true;
}


export const useClientState = (clientId: string) => {
  const config = useSelector((state: ConfacState) => state.config);
  const storeClient = useSelector((state: ConfacState) => state.clients.find(x => x.slug === clientId || x._id === clientId));
  const [client, setSimpleClient] = useState(getNewClientState(storeClient));
  const clientAlreadyExists = useClientAlreadyExists(client);

  const setClient = (newClient: ClientModel): void => {
    if (newClient.country && client?.country !== newClient.country && !client?.defaultInvoiceLines.length && newClient.country !== 'BE') {
      let btwRemark: string;
      switch (newClient.country) {
        case 'UK':
          btwRemark = 'Belgian VAT not applicable - Article 44 EU Directive 2006/112/EC';
          break;
        default:
          btwRemark = 'Vrijgesteld van BTW overeenkomstig art. 39bis W. BTW';
      }

      const invoiceLines = config.defaultInvoiceLines.map(x => ({...x, tax: 0}));
      invoiceLines.push({type: 'section', desc: btwRemark, sort: invoiceLines.length} as InvoiceLine);
      newClient.defaultInvoiceLines = invoiceLines;
    }
    setSimpleClient(newClient);
  };

  useEffect(() => {
    if (storeClient) {
      setClient(getNewClientState(storeClient)!);
    } else {
      setSimpleClient(null);
    }
  }, [storeClient]); // eslint-disable-line

  return {
    client,
    setClient,
    clientAlreadyExists,
    canSaveClient: checkIfCanSaveClient(client) && (client?._id || !clientAlreadyExists),
  };
}
