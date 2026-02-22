import {ClientModel} from '../components/client/models/ClientModels';
import {ACTION_TYPES} from '../actions';
import {getNewClient} from '../components/client/models/getNewClient';
import {Action} from '../types/redux';


function mapClient(client: ClientModel): ClientModel {
  return {...getNewClient(), ...client};
}

export const clients = (state: ClientModel[] = [], action: Action): ClientModel[] => {
  switch (action.type) {
    case ACTION_TYPES.CLIENTS_FETCHED:
      // console.log('CLIENTS_FETCHED', action.clients); // eslint-disable-line
      return action.clients.map(mapClient);

    case ACTION_TYPES.CLIENT_UPDATE: {
      // console.log('CLIENT_UPDATE', action); // eslint-disable-line
      const newState = state.filter(x => x._id !== action.client._id);
      newState.push(mapClient(action.client));
      return newState;
    }

    default:
      return state;
  }
};
