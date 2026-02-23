import {AnyAction} from 'redux';
import {ThunkDispatch} from 'redux-thunk';
import {useDispatch} from 'react-redux';
import {store} from '../store';

// Generic action type for reducers
export interface Action<T = unknown> {
  type: string;
  payload?: T;
  [key: string]: unknown;
}

// Infer RootState from store
export type RootState = ReturnType<typeof store.getState>;

// Dispatch type for thunk actions
export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction>;

// Typed useDispatch hook for thunks
export const useAppDispatch = () => useDispatch<AppDispatch>();
