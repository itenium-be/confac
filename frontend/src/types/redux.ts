import {AnyAction} from 'redux';
import {ThunkDispatch} from 'redux-thunk';
import {store} from '../store';

// Generic action type for reducers
export interface Action<T = any> {
  type: string;
  payload?: T;
  [key: string]: any;
}

// Infer RootState from store
export type RootState = ReturnType<typeof store.getState>;

// Dispatch type for thunk actions
export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction>;
