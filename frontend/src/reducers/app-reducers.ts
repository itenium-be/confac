import {ACTION_TYPES} from '../actions';
import {AppState} from '../models';
import {defaultAppState} from './app-state';

// App is also config but only relevant for the session

export const app = (state: AppState = defaultAppState, action): AppState => {
  switch (action.type) {
    case ACTION_TYPES.SECURITY_CONFIG_FETCHED:
      return {...state, securityConfig: action.payload};

    case ACTION_TYPES.INITIAL_LOAD:
      return {...state, isLoaded: true, lastMonthsDownloaded: action.lastMonthsDownloaded};

    case ACTION_TYPES.APP_BUSYTOGGLE: {
      const busyCount = state.busyCount + (action.why === 'moreBusy' ? 1 : -1);
      return {...state, busyCount, isBusy: busyCount > 0};
    }

    case ACTION_TYPES.APP_SETTINGS_UPDATED:
      return {...state, settings: {...state.settings, ...action.payload}}

    case ACTION_TYPES.APP_INVOICE_FILTERSUPDATED:
      return {...state, invoiceFilters: action.filters};

    case ACTION_TYPES.APP_FILTERUPDATED:
      return {...state, filters: {...state.filters, [action.payload.feature]: action.payload.filters}};

    case ACTION_TYPES.APP_FILTER_OPEN_MONTHS_UPDATED:
      return {
        ...state,
        filters: {
          ...state.filters,
          projectMonths: {
            ...state.filters.projectMonths,
            openMonths: {
              ...state.filters.projectMonths.openMonths,
              [action.payload.month]: action.payload.opened,
            }
          }
        }
      };

    default:
      return state;
  }
};
