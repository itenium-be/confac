import {AnyAction} from 'redux';
import {ThunkDispatch, ThunkAction} from 'redux-thunk';
import {store} from '../store';

// Generic action type for reducers
// Note: `any` is required here because this interface is used by all reducers
// which expect to access arbitrary properties on the action object.
// Changing to `unknown` would require updating all reducer files.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Action<T = any> {
  type: string;
  payload?: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Infer RootState from store
export type RootState = ReturnType<typeof store.getState>;

// Dispatch type for thunk actions
export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction>;

// Type for thunk action creators
export type AppThunkAction<ReturnType = void> = ThunkAction<ReturnType, RootState, undefined, AnyAction>;
