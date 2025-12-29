import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useBlocker} from 'react-router';
import {ClientModel, ClientType} from './models/ClientModels';
import {saveClient as dispatchSaveClient} from '../../actions/index';
import {t} from '../utils';
import {BtwResponse} from '../controls/form-controls/inputs/BtwInput';
import {getNewClient} from './models/getNewClient';
import {ConfacState} from '../../reducers/app-state';
import {ConfigModel} from '../config/models/ConfigModel';
import {countries} from '../controls/other/CountrySelect';
import {InvoiceLine} from '../invoice/models/InvoiceLineModels';
import {formatBtw} from '../controls/form-controls/inputs/BtwInputHelpers';


/** Returns a ClientModel with the data from the BTW lookup */
export function btwResponseToModel(config: ConfigModel, btw: BtwResponse | null, clientTypes?: ClientType[]): ClientModel {
  if (!btw)
    return getNewClient(config);

  return {
    ...getNewClient(config),
    name: btw.name,
    types: clientTypes ?? ['client', 'endCustomer'],
    btw: formatBtw(`${btw.countryCode}${btw.vatNumber}`),
    street: btw.address.street,
    streetNr: btw.address.number,
    streetBox: '',
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
};



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
};


export const useClientState = (clientId: string) => {
  const config = useSelector((state: ConfacState) => state.config);
  const storeClient = useSelector((state: ConfacState) => state.clients.find(x => x.slug === clientId || x._id === clientId));
  const [client, setSimpleClient] = useState(storeClient ?? null);
  const clientAlreadyExists = useClientAlreadyExists(client);
  const dispatch = useDispatch();

  const [hasChanges, setHasChanges] = useState(false);
  const blocker = useBlocker(({currentLocation, nextLocation}) => {
    if (currentLocation.pathname === nextLocation.pathname) {
      return false;
    }

    return hasChanges;
  });

  const setClient = (newClient: ClientModel): void => {
    setHasChanges(true);
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

  const saveClient = () => {
    setHasChanges(false);
    dispatch(dispatchSaveClient(client!) as any);
  };

  useEffect(() => {
    setHasChanges(false);
    if (storeClient) {
      setSimpleClient(storeClient);
    } else {
      setSimpleClient(null);
    }
  }, [storeClient]);

  return {
    client,
    setClient,
    clientAlreadyExists,
    canSaveClient: checkIfCanSaveClient(client) && (client?._id || !clientAlreadyExists),
    blocker,
    saveClient,
  };
};
