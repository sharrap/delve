import * as reducers from './reducers';

export { default as store } from './store';
export { actions } from './reducers';

export type AuthAction = reducers.AuthAction;
export type AuthState = reducers.AuthState;
export type AuthUser = reducers.AuthUser;

export type RootState = reducers.State;
export type ThunkAction<R> = reducers.ThunkAction<R>;
export type ThunkDispatch = reducers.ThunkDispatch;
