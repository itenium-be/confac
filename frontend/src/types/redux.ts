// Generic action type for reducers
export interface Action<T = any> {
  type: string;
  payload?: T;
  [key: string]: any;
}
