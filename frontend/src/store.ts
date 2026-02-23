import {createStore, applyMiddleware, compose, combineReducers, StoreEnhancer} from 'redux';
import thunk from 'redux-thunk';
import {app, config, invoices, clients, consultants, projects, projectsMonth, projectsMonthOverviews, users} from './reducers';

// Extend Window interface for Redux DevTools
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

// https://redux-docs.netlify.com/recipes/configuring-your-store
function configureStore(preloadedState = undefined) {
  // const middlewares = [thunk as ThunkMiddleware<ConfacState, Actions>]; // Would need to type all the actions...
  const middlewares = [thunk];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = compose(...enhancers) as StoreEnhancer;

  const rootReducer = combineReducers({
    app,
    config,
    invoices,
    clients,
    consultants,
    projects,
    projectsMonth,
    projectsMonthOverviews,
    user: users,
  });

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(rootReducer, preloadedState, composeEnhancers(composedEnhancers));
  return store;
}

export const store = configureStore();
