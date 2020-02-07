import {ClientModel} from '../components/client/models/ClientModels';
import {ACTION_TYPES} from '../actions';
import {getNewClient} from '../components/client/models/getNewClient';

const emptyClient = getNewClient();

export const clients = (state: ClientModel[] = [], action): ClientModel[] => {
  switch (action.type) {
    case ACTION_TYPES.CLIENTS_FETCHED:
      // console.log('CLIENTS_FETCHED', action.clients); // eslint-disable-line
      return action.clients.map((client: ClientModel) => ({...emptyClient, ...client}));

    case ACTION_TYPES.CLIENT_UPDATE: {
      // console.log('CLIENT_UPDATE', action); // eslint-disable-line
      const newState = state.filter(x => x._id !== action.client._id);
      newState.push(action.client);
      return newState;
    }

    default:
      return state;
  }
};
