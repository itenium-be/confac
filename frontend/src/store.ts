import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {app, config, invoices, clients, consultants, projects, projectsMonth, projectsMonthOverviews, users} from './reducers';

// https://redux-docs.netlify.com/recipes/configuring-your-store
function configureStore(preloadedState = undefined) {
  // const middlewares = [thunk as ThunkMiddleware<ConfacState, Actions>]; // Would need to type all the actions...
  const middlewares = [thunk];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = compose(...enhancers);

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

  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(rootReducer, preloadedState, composeEnhancers(composedEnhancers));
  return store;
}

export const store = configureStore();
